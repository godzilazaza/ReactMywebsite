import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import items from "../components/carddetail";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; //  เพิ่ม
import { FaLaptopCode, FaReact } from "react-icons/fa";
import "aos/dist/aos.css";
import "../detail.css";
import { FaTools, FaMicrochip, FaCogs } from "react-icons/fa";
import { MdOutlineEngineering } from "react-icons/md";
import { FaFlutter } from "react-icons/fa6";
function Detail() {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const location = useLocation(); //  ใช้อ่าน hash จาก URL

  const fullText = "Passionate about Front-End, Mobile & Back-End Development";

  // พิมพ์ทีละตัว
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

  // ✅ helper เลื่อนไปยัง id โดยชดเชยความสูง navbar
  function scrollToId(id, behavior = "smooth") {
    const el = document.getElementById(id);
    if (!el) return false;

    // หา navbar ที่ fixed อยู่ด้านบน (ปรับ selector ได้ตามของคุณ)
    const nav = document.querySelector(".custom-navbar");
    const offset = (nav?.offsetHeight ?? 70) + 10; // กันโดนบังหัว + เผื่อเล็กน้อย

    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior });
    return true;
  }

  // เมื่อ URL มี hash (เช่น /#about) ให้เลื่อนไปยัง section นั้น
  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.slice(1); // "#about" -> "about"
    let tries = 0;

    const tryScroll = () => {
      // ถ้า element ยังไม่มา (โหลดภาพ/DOM/AOS) ให้ลองซ้ำสั้น ๆ
      if (scrollToId(id, "smooth")) return;
      if (tries++ < 20) setTimeout(tryScroll, 50); // ลองซ้ำสูงสุด ~1 วินาที
    };

    // รอเฟรมถัดไปให้ layout พร้อมก่อนค่อยเลื่อน
    setTimeout(tryScroll, 0);
  }, [location.hash, location.key]);

  return (
    <>
      {/* -------- Hero Section -------- */}
      <section className="section section-cover text-center">
        <h1 style={{ fontSize: "3rem", fontWeight: 800 }}>Frank Weeris</h1>
        <p style={{ fontSize: "1.5rem", marginTop: "1rem" }}>
          {text}
          {!done && <span className="fake-cursor">|</span>}
        </p>
        <div className="line-divider"></div>
        {/* -------- Expertise Section -------- */}
        <div className="expertise-section">
          <div style={{ padding: "40px" }}>
            <h2 className="section-divider">My Skills & Learning Journey</h2>
          </div>
<Row className="g-4 justify-content-center">
  {/* Software Dev */}
  <Col xs={12} md={4}>
    <div className="xp-card h-100">
      <div className="xp-icon-wrap pink">
        <FaLaptopCode className="xp-icon" />
      </div>
      <h3 className="xp-title">
        <span className="hl-pink">Software</span> Development
      </h3>
      <p className="xp-text">
        Basic understanding of functional and object-oriented programming, 
        with practice in Python, Java, JavaScript, C, and C++. 
        Improving problem-solving through exercises and projects.
      </p>
    </div>
  </Col>

  {/* Frontend */}
  <Col xs={12} md={4}>
    <div className="xp-card h-100">
      <div className="xp-icon-wrap blue">
        <FaReact className="xp-icon" />
      </div>
      <h3 className="xp-title">
        <span className="hl-blue">Frontend Dev</span> React
      </h3>
      <p className="xp-text">
        Passionate about UI/UX with hands-on practice in HTML, CSS, JavaScript, 
        and React. Always learning and improving through real-world projects.
      </p>
    </div>
  </Col>

  {/* Flutter */}
  <Col xs={12} md={4}>
    <div className="xp-card h-100">
      <div className="xp-icon-wrap orange">
        <FaFlutter className="xp-icon" />
      </div>
      <h3 className="xp-title">
        <span className="hl-orange">Flutter Dev</span> Mobile
      </h3>
      <p className="xp-text">
        Interested in mobile app development with focus on cross-platform apps 
        using <strong>Flutter & Dart</strong>. Exploring UI design, 
        state management, and real-world app building.
      </p>
    </div>
  </Col>
</Row>
        </div>
      </section>

      {/* -------- About Section -------- */}
      <section
        id="about"
        className="section2 section-cover2 neon-background motivation-section"
        data-aos="fade-up"
      >
        {/* ---------- Passion & Motivation ---------- */}
        <div className="motivation-content">
          <div style={{ padding: "40px" }}>
            <h1>Passion & Motivation</h1>
          </div>

          <Row className="g-4 justify-content-center">
            <Col xs={12} md={6}>
              <div className="motivation-box">
                <h3>Why do you want to work as a programmer?</h3>
                <p>
                  I want to work as a programmer because I am passionate about
                  problem-solving and creating solutions that make life easier.
                  Programming lets me combine logic and creativity, learn new
                  technologies, and grow while building software that makes a
                  real impact.
                </p>
              </div>
            </Col>

            <Col xs={12} md={6}>
              <div className="motivation-box">
                <h3>Because being a programmer is more than a career</h3>
                <p>
                  Because being a programmer is more than just a profession. It
                  is about creativity, problem-solving, and making ideas come to
                  life. For me, programming is not only about writing code but
                  also about building something meaningful that can inspire and
                  help others.
                </p>
              </div>
            </Col>
          </Row>
        </div>

        {/* ---------- About Me ---------- */}
        <div className="motivation-content" style={{ marginTop: "80px" }}>
          <div style={{ padding: "40px" }}>
            <h1>About Me</h1>
          </div>

          <div className="expertise-box">
            <div className="about-info">
              <div className="info-row">
                <span className="info-text">Name: Weeris Premprayounsuk</span>
              </div>
              <div className="info-row">
                <span className="info-text">
                  Education: Bachelor of Informatics Information Technology,
                  Burapha University
                </span>
              </div>
              <div className="info-row">
                <span className="info-text">
                  E-mail: Weerisarcher02@gmail.com
                </span>
              </div>
              <br />
            </div>
            <p>
              I graduate from the Faculty of Information Science with hands-on
              experience in both public and private sectors. In 2023, I
              completed an internship at the Electricity Generating Authority of
              Thailand (EGAT), Bang Pakong, in the Public Relations Department
              as an Assistant Lecturer. This role allowed me to gain valuable
              communication and coordination experience in a professional
              setting. Following the internship, I continued working as an
              Assistant Lecturer at the EGAT power plant for approximately one
              year. In 2024, I began a new position in Rayong Province (Ban
              Chang District) as Secretary and Assistant to the Managing Partner
              at PS Sand Alliance Group. My responsibilities included drafting
              contracts, managing electronic documents, and supporting executive
              operations. Throughout these roles, I have developed strong skills
              in document management, interpersonal communication, adaptability,
              and professional collaboration. I am also committed to continuous
              self-improvement and believe in applying both technical knowledge
              and soft skills to help organizations achieve greater efficiency
              and productivity. I am confident that my background, practical
              experience, and positive attitude will make me a valuable asset to
              your team.
            </p>
            <div style={{ padding: "20px", textAlign: "center" }}>
              <h2 className="section-divider">SOLF SKILLS</h2>
            </div>
            <Row xs={1} md={3} className="text-center">
              <Col>
                <ul>
                  <li>// Growth Mindset</li>
                  <li>// Collaboration</li>
                  <li>// Learn new things and improvement</li>
                </ul>
              </Col>
              <Col>
                <ul>
                  <li>// Problem-Solving</li>
                  <li>// Time Management</li>
                  <li>// Adaptability</li>
                </ul>
              </Col>
              <Col>
                <ul>
                  <li>// Creativity</li>
                  <li>// Apply AI to solve problems</li>
                </ul>
              </Col>
            </Row>
          </div>
        </div>

        {/* ---------- Project Experiences ---------- */}
        <div className="motivation-content" style={{ marginTop: "80px" }} >
          <div style={{ padding: "40px" }}>
            <h1>
              <MdOutlineEngineering
                style={{ color: "#4da3ff", marginRight: "10px" }}
              />
              PROJECT EXPERIENCES
            </h1>
          </div>

          <Row xs={1} md={2} className="g-4 align-items-stretch">
            {/* Text */}
            <Col className="d-flex">
              <div className="project-box w-100">
                <h1>
                  <span className="project-title-big">MY SENIOR PROJECT</span>
                </h1>
                <h3>
                  <FaTools style={{ color: "#ff914d", marginRight: "8px" }} />
                  Smart Elevator System for Efficient Time and Energy Management
                </h3>
                <p>
                  This project is an initial prototype of an intelligent
                  elevator system designed to optimize usage during peak hours.
                  The system enhances both time efficiency and energy
                  conservation by monitoring the total weight of passengers
                  inside the elevator. If the combined weight exceeds a
                  predefined threshold, the elevator will skip additional stops
                  to avoid picking up more passengers—treating the current load
                  as full capacity. This helps minimize unnecessary delays and
                  reduces energy consumption from frequent stops. <br /> <br />{" "}
                  The current version of the project uses weight-based
                  estimation as a foundation. The long-term goal is to evolve
                  the system by integrating image processing technology to
                  detect the number of passengers and calculate available space
                  in real time. This enhancement will improve the precision and
                  adaptability of the elevator, making it more intelligent and
                  responsive to real-world usage patterns.
                </p>
                <h4>
                  <FaCogs style={{ color: "#4da3ff", marginRight: "8px" }} />
                  Skills & Technologies Used
                </h4>
                <ul className="project-skills">
                  <li>
                    <FaMicrochip className="skill-icon" /> Arduino UNO
                  </li>
                  <li>
                    <FaMicrochip className="skill-icon" /> DC Motor
                  </li>
                  <li>
                    <FaMicrochip className="skill-icon" /> Load Cell Sensor
                  </li>
                  <li>
                    <FaMicrochip className="skill-icon" /> Stepper Motor Driver
                  </li>
                  <li>
                    <FaMicrochip className="skill-icon" /> Embedded Systems
                    Programming
                  </li>
                </ul>
              </div>
            </Col>

            {/* Image */}
            <Col className="d-flex">
              <div className="project-box project-img-box w-100 text-center">
                <img
                  src="/img/senair.jpg"
                  alt="Smart Elevator Project"
                  className="project-img"
                />
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* -------- Experience Section -------- */}
      <section
        id="experiences"
        className="section section-cover3 neon-background motivation-section" data-aos="fade-up"
      > 
        <h1>Experience</h1>
        <Row xs={1} sm={2} lg={3} className="g-4 justify-content-center">
          {items.map((it, i) => (
            <Col key={i}>
              <Card className="h-100 bg-dark text-white shadow-sm card-hover">
                <Card.Img
                  variant="top"
                  src={it.img}
                  alt={it.title}
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
                      <Badge bg="secondary" key={idx}>
                        {t}
                      </Badge>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </>
  );
}

export default Detail;
