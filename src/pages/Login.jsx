// src/pages/Login.jsx
import { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../app_intro.css";
import "../advantages.css";

export default function Login() {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch("https://weerispost.online/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Sign-in failed. Please check your credentials.");
      } else {
        setMessage(`Signed in as ${data.user?.username || username}. Redirecting…`);
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => navigate("/welcome"), 800);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("A server error occurred. Please try again in a moment.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text)",
        padding: "16px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "linear-gradient(180deg, var(--card), #12131a)",
          border: "1px solid var(--card-border)",
          borderRadius: "18px",
          padding: "24px",
          boxShadow: "0 10px 30px rgba(0,0,0,.45)",
        }}
      >
        {/* <div className="text-center mb-1" style={{ color: "var(--muted)", fontSize: ".95rem" }}>
          Welcome back
        </div> */}
        <h3 className="text-center mb-4" style={{ color: "var(--primary)", margin: 0 }}>
          Sign in
        </h3>

        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
        {message && <Alert variant="success" className="mb-3">{message}</Alert>}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3" controlId="signinUsername">
            <Form.Label style={{ color: "var(--muted)" }}>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                background: "var(--panel)",
                color: "var(--text)",
                border: "1px solid var(--card-border)",
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="signinPassword">
            <Form.Label style={{ color: "var(--muted)" }}>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                background: "var(--panel)",
                color: "var(--text)",
                border: "1px solid var(--card-border)",
              }}
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100"
            style={{
              background: "var(--primary)",
              border: "none",
              borderRadius: "12px",
              fontWeight: 600,
              padding: "10px 12px",
            }}
          >
            Sign in
          </Button>
        </Form>

        {/* Secondary actions */}
        <div className="text-center mt-3" style={{ fontSize: ".95rem" }}>
          <span style={{ color: "var(--muted)" }}>Don’t have an account?</span>{" "}
          <Button
            variant="link"
            onClick={() => navigate("/register")}
            style={{
              color: "var(--primary)",
              textDecoration: "none",
              fontWeight: 600,
              padding: 0,
            }}
          >
            Create account
          </Button>
        </div>
      </Card>
    </div>
  );
}
