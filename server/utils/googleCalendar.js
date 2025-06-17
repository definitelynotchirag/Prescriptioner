// const { google } = require('googleapis');
// const {path} = require("path");
// require('dotenv').config();

// const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// async function authenticate() {
//     const client_id = process.env.GOOGLE_CLIENT_ID;
//     const client_secret = process.env.GOOGLE_CLIENT_SECRET;
//     const redirect_uris = process.env.GOOGLE_REDIRECT_URI;

//     const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris);

//     const TOKEN_PATH = path.join(__dirname, 'token.json');

//     if (fs.existsSync(TOKEN_PATH)) {
//         const token = fs.readFileSync(TOKEN_PATH);
//         oAuth2Client.setCredentials(JSON.parse(token));
//     } else {
//         const authUrl = oAuth2Client.generateAuthUrl({
//             access_type: 'offline',
//             scope: SCOPES
//         });
//         console.log('Authorize this app by visiting this url:', authUrl);

//     }
//     return oAuth2Client;
// }

// async function updateEvent(auth, calendarId, eventId, updatedEvent) {
//     const calendar = google.calendar({ version: 'v3', auth });
//     const res = await calendar.events.update({
//         calendarId: calendarId,
//         eventId: eventId,
//         resource: updatedEvent,
//     });
//     return res.data.htmlLink;
// }

// module.exports = {
//     authenticate,
//     updateEvent
// };

const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        const client = google.auth.fromJSON(credentials);

        // Test if the credentials are still valid
        try {
            await client.getAccessToken();
            return client;
        } catch (error) {
            console.log("Saved credentials are invalid, will need to re-authenticate");
            return null;
        }
    } catch (err) {
        console.log("No saved credentials found");
        return null;
    }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: "authorized_user",
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
        access_token: client.credentials.access_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Create a new OAuth2 client for web application flow
 */
async function createOAuth2Client() {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.web || keys.installed;

    const oAuth2Client = new google.auth.OAuth2(key.client_id, key.client_secret, key.redirect_uris[0]);

    return oAuth2Client;
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }

    // If no valid credentials, create a new OAuth2 client for manual auth
    const oAuth2Client = await createOAuth2Client();

    // Generate auth URL for manual authentication
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        prompt: "consent", // Force consent screen to get refresh token
    });

    console.log("\n=== GOOGLE CALENDAR AUTHENTICATION REQUIRED ===");
    console.log("Please visit this URL to authorize the application:");
    console.log(authUrl);
    console.log("===============================================\n");

    // For now, throw an error to indicate manual auth is needed
    throw new Error("Manual authentication required. Please visit the URL above and complete the OAuth flow.");
}

/**
 * Exchange authorization code for tokens
 */
async function exchangeCodeForTokens(code) {
    const oAuth2Client = await createOAuth2Client();
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    await saveCredentials(oAuth2Client);
    return oAuth2Client;
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth) {
    try {
        const calendar = google.calendar({ version: "v3", auth });
        const res = await calendar.events.list({
            calendarId: "primary",
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: "startTime",
        });
        const events = res.data.items;
        if (!events || events.length === 0) {
            console.log("No upcoming events found.");
            return [];
        }
        console.log("Upcoming 10 events:");
        events.map((event, i) => {
            const start = event.start.dateTime || event.start.date;
            console.log(`${start} - ${event.summary}`);
        });
        return events;
    } catch (error) {
        console.error("Error listing events:", error);
        throw error;
    }
}

module.exports = {
    authorize,
    exchangeCodeForTokens,
    createOAuth2Client,
    listEvents,
};
