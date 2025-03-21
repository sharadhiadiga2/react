import React from "react";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/create-event">Create Event</Link>
    </nav>
  );
}

export default Navigation;
