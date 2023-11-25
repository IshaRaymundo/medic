import React from "react";
import { Link } from 'react-router-dom';
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-warning">
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="d-flex justify-content-between align-items-center w-100">
        <div className="navbar-brand">
          <span style={{ color: "white", fontWeight: "bold", marginLeft: "10px" }}>MediApp</span>
        </div>
        <Link to='/'>
          <button className="btn btn-light">Cerrar sesión</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
