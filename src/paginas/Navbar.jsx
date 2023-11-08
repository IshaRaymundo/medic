import React from "react";
import { Link } from 'react-router-dom';
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsSpeedometer } from "react-icons/bs";

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
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              style={{ marginLeft: "0.5cm", fontWeight: "bold" }}
              href="/listaRecetas"
            >
              Recetas
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              style={{ fontWeight: "bold" }}
              href="/lotes"
            >
              Lotes
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              style={{ fontWeight: "bold" }}
              href="/inventario"
            >
              Inventario
            </a>
          </li>
        </ul>
      </div>
      <div className="ml-auto d-flex align-items-center">
        <div className="input-group mr-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar"
            style={{ marginRight: "0.5cm" }}
          />
        </div>
        <button
          className="btn btn-outline-secondary"
          style={{ backgroundColor: "#E5F3FF", marginRight: "1cm" }}
        >
          Buscar
        </button>
        <Link to= '/dashboard'>
        <BsSpeedometer size={32} color="white" style={{ marginRight: "2cm" }} />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;