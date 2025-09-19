// src/pages/Welcome.jsx
import { useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../app_intro.css";
import "../advantages.css";

export default function Welcome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text)",
        padding: 16,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 500,
          background: "linear-gradient(180deg, var(--card), #12131a)",
          border: "1px solid var(--card-border)",
          borderRadius: 18,
          padding: 28,
          boxShadow: "0 12px 32px rgba(0,0,0,.5)",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "var(--primary)", fontWeight: "700" }}>Welcome</h2>
        <p style={{ color: "white", margin: "12px 0", fontSize: "1.1rem" }}>
          Hello, <b>{user.username}</b>
        </p>
        <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
          Email: {user.email}
        </p>

        <Button
          onClick={handleLogout}
          style={{
            background: "linear-gradient(180deg, #c62828, #8e0000)", // แดงเข้มโทน modern
            border: "1px solid rgba(198,40,40,.4)",
            borderRadius: 12,
            padding: "12px 24px",
            fontWeight: 600,
            color: "#fff",
            boxShadow: "0 6px 16px rgba(198,40,40,.35)",
            cursor: "pointer",
            transition: "all 0.25s ease-in-out",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
            e.currentTarget.style.background = "linear-gradient(180deg, #e53935, #b71c1c)";
            e.currentTarget.style.boxShadow = "0 10px 24px rgba(198,40,40,.5)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1) translateY(0)";
            e.currentTarget.style.background = "linear-gradient(180deg, #c62828, #8e0000)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(198,40,40,.35)";
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.97) translateY(1px)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
          }}
        >
          Logout
        </Button>

      </Card>
    </div>
  );
}
