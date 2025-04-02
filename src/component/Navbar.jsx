import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <Link to="/admin">Admin Dashboard</Link> | 
      <Link to="/users">Users List</Link>
    </nav>
  );
};

export default Navbar;