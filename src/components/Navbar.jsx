// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import { Link as RouterLink, NavLink } from "react-router-dom";

export default function AppNavbar({
  brand = "Portfolio",
  links = [
    { to: "/", label: "Home" },
    { to: "/login", label: "Login" },
    { to: "/register", label: "Register" },
  ],
  onLogout = null,
}) {
  const [isSolid, setIsSolid] = useState(false);   // solid เมื่อเลื่อนลง
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsSolid(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // anchor (#...) -> ไปหน้า Home พร้อม hash
  const toWithHash = (hash) => ({ pathname: "/", hash });

  const renderSingle = (item, i) => {
    const { to = "#", label, disabled } = item;

    if (to.startsWith("#")) {
      return (
        <Nav.Link
          key={i}
          as={RouterLink}
          to={toWithHash(to)}
          className="nav-neon"
          onClick={() => setExpanded(false)}
        >
          {label}
        </Nav.Link>
      );
    }

    return (
      <Nav.Link
        key={i}
        as={NavLink}
        to={to}
        end
        disabled={disabled}
        className="nav-neon"
        onClick={() => setExpanded(false)}
      >
        {label}
      </Nav.Link>
    );
  };

  const renderDropdown = (item, i) => (
    <NavDropdown
      title={item.label}
      id={`nav-dd-${i}`}
      key={i}
      className="nav-neon"
      menuVariant="dark"
      align={item.align || "start"}   // ✅ รองรับ align จาก props
    >
      {item.subLinks?.map((s, j) =>
        s.to?.startsWith("#") ? (
          <NavDropdown.Item
            as={RouterLink}
            to={toWithHash(s.to)}
            key={j}
            onClick={() => setExpanded(false)}
          >
            {s.label}
          </NavDropdown.Item>
        ) : (
          <NavDropdown.Item
            as={RouterLink}
            to={s.to || "#"}
            key={j}
            onClick={() => setExpanded(false)}
          >
            {s.label}
          </NavDropdown.Item>
        )
      )}
    </NavDropdown>
  );

  return (
    <Navbar
      expand="lg"
      fixed="top"
      variant="dark"                               // ✅ ให้คอนทราสต์กับพื้นเข้ม
      expanded={expanded}
      onToggle={setExpanded}
      className={`custom-navbar navbar-dark ${isSolid ? "solid" : "transparent"}`}
    >
      {/* ใช้ fluid + px-0 ถ้าอยากชิดขอบ; เปลี่ยนเป็น <Container> ได้ถ้าไม่ต้องการ */}
      <Container >
        <Navbar.Brand as={RouterLink} to="/">
          {brand}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            {links.map((item, i) =>
              item.subLinks?.length
                ? renderDropdown(item, i)
                : renderSingle(item, i)
            )}

            {onLogout && (
              <Button
                variant="outline-danger"
                size="sm"
                className="ms-3"
                onClick={() => {
                  setExpanded(false);
                  onLogout();
                }}
              >
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
