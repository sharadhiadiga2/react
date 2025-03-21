import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Sidebar from "./components/Sidebar";
import CreateEvent from "./components/CreateEvent";
import EventList from "./components/EventList";

function App() {
  const [events, setEvents] = useState([]);

  const addEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  return (
    <Router>
      <div className="event-container">
        <Sidebar />
        <div className="main-content">
          <Navigation />
          <h1>Event Planner</h1>
          <Routes>
            <Route path="/" element={<EventList events={events} />} />
            <Route path="/create-event" element={<CreateEvent addEvent={addEvent} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
