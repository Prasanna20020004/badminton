import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkCredentials, login } from "../auth";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (checkCredentials(username, password)) {
      login();
      navigate("/admin/dashboard");
    } else {
      setError("That username or password doesn't match our records.");
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1>Organizer login</h1>
        <p>Sign in to view the entry list and category breakdown.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
