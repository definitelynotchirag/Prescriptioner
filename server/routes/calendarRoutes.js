const express = require('express');
const router = express.Router();
const { authorize   } = require('../utils/googleCalendar');
const {google} = require('googleapis');


router.get('/auth-url', async (req, res) => {
  try {
    const auth = await authorize();
    const authUrl = auth.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],
    });
    res.json({ authUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating auth URL');
  }
});


router.post('/create-event', async (req, res) => {
  try {
    const auth = await authorize();
    const { summary, location, description, startDateTime, endDateTime } = req.body;

    const event = {
      summary,
      location,
      description,
      start: {
        dateTime: new Date(startDateTime),
        timeZone: 'America/Los_Angeles', 
      },
      end: {
        dateTime: new Date(endDateTime),
        timeZone: 'America/Los_Angeles',
      },
    };

    const calendar = google.calendar({version: 'v3', auth});
     calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      }, function(err, event) {
        if (err) {
          console.log('There was an error contacting the Calendar service: ' + err);
          return;
        }
        console.log('Event created: ');
        return res.status(200).json();
      }); 
      
}
 catch (err) {
    console.error(err);
    res.status(500).send('Error creating event');
  }
});


router.put('/update-event-by-summary/:summary', async (req, res) => {
  try {
    const auth = await authorize();
    const { summary } = req.params; // Get event summary from the request parameters

    const calendar = google.calendar({ version: 'v3', auth });
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const event = events.data.items.find(event => event.summary === summary);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const { location, description, startDateTime, endDateTime } = req.body;
    const updatedEvent = {
      summary,
      location,
      description,
      start: {
        dateTime: new Date(startDateTime),
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: new Date(endDateTime),
        timeZone: 'America/Los_Angeles',
      },
    };

    calendar.events.update({
      calendarId: 'primary',
      eventId: event.id, // Use the found event's ID
      resource: updatedEvent,
    }, (err, updatedEvent) => {
      if (err) {
        console.error('Error updating the event:', err);
        return res.status(500).json({ error: 'Error updating the event' });
      }
      console.log('Event updated:', updatedEvent.data.htmlLink);
      return res.status(200).json({ message: 'Event updated', eventLink: updatedEvent.data.htmlLink });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating event');
  }
});


router.delete('/delete-event-by-summary/:summary', async (req, res) => {
  try {
    const auth = await authorize();
    const { summary } = req.params; // Get event summary from the request parameters

    const calendar = google.calendar({ version: 'v3', auth });
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const event = events.data.items.find(event => event.summary === summary);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    calendar.events.delete({
      calendarId: 'primary',
      eventId: event.id, // Use the found event's ID
    }, (err) => {
      if (err) {
        console.error('Error deleting the event:', err);
        return res.status(500).json({ error: 'Error deleting the event' });
      }
      console.log('Event deleted');
      return res.status(200).json({ message: 'Event deleted successfully' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting event');
  }
});


module.exports = router;
