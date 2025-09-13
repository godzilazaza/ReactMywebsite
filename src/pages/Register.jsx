// src/pages/Register.jsx
import { useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";

// ใช้ env ถ้ามี (Vite): VITE_API_BASE=https://www.weerispost.online
const API_BASE = import.meta?.env?.VITE_API_BASE || "https://www.weerispost.online";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match!");
      return;
    }

    // ป้องกันช่องว่างล้วน
    const username = name.trim();
    if (!username) {
      setError("Full Name is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/register.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ username, email: email.trim(), password }),
      });

      // กันกรณี backend ตอบเป็น HTML ตอน error
      const text = await res.text();
      let data = {};
      try { data = JSON.parse(text); } catch { /* not JSON */ }

      if (!res.ok) {
        throw new Error(data.message || `HTTP ${res.status}: ${text.slice(0, 120)}`);
      }

      if (data.success === false) {
        setError(data.message || "Register failed");
      } else {
        setMessage(data.message || "Register successful!");
        setName("");
        setEmail("");
        setPassword("");
        setConfirm("");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card style={{ width: 400 }} className="p-4 shadow">
        <h3 className="text-center mb-4">Register</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="registerName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerConfirm">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              isInvalid={confirm && confirm !== password}
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
