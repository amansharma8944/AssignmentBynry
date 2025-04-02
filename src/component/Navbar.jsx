// import React from "react";
// import { Link } from "react-router-dom";

// const Navbar = () => {
//   return (
//     <nav>
//       <Link to="/admin">Admin Dashboard</Link> | 
//       <Link to="/users">Users List</Link>
//     </nav>
//   );
// };

// export default Navbar;



import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          {/* Logo & mobile menu button */}
          <div className="flex space-x-4">
            <div>
              <Link to="/" className="flex items-center py-5 px-2 text-gray-700">
                <svg
                  className="h-6 w-6 mr-1 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                <span className="font-bold">Bynry</span>
              </Link>
            </div>
          </div>

          {/* Primary nav */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/admin"
              className={`py-5 px-3 ${
                location.pathname === "/admin"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-700 hover:text-blue-500"
              }`}
            >
              Admin Dashboard
            </Link>
            <Link
              to="/"
              className={`py-5 px-3 ${
                location.pathname === "/"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-700 hover:text-blue-500"
              }`}
            >
              Users List
            </Link>
          </div>

         

          {/* Mobile button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mobile-menu-button p-2 focus:outline-none"
            >
              <svg
                className="h-6 w-6 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <Link
          to="/admin"
          className={`block py-2 px-4 text-sm ${
            location.pathname === "/admin"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          }`}
          onClick={() => setIsOpen(false)}
        >
          Admin Dashboard
        </Link>
        <Link
          to="/"
          className={`block py-2 px-4 text-sm ${
            location.pathname === "/"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          }`}
          onClick={() => setIsOpen(false)}
        >
          Users List
        </Link>
       
      </div>
    </nav>
  );
};

export default Navbar;