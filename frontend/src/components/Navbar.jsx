import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav style={{ padding: "10px", background: "#282c34", color: "white" }}>
      <h3>Note App</h3>
      {user && (
        <div>
          <span style={{ marginRight: "15px" }}>
            Welcome, {user.name || user.email}
          </span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
