import "./App.css";
//import ไฟล์ CSS หลักที่เราสร้างเอง (App.css) ไว้ใช้ตกแต่ง style ของ component หลัก App
import "bootstrap/dist/css/bootstrap.min.css";
//import CSS ของ Bootstrap มาใช้ เพื่อให้ใช้ class ของ bootstrap ได้ทันที (พวก .container, .btn, .row)

import AppNavbar from "./components/Navbar";
//import component Navbar (เมนู navigation bar) ที่เราสร้างเองจากโฟลเดอร์ components

import { useEffect, useState } from "react";
//useState = hook สำหรับสร้าง state ภายใน function component
//useEffect = hook สำหรับทำงาน side effect เช่น init library, fetch data, subscribe/unsubscribe event

import AOS from "aos";
import "aos/dist/aos.css";
//import AOS (Animate On Scroll) ใช้ทำ effect เวลา scroll ลงมา เช่น fade-in, slide-in
// ต้อง import CSS ของ AOS มาด้วยถึงจะใช้งาน animation ได้
import { BrowserRouter, Routes, Route } from "react-router-dom";
// BrowserRouter = component ที่ครอบทั้งแอปเพื่อให้รองรับระบบ routing (การเปลี่ยนหน้าโดยไม่ reload)
// Routes = wrapper สำหรับ Route หลาย ๆ ตัว
// Route = กำหนด path และ component ที่จะแสดงเวลา URL ตรงกับ path นั้น
import Home from "./pages/Home";
// import หน้า Home (แสดงรายละเอียดหรือหน้าแรกของเว็บไซต์)
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import ProgramBarcode from "./pages/ProgramBarcode";
import AddProduct from "./pages/AddProduct";
import App_scan from "./pages/App_scan_flutter";
import RecordPage from "./pages/RecordMeeting";
// import หน้า Welcome (แสดงหลังจาก login สำเร็จ พร้อมปุ่ม logout)
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaChevronUp,
} from "react-icons/fa";
function App() {
  const year = new Date().getFullYear();
  const backToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const [user, setUser] = useState(() => {
    // โหลด user จาก localStorage ถ้ามี
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // ฟังก์ชัน Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null); // เคลียร์ state
    window.location.href = "/login"; // redirect ไปหน้า login
  };

  return (
    <>
      <BrowserRouter>
        <AppNavbar
          brand="Portfolio"
          links={[
            { to: "/", label: "HOME" },
            { to: "#about", label: "ABOUT ME" },
            { to: "#experiences", label: "EXPERIENCES" },
            {
              label: "DEMO APP",
              subLinks: [
                {to: "/login",label: "DEMO LOGIN AND REGISTER.",},
                {to: "/programBarcode",label: "PROGRAM BARCODE WEB APPLICATION.",},
                { to: "/app-scan", label: "APP SCAN IOS FLUTTER." },
                { to: "/record-meeting", label: "RECORD MEETING PROGRAM."},
                // เพิ่มเดโมอื่นๆ ได้ เช่น:
                // { to: "/face-detection", label: "Face Detection" },
              ],
              align: "end",
            },

            // { to: "/welcome", label: "Welcome" },
          ]}
          bg="dark"
          theme="dark"
          onLogout={user ? handleLogout : null} //ส่งไปเฉพาะถ้ามี user
          className="custom-navbar navbar-dark fixed-top "
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/programBarcode" element={<ProgramBarcode />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/app-scan" element={<App_scan />} />
          <Route path="/record-meeting" element={<RecordPage />} />
 
 
        </Routes>
      </BrowserRouter>

      <footer className="footer" id="contact">
        {/* gradient divider */}
        <div className="footer-gradient" />

        <div className="footer-content container">
          {/* Top: 3 columns */}
          <div className="footer-grid">
            {/* Brand / About */}
            <div className="footer-col">
              <h4 className="footer-title">Portfolio</h4>
              <p className="footer-text">
                A personal portfolio showcasing projects, skills, and learning
                journey across Front-End, Mobile, and Back-End development.
              </p>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h5 className="footer-subtitle">Quick Links</h5>
              <ul className="footer-links">
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="/#about">About Me</a>
                </li>
                <li>
                  <a href="/#experiences">Experiences</a>
                </li>

              </ul>
            </div>

            {/* Contact & Social */}
            <div className="footer-col">
              <h5 className="footer-subtitle">Contact</h5>
              <p className="footer-text">
                <FaEnvelope className="me-1" />
                <a
                  href="mailto:Weerisarcher02@gmail.com"
                  className="footer-link"
                >
                  Weerisarcher02@gmail.com
                </a>
              </p>

              <h6 className="footer-subtitle mt-3">Tech Stack</h6>
              <ul className="footer-badges">
                <li>React</li>
                <li>JAVA</li>
                <li>Flutter</li>
                <li>Dart</li>
              </ul>
            </div>

            {/* Newsletter (optional, non-submit) */}
            <div className="footer-col">
              <h5 className="footer-subtitle">Connect with Me</h5>
              <p className="footer-text">
                Reach out for collaborations, opportunities, or to exchange ideas.
              </p>
            </div>
          </div>

          {/* Bottom: copyright + back to top */}
          <div className="footer-bottom">
            <p className="footer-copy">
              © {year} Portfolio. All rights reserved.
            </p>
            <button
              className="footer-top"
              onClick={backToTop}
              aria-label="Back to top"
            >
              <FaChevronUp /> Top
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
