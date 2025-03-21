import React from "react";

function EventList({ events }) {
  return (
    <div>
      <h2>Upcoming Events</h2>
      {events.length === 0 ? (
        <p>No upcoming events</p>
      ) : (
        <ul>
          {events.map((event, index) => (
            <li key={index}>
              <strong>{event.title}</strong> - {event.date} at {event.time}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EventList;
