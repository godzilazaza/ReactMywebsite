// src/components/detailBody.jsx
import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { FaLaptopCode, FaReact, FaTools, FaMicrochip, FaCogs } from "react-icons/fa";
import { MdOutlineEngineering } from "react-icons/md";
import { FaFlutter } from "react-icons/fa6";

import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";

import "../App.css";
import "../app_intro.css";
import "../advantages.css";
import "../detail.css";

import items from "../components/carddetail";

function Detail() {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const location = useLocation();

  const fullText = "Passionate about Front-End, Mobile & Back-End Development";

  // typing effect
  useEffect(() => {
    let i = 1;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setText(fullText.substring(0, i));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
      }
    }, 90);
    return () => clearInterval(interval);
  }, []);

  // smooth scroll to hash with navbar offset
  function scrollToId(id, behavior = "smooth") {
    const el = document.getElementById(id);
    if (!el) return false;
    const nav = document.querySelector(".custom-navbar");
    const offset = (nav?.offsetHeight ?? 70) + 10;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior });
    return true;
  }

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    let tries = 0;
    const tryScroll = () => {
      if (scrollToId(id, "smooth")) return;
      if (tries++ < 20) setTimeout(tryScroll, 50);
    };
    setTimeout(tryScroll, 0);
  }, [location.hash, location.key]);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="ai-wrap section section-cover text-center" style={{ padding: "72px 0 40px" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, color: "var(--text)" }}>Frank Weeris</h1>
        <p style={{ fontSize: "1.3rem", marginTop: "1rem", color: "var(--muted)" }}>
          {text}
          {!done && <span className="fake-cursor">|</span>}
        </p>
        <div className="line-divider" />
        {/* Skills grid */}
        <div className="expertise-section" style={{ marginTop: 28 }}>
          <div style={{ padding: "10px 0 28px" }}>
            <h2 className="section-divider" style={{ color: "var(--text)" }}>
              My Skills & Learning Journey
            </h2>
          </div>
          <Container>
            <Row className="g-4 justify-content-center">
              <Col xs={12} md={4}>
                <div
                  className="xp-card h-100"
                  style={{
                    background: "linear-gradient(180deg, var(--card), #12131a)",
                    border: "1px solid var(--card-border)",
                    borderRadius: 18,
                    padding: 20,
                    boxShadow: "0 10px 25px rgba(0,0,0,.35)",
                  }}
                >
                  <div className="xp-icon-wrap pink" style={{ marginBottom: 10 }}>
                    <FaLaptopCode className="xp-icon" />
                  </div>
                  <h3 className="xp-title" style={{ color: "var(--text)" }}>
                    <span className="hl-pink">Software</span> Development
                  </h3>
                  <p className="xp-text" style={{ color: "var(--muted)" }}>
                    Basic understanding of functional & OOP with Python, Java, JavaScript, C/C++.
                    Improving problem-solving through exercises and projects.
                  </p>
                </div>
              </Col>

              <Col xs={12} md={4}>
                <div
                  className="xp-card h-100"
                  style={{
                    background: "linear-gradient(180deg, var(--card), #12131a)",
                    border: "1px solid var(--card-border)",
                    borderRadius: 18,
                    padding: 20,
                    boxShadow: "0 10px 25px rgba(0,0,0,.35)",
                  }}
                >
                  <div className="xp-icon-wrap blue" style={{ marginBottom: 10 }}>
                    <FaReact className="xp-icon" />
                  </div>
                  <h3 className="xp-title" style={{ color: "var(--text)" }}>
                    <span className="hl-blue">Frontend Dev</span> React
                  </h3>
                  <p className="xp-text" style={{ color: "var(--muted)" }}>
                    Passionate about UI/UX with hands-on HTML/CSS/JS and React. Learning via real-world builds.
                  </p>
                </div>
              </Col>

              <Col xs={12} md={4}>
                <div
                  className="xp-card h-100"
                  style={{
                    background: "linear-gradient(180deg, var(--card), #12131a)",
                    border: "1px solid var(--card-border)",
                    borderRadius: 18,
                    padding: 20,
                    boxShadow: "0 10px 25px rgba(0,0,0,.35)",
                  }}
                >
                  <div className="xp-icon-wrap orange" style={{ marginBottom: 10 }}>
                    <FaFlutter className="xp-icon" />
                  </div>
                  <h3 className="xp-title" style={{ color: "var(--text)" }}>
                    <span className="hl-orange">Flutter Dev</span> Mobile
                  </h3>
                  <p className="xp-text" style={{ color: "var(--muted)" }}>
                    Exploring cross-platform apps with Flutter/Dart, UI, state management, and shipping prototypes.
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      {/* ===== ABOUT / MOTIVATION ===== */}
      <section
        id="about"
        className="ai-wrap section2 section-cover2 neon-background motivation-section"
        data-aos="fade-up"
        style={{ padding: "60px 0" }}
      >
        <Container>
          {/* Passion & Motivation */}
          <div className="motivation-content">
            <div style={{ padding: "10px 0 28px" }}>
              <h1 style={{ color: "var(--text)" }}>Passion & Motivation</h1>
            </div>

            <Row className="g-4 justify-content-center">
              <Col xs={12} md={6}>
                <div
                  className="motivation-box"
                  style={{
                    background: "linear-gradient(180deg, var(--card), #12131a)",
                    border: "1px solid var(--card-border)",
                    borderRadius: 18,
                    padding: 24,
                  }}
                >
                  <h3 style={{ color: "var(--text)" }}>Why do you want to work as a programmer?</h3>
                  <p style={{ color: "var(--muted)" }}>
                    I enjoy solving problems and creating helpful solutions. Programming blends logic and creativity,
                    lets me learn continuously, and build software that can make a real impact.
                  </p>
                </div>
              </Col>

              <Col xs={12} md={6}>
                <div
                  className="motivation-box"
                  style={{
                    background: "linear-gradient(180deg, var(--card), #12131a)",
                    border: "1px solid var(--card-border)",
                    borderRadius: 18,
                    padding: 24,
                  }}
                >
                  <h3 style={{ color: "var(--text)" }}>More than a career</h3>
                  <p style={{ color: "var(--muted)" }}>
                    For me, programming is creativity, problem-solving, and turning ideas into reality—building things
                    that are meaningful and useful to others.
                  </p>
                </div>
              </Col>
            </Row>
          </div>

          {/* About Me */}
          <div
            className="about-section"
            style={{
              marginTop: 60,
              padding: "10px 0 0",
              color: "var(--text)",
            }}
          >
            <div className="text-center mb-4">
              <h1 style={{ color: "var(--text)", fontWeight: 700 }}>About Me</h1>
              <p style={{ maxWidth: 720, margin: "12px auto", color: "var(--muted)" }}>
                Experience across technology, public sector, and private businesses—combining technical skills
                with clear communication and organized execution.
              </p>
            </div>

            <div
              style={{
                background: "linear-gradient(180deg, var(--card), #12131a)",
                border: "1px solid var(--card-border)",
                borderRadius: 18,
                padding: 32,
                boxShadow: "0 10px 30px rgba(0,0,0,.45)",
                maxWidth: 960,
                margin: "0 auto 40px",
              }}
            >
              <Row className="align-items-center">
                <Col md={5}>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      lineHeight: 1.9,
                      color: "var(--text)",
                    }}
                  >
                    <li><strong>Name:</strong> Weeris Premprayounsuk</li>
                    <li><strong>Education:</strong> B.Sc. Informatics IT, Burapha University</li>
                    <li><strong>Email:</strong> Weerisarcher02@gmail.com</li>
                    <li><strong>Tel:</strong> +66 96-992-2539</li>
                  </ul>
                </Col>
                <Col md={7}>
                  <p style={{ color: "var(--muted)", margin: 0 }}>
                    Internship and assistant lecturer at EGAT (Bang Pakong), then private-sector role as Secretary and
                    Assistant to Managing Partner at PS Sand Alliance Group—drafting contracts, managing documents,
                    and supporting executives.
                  </p>
                </Col>
              </Row>
            </div>

            {/* Soft Skills */}
            <div className="text-center mb-3">
              <h2 style={{ color: "var(--text)", fontWeight: 600 }}>Soft Skills</h2>
            </div>
            <Row xs={1} md={3} className="g-4 text-center" style={{ maxWidth: 960, margin: "0 auto" }}>
              {[
                {
                  title: "💡 Mindset & Growth",
                  items: ["Growth Mindset", "Collaboration", "Continuous Learning"],
                },
                {
                  title: "⚡ Efficiency",
                  items: ["Problem-Solving", "Time Management", "Adaptability"],
                },
                {
                  title: "🎨 Creativity",
                  items: ["Creativity", "Apply AI to solve problems"],
                },
              ].map((box, idx) => (
                <Col key={idx}>
                  <Card
                    className="skill-card"
                    style={{
                      background: "linear-gradient(180deg, var(--card), #1a1b22)",
                      border: "1px solid var(--card-border)",
                      borderRadius: 18,
                      padding: 22,
                      height: "100%",
                      transition: "transform .25s ease, box-shadow .25s ease",
                    }}
                  >
                    <h5 style={{ color: "var(--text)", marginBottom: 12 }}>{box.title}</h5>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "var(--text)", lineHeight: 1.8 }}>
                      {box.items.map((li, i) => (
                        <li key={i}>• {li}</li>
                      ))}
                    </ul>
                  </Card>
                </Col>
              ))}
            </Row>
            <style>{`
              .skill-card:hover {
                transform: translateY(-6px);
                box-shadow: 0 12px 28px rgba(77,163,255,.25);
              }
            `}</style>
          </div>

          {/* Project Experiences */}
          <div className="motivation-content" style={{ marginTop: 72 }}>
            <div style={{ padding: "10px 0 28px" }}>
              <h1 style={{ color: "var(--text)" }}>
                <MdOutlineEngineering style={{ color: "var(--primary)", marginRight: 10 }} />
                PROJECT EXPERIENCES
              </h1>
            </div>

            <Row xs={1} md={2} className="g-4 align-items-stretch">
              <Col className="d-flex">
                <div
                  className="project-box w-100"
                  style={{
                    background: "linear-gradient(180deg, var(--card), #12131a)",
                    border: "1px solid var(--card-border)",
                    borderRadius: 18,
                    padding: 24,
                  }}
                >
                  <h1 style={{ color: "var(--text)" }}>
                    <span className="project-title-big">MY SENIOR PROJECT</span>
                  </h1>
                  <h3 style={{ color: "var(--text)" }}>
                    <FaTools style={{ color: "#ff914d", marginRight: 8 }} />
                    Smart Elevator System for Efficient Time and Energy Management
                  </h3>
                  <p style={{ color: "var(--muted)" }}>
                    Prototype to optimize elevator usage at peak times by monitoring total passenger weight.
                    If the threshold is exceeded, the elevator skips additional stops to reduce delays and save energy.
                    Future plan: image processing to detect passenger count and available space in real time.
                  </p>
                  <h4 style={{ color: "var(--text)" }}>
                    <FaCogs style={{ color: "var(--primary)", marginRight: 8 }} />
                    Skills & Technologies Used
                  </h4>
                  <ul className="project-skills" style={{ color: "var(--text)", lineHeight: 1.8 }}>
                    <li><FaMicrochip className="skill-icon" /> Arduino UNO</li>
                    <li><FaMicrochip className="skill-icon" /> DC Motor</li>
                    <li><FaMicrochip className="skill-icon" /> Load Cell Sensor</li>
                    <li><FaMicrochip className="skill-icon" /> Stepper Motor Driver</li>
                    <li><FaMicrochip className="skill-icon" /> Embedded Systems Programming</li>
                  </ul>
                </div>
              </Col>

              <Col className="d-flex">
                <div
                  className="project-box project-img-box w-100 text-center"
                  style={{
                    background: "linear-gradient(180deg, var(--card), #12131a)",
                    border: "1px solid var(--card-border)",
                    borderRadius: 18,
                    padding: 16,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <img
                    src="/img/senair.jpg"
                    alt="Smart Elevator Project"
                    className="project-img"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 420,
                      borderRadius: 12,
                      border: "1px solid var(--card-border)",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      {/* ===== EXPERIENCE GRID ===== */}
      <section id="experiences" className="ai-wrap" style={{ padding: "72px 0" }} data-aos="fade-up">
        <Container>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 className="ai-section-title" style={{ fontSize: "2.2rem" }}>
              Experience
            </h2>
            <p className="ai-subtitle">
              A highlight of my varied work experiences across different fields.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {items.map((it, i) => (
              <div
                key={i}
                className="exp-card"
                style={{
                  background: "linear-gradient(180deg, var(--card), #12131a)",
                  border: "1px solid var(--card-border)",
                  borderRadius: 18,
                  padding: 20,
                  boxShadow: "0 10px 25px rgba(0,0,0,.35)",
                  transition: "transform .3s ease, box-shadow .3s ease",
                }}
              >
                <div
                  style={{
                    height: 180,
                    borderRadius: 12,
                    overflow: "hidden",
                    marginBottom: 16,
                    border: "1px solid var(--card-border)",
                  }}
                >
                  <img
                    src={it.img}
                    alt={it.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform .4s ease",
                    }}
                    className="exp-img"
                  />
                </div>

                <h3 style={{ margin: "0 0 6px", fontSize: "1.3rem", color: "var(--primary)" }}>
                  {it.title}
                </h3>
                <p style={{ margin: "0 0 12px", color: "var(--muted)", fontSize: ".95rem" }}>
                  {it.years}
                </p>
                <p style={{ marginBottom: 16, color: "var(--text)" }}>{it.desc}</p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {it.tags.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: ".8rem",
                        padding: "4px 10px",
                        borderRadius: 20,
                        border: "1px solid var(--card-border)",
                        background: "rgba(77,163,255,.08)",
                        color: "var(--text)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

export default Detail;
