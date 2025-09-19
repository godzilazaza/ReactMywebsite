// src/pages/Register.jsx
import { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../app_intro.css";
import "../advantages.css";

// Vite env: VITE_API_BASE=https://www.weerispost.online
const API_BASE = import.meta?.env?.VITE_API_BASE || "https://www.weerispost.online";

// 👉 กำหนดความสูง Navbar ที่ใช้อยู่ (ถ้าใช้ fixed-top)
const NAVBAR_HEIGHT = 72; // ปรับเป็นความสูงจริงของ navbar คุณ (เช่น 56/64/72 px)

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    const username = name.trim();
    if (!username) {
      setError("Full name is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ username, email: email.trim(), password }),
      });

      const text = await res.text();
      let data = {};
      try { data = JSON.parse(text); } catch { /* not JSON */ }

      if (!res.ok) {
        throw new Error(data.message || `HTTP ${res.status}: ${text.slice(0, 120)}`);
      }

      if (data.success === false) {
        setError(data.message || "Registration failed.");
      } else {
        setMessage(data.message || "Account created successfully.");
        setName(""); setEmail(""); setPassword(""); setConfirm("");
        // setTimeout(() => navigate("/login"), 1200);
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "A server error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "var(--panel)",
    color: "var(--text)",
    border: "1px solid var(--card-border)",
  };

  return (
    <div
      style={{
        // เผื่อพื้นที่ใต้ navbar + จัดกลางแนวตั้ง
        paddingTop: NAVBAR_HEIGHT,
        minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text)",
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 16,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 460,
          background: "linear-gradient(180deg, var(--card), #12131a)",
          border: "1px solid var(--card-border)",
          borderRadius: 18,
          padding: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,.45)",
        }}
      >
        <div className="text-center mb-1" style={{ color: "var(--muted)", fontSize: ".95rem" }}>
          Create your account
        </div>
        <h3 className="text-center mb-4" style={{ color: "var(--primary)", margin: 0 }}>
          Sign up
        </h3>

        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
        {message && <Alert variant="success" className="mb-3">{message}</Alert>}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3" controlId="registerName">
            <Form.Label style={{ color: "var(--muted)" }}>Full name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerEmail">
            <Form.Label style={{ color: "var(--muted)" }}>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label style={{ color: "var(--muted)" }}>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="registerConfirm">
            <Form.Label style={{ color: "var(--muted)" }}>Confirm password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Re-enter your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              isInvalid={confirm !== "" && confirm !== password}
              style={inputStyle}
            />
            <Form.Control.Feedback type="invalid">
              Passwords do not match.
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            type="submit"
            className="w-100"
            disabled={loading}
            style={{
              background: "var(--primary)",
              border: "none",
              borderRadius: 12,
              fontWeight: 600,
              padding: "10px 12px",
            }}
          >
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </Form>

        <div className="text-center mt-3" style={{ fontSize: ".95rem" }}>
          <span style={{ color: "var(--muted)" }}>Already have an account?</span>{" "}
          <Button
            variant="link"
            onClick={() => navigate("/login")}
            style={{
              color: "var(--primary)",
              textDecoration: "none",
              fontWeight: 600,
              padding: 0,
            }}
          >
            Sign in
          </Button>
        </div>
      </Card>
    </div>
  );
}
