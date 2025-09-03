import "./App.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
const items = [
    {
    title: "Assistant & Secretary – Managing Partner",
    years: "2023 – 2025",
    img: "/img/sand/sand1.jpg",
    desc:
      "Drafted sales/legal contracts, managed e-docs, prepared minutes, and supported executives.",
    tags: ["Administration", "Documents"],
  },
  
  {
    title: "Assistant Lecturer – Bang Pakong Power Plant (CSR)",
    years: "2023",
    img: "/img/bangpakong/bp4.png",
    desc:
      "Supported planning & execution of academic/admin activities; coordinated across departments.",
    tags: ["CSR", "Coordination"],
  },
  {
    title: "Teacher Assistant – Burapha University",
    years: "2017 – 2020",
    img: "/img/taBuu/ta1.png", // ใส่ไฟล์ไว้ใน public/images หรือใช้ลิงก์รูปก็ได้
    desc:
      "Assisted classroom activities, prepared materials, supervised and supported students.",
    tags: ["Education", "Support", "Guidance"],
  }

];
function App() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <section>
      <Container className="py-5">
      <h1 className="text-white mb-4">Portfolio Mr. Weeris Premprayounsuk</h1>

      <h2 className="text-white-50 mb-3">Experience</h2>

      <Row xs={1} sm={2} lg={3} className="g-4">
        {items.map((it, i) => (
          <Col key={i}>
            <Card className="h-100 bg-dark text-white shadow-sm card-hover">
              {/* รูปด้านบน: กำหนดความสูง + crop ให้พอดีด้วย object-fit */}
              <Card.Img
                variant="top"
                src={it.img}
                alt={it.title}
                onError={(e) => (e.currentTarget.src = `https://picsum.photos/seed/${i}/800/500`)}
                style={{ height: 180, objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title className="mb-1">{it.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-white-50">
                  {it.years}
                </Card.Subtitle>
                <Card.Text className="mb-3">{it.desc}</Card.Text>
                <div className="d-flex flex-wrap gap-2">
                  {it.tags.map((t, idx) => (
                    <Badge bg="secondary" key={idx}>{t}</Badge>
                  ))}
            
                </div>
              </Card.Body>
              <Button variant="light">Go somewhere</Button>
              <br />
              
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
      </section>
    </>
  );
}

export default App;
