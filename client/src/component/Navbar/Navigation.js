import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav>
      <NavLink to="/" className="header">
        <i className="fab fa-hive"></i> Home
      </NavLink>
      <ul
        className="navbar-links"
        style={{ width: "35%", marginBottom: "0px", transform: open ? "translateX(0px)" : "" }}
      >
         <li>
          <NavLink to="/LuckyDraw" activeClassName="nav-active" >
            <i className="fas fa-gamepad" /> Lucky Draw
          </NavLink>
        </li>
      </ul>
      <i onClick={() => setOpen(!open)} className="fas fa-bars burger-menu"></i>
    </nav>
  );
}
