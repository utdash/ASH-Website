/**
 * Dependencies: jQuery
 */

//  Immediately-invoked function expression.
(function() {
    //  ASH Events Calendar
    const calendarId = 'sg9qvrc3c774rl92p65qbceig0@group.calendar.google.com';

    //  Created at console.developers.google.com by ASH admin account.
    const apiKey = 'AIzaSyCDfhDvk1lDQTivXTdrMHPIEQgnXHxsAGk';

    if (typeof $ === 'undefined') {
        console.error('eventLoader.js cannot run without jQuery. ' +
                      'Make sure jQuery has been included before eventLoader.js.');
    }
    else {
        //  Load events from the Google Calendar when the DOM is ready.
        $(loadEvents);
    }

    async function loadEvents() {
        let eventsContainer = document.getElementById('eventsContainer');

        if (!eventsContainer) {
            console.error('No element found with ID "eventsContainer".');
            return;
        }

        empty(eventsContainer);
        eventsContainer.append('Loading events...');

        try {
            const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}` +
                        `/events?key=${apiKey}&orderBy=startTime&singleEvents=true&` +
                        `timeMin=${new Date().toISOString()}`;
            let response;

            try {
                response = await fetch(url);
            }
            catch (err) {
                console.error('Failed to fetch calendar events.', err);
                throw err;
            }

            //  In case of HTTP error
            if (response.status !== 200) {
                throw new Error(`Request for Google Calendar events returned code ${response.status}.`);
            }

            try {
                response = await response.json();
            }
            catch (err) {
                throw new Error('The Google server\'s response was not valid JSON...?');
            }

            //  Convert event JSON objects to divs for the page.
            let eventDivs = response.items.map(toEventDiv);

            //  Add divs to this fragment first to avoid unnecessary lag
            let fragment = document.createDocumentFragment();

            //  Each div gets passed as a separate argument
            fragment.append(...eventDivs);

            //  Add all the events to the list on the page.
            empty(eventsContainer);
            eventsContainer.append(fragment);
        }
        catch (err) {
            empty(eventsContainer);
            eventsContainer.append('Oh no! Something went wrong while trying to load upcoming events :(');

            console.error(err);

            return;
        }

        function empty(eventsContainer) {
            let first;
            while ((first = eventsContainer.firstChild)) {
                eventsContainer.removeChild(first);
            }
        }
    }

    function toEventDiv(event) {
        let timeStart = new Date(event.start.dateTime);
        let timeEnd = new Date(event.end.dateTime);

        let timeValue;

        //  If the event starts and ends on different days
        if (timeStart.toDateString() !== timeEnd.toDateString()) {
            timeStart = `${getTimeString(timeStart)} on ${getDateString(timeStart)}`;
            timeEnd = `${getTimeString(timeEnd)} on ${getDateString(timeEnd)}`;

            //  Get final time display value
            timeValue = `${timeStart} – ${timeEnd}`;
        }
        else {
            let day = getDateString(timeStart);
            timeStart = getTimeString(timeStart);
            timeEnd = getTimeString(timeEnd);

            //  Get final time display value
            timeValue = `${timeStart} – ${timeEnd} on ${day}`;
        }

        //  Create timeValueSpan
        let timeValueSpan = document.createElement('span');

        timeValueSpan.append(timeValue);
        timeValueSpan.classList.add('eventDetailsRowValue');

        //  Create timeDiv (contains timeValueSpan)
        let timeDiv = document.createElement('div');

        timeDiv.classList.add('eventDetailsRow');
        timeDiv.append('When: ', timeValueSpan);

        //  Create locationValueSpan
        let locationValueSpan = document.createElement('span');

        locationValueSpan.append(event.location);
        locationValueSpan.classList.add('eventDetailsRowValue');

        //  Create locationDiv (contains locationValueSpan)
        let locationDiv = document.createElement('div');

        locationDiv.classList.add('eventDetailsRow');
        locationDiv.append('Location: ', locationValueSpan);

        //  Create eventDetailsDiv (contains timeDiv and locationDiv)
        let eventDetailsDiv = document.createElement('div');

        eventDetailsDiv.classList.add('eventDetails');
        eventDetailsDiv.append(timeDiv, locationDiv);

        //  Create eventTitleDiv
        let eventTitleDiv = document.createElement('div');

        eventTitleDiv.classList.add('eventTitle');
        eventTitleDiv.append(event.summary);

        //  Create eventHeadDiv (contains eventTitleDiv and eventDetailsDiv)
        let eventHeadDiv = document.createElement('div');

        eventHeadDiv.classList.add('eventHead');
        eventHeadDiv.append(eventTitleDiv, eventDetailsDiv);

        //  Create eventDiv (top level container)
        let eventDiv = document.createElement('div');

        eventDiv.classList.add('event');
        eventDiv.append(eventHeadDiv);

        //  Only add a body if the event has a description
        if (event.description) {
            let eventDescription = document.createElement('p');

            eventDescription.classList.add('eventDescription');
            eventDescription.append(event.description);

            //  Create eventBodyDiv (contains eventDescription)
            let eventBodyDiv = document.createElement('div');

            eventBodyDiv.classList.add('eventBody');
            eventBodyDiv.append(eventDescription);

            //  Add eventBodyDiv to the top level container
            eventDiv.append(eventBodyDiv);
        }

        //  Return the top level container
        return eventDiv;
    }

    function getDateString(date) {
        const days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ];

        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];

        let dayOfWeek = days[date.getDay()];
        let month = months[date.getMonth()];
        let dayOfMonth = date.getDate();

        return `${dayOfWeek}, ${month} ${dayOfMonth}`;
    }

    function getTimeString(date) {
        let hour = 1 + ((date.getHours() - 1) % 12);
        let minute = pad(date.getMinutes());
        let pm = (date.getHours() >= 12 ? 'PM' : 'AM');

        return `${hour}:${minute} ${pm}`;

        function pad(number) {
            let r = number.toString();
            while (r.length < 2)
                r = '0' + r;
            return r;
        }
    }
}());