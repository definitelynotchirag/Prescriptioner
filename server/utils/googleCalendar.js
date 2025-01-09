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

const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
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
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
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
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */



// async function createEvent(auth){
//     const calendar = google.calendar({version: 'v3', auth});
//     calendar.events.insert({
//         auth: auth,
//         calendarId: 'primary',
//         resource: event,
//       }, function(err, event) {
//         if (err) {
//           console.log('There was an error contacting the Calendar service: ' + err);
//           return;
//         }
//         console.log('Event created: %s', event.htmlLink);
//       });
      
// }


async function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log('No upcoming events found.');
    return;
  }
  console.log('Upcoming 10 events:');
  events.map((event, i) => {
    const start = event.start.dateTime || event.start.date;
    console.log(`${start} - ${event.summary}`);
  });
}

authorize().then(listEvents).catch(console.error);

module.exports = {authorize};
