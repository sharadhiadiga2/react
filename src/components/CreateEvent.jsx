import React, { useState } from "react";

function CreateEvent({ addEvent }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date || !time) return;

    const newEvent = { title, date, time };
    addEvent(newEvent);

    setTitle("");
    setDate("");
    setTime("");
  };

  return (
    <div className="event-form">
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Event Title:</label>
          <input
            type="text"
            placeholder="Enter event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
            
            </div>

        <div>
          <label>Event Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
            
            </div>

        <div>
          <label>Event Time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div>

        </div>

        <button type="submit">Add Event</button>
      </form>
    </div>
  );
}

export default CreateEvent;

