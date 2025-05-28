// Navbar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';

const Navbar = ({ setView }) => {
  return (
    <Nav className="justify-content-center my-3" variant="tabs" defaultActiveKey="home">
      <Nav.Item>
        <Nav.Link eventKey="home" onClick={() => setView('home')}>Home</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="downloads" onClick={() => setView('downloads')}>Downloads</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="favorites" onClick={() => setView('favorites')}>Favorites</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default Navbar;
