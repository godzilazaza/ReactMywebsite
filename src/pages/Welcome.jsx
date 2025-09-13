// src/pages/Welcome.jsx
import { useEffect } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // ถ้าไม่มี user → เด้งไปหน้า Login
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");  // clear session
    navigate("/");               // redirect
  };

  if (!user) return null; // ป้องกัน render หน้าขาวก่อน redirect

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "500px" }} className="p-4 shadow text-center">
        <h2>Welcome</h2>
        <p>Hello, <b>{user.username}</b></p>
        <p>Email: {user.email}</p>

        <Button variant="danger" onClick={handleLogout} className="mt-3">
          Logout
        </Button>
      </Card>
    </Container>
  );
}
