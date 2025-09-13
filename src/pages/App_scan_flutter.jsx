import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import App from "../App";
import React from "react";
import { CheckCircle } from "lucide-react"; // ไอคอนจาก lucide-react
import {
  FaDollarSign,
  FaAppleAlt,
  FaUserShield,
  FaCloud,
} from "react-icons/fa";
import "../app_intro.css";
import "../advantages.css";
function App_scan() {
  return (
    <>
      <section className="ai-wrap">
        {/* ---------- HERO ---------- */}
        <div className="container">
          <header className="ai-hero">
            <h1>DEMO APPLICATION SCAN PRODUCT</h1>
            <p className="ai-kicker">
              Flutter (Dart) • Barcode & Product Info • Realtime Update
            </p>
          </header>

          {/* ---------- INTRO + SHOTS ---------- */}
          <Row className="ai-intro gy-5 align-items-center">
            <Col md={6}>
              <h2 className="ai-section-title">Introduction</h2>
              <p className="ai-body">
                This mobile application, developed with Flutter (Dart), is
                designed to scan product barcodes and instantly retrieve product
                information. It helps users manage product data, update stock,
                and record essential details efficiently.
              </p>
              <p className="ai-body">
                The app is built with a focus on speed, accuracy, and user
                experience. Its responsive design ensures smooth performance
                across different devices, making it practical both for
                individual users and small businesses. With future scalability
                in mind, it can also grow to meet the needs of larger
                enterprises.
              </p>

              <h5 className="ai-subtitle mt-4">Current Scope</h5>
              <ul className="ai-list">
                <li>
                  <strong>Scanning product barcodes</strong> using the device
                  camera, with optimized detection even in low-light
                  environments.
                </li>
                <li>
                  <strong>Displaying product details</strong> retrieved directly
                  from the database, ensuring that information is always
                  accurate and up to date.
                </li>
                <li>
                  <strong>Allowing manual input and editing</strong> of product
                  information, giving flexibility when barcodes are unavailable
                  or additional details are needed.
                </li>
                <li>
                  <strong>Uploading product images</strong> to enrich the
                  database and provide visual references for each scanned item.
                </li>
              </ul>

              <h5 className="ai-subtitle mt-4">Key Benefits</h5>
              <ul className="ai-list">
                <li>Improves efficiency in inventory management workflows.</li>
                <li>Reduces human error by automating data capture.</li>
                <li>Enhances user engagement with a clean and intuitive UI.</li>
                <li>
                  Provides a foundation for future features like analytics and
                  eCommerce integration.
                </li>
              </ul>
              <div className="flt-divider">
  <span className="flt-logo" aria-hidden>
    {/* Flutter SVG inline – ไม่พึ่ง lib ภายนอก */}
    <svg viewBox="0 0 256 256"><path fill="#44D1FD" d="M121 144L27 50l35-35 94 94z"/><path fill="#1FBCFD" d="M121 144L62 203l35 35 59-59z"/><path fill="#08589C" d="M121 144l35-35 35 35-70 70-35-35z"/></svg>
  </span>
  <h5>Flutter Design Touch</h5>
</div>

{/* Badges แสดง tech keywords */}
<ul className="flt-badges">
  <li>Flutter (Dart)</li>
  <li>Material&nbsp;3</li>
  <li>Camera & Barcode</li>
  <li>HTTP/REST</li>
  <li>Responsive UI</li>
</ul>

{/* Bullets แบบแบรนด์ Flutter */}
<ul className="ai-list flt-bullets">
  <li>Consistent Material 3 components with custom theming.</li>
  <li>Camera pipeline tuned for fast barcode recognition.</li>
  <li>Typed models & input validation to reduce data errors.</li>
  <li>Repository layer separating UI, domain, and data sources.</li>
  <li>Extensible for auth, cloud sync, and analytics.</li>
</ul>
            </Col>

            <Col md={6}>
              <div className="ai-shots">
                <img src="/img/app_scan/appv2/app1.png" alt="screen 1" />
                <img src="/img/app_scan/appv2/app2.png" alt="screen 2" />
                <img src="/img/app_scan/appv2/app3.png" alt="screen 3" />
                <img src="/img/app_scan/appv2/app4.png" alt="screen 4" />
              </div>
            </Col>
          </Row>
        </div>

        {/* ---------- FUTURE DEV ---------- */}
        <div className="ai-band">
          <div className="container">
            <header className="text-center mb-4">
              <h2 className="ai-section-title">Future Development</h2>
              <p className="ai-subtle">
                Planned enhancements to deliver greater value to users
              </p>
            </header>

            <Row className="g-4">
              <Col xs={12} md={6} lg={3}>
                <article className="ai-card h-100">
                  <span className="ai-dot">$</span>
                  <h3>Expense Tracking</h3>
                  <p>
                    Automatically calculate total cost of scanned items to give
                    a clear spending overview and support budget control.
                  </p>
                </article>
              </Col>

              <Col xs={12} md={6} lg={3}>
                <article className="ai-card h-100">
                  <span className="ai-dot">🍎</span>
                  <h3>Nutritional & Calorie</h3>
                  <p>
                    For food products, estimate nutritional values and calories
                    so users can monitor intake and maintain healthier habits.
                  </p>
                </article>
              </Col>

              <Col xs={12} md={6} lg={3}>
                <article className="ai-card h-100">
                  <span className="ai-dot">🔒</span>
                  <h3>User Authentication</h3>
                  <p>
                    Secure login and personalized profiles to keep each user’s
                    records private and tailored.
                  </p>
                </article>
              </Col>

              <Col xs={12} md={6} lg={3}>
                <article className="ai-card h-100">
                  <span className="ai-dot">☁️</span>
                  <h3>Cloud Sync</h3>
                  <p>
                    Seamless storage and synchronization across devices for
                    access anytime, anywhere.
                  </p>
                </article>
              </Col>
            </Row>
          </div>
        </div>
      </section>
      <section className="advantages-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title text-white">Advantages</h2>
            <p className="section-subtitle">
              Key strengths that make this application efficient and reliable
            </p>
          </div>

          <Row className="g-4">
            <Col xs={12} md={6} lg={3}>
              <article className="adv-card h-100">
                <span className="adv-dot">✓</span>
                <h3>Fast and reliable barcode scanning</h3>
                <p>
                  Optimized algorithms ensure quick and accurate scanning even
                  in low-light or with slightly damaged labels.
                </p>
              </article>
            </Col>

            <Col xs={12} md={6} lg={3}>
              <article className="adv-card h-100">
                <span className="adv-dot">✓</span>
                <h3>Simple and user-friendly interface</h3>
                <p>
                  Intuitive layouts, clear navigation, and large touch targets
                  make it easy for everyone to use.
                </p>
              </article>
            </Col>

            <Col xs={12} md={6} lg={3}>
              <article className="adv-card h-100">
                <span className="adv-dot">✓</span>
                <h3>Real-time product data</h3>
                <p>
                  Product details are retrieved and updated instantly, keeping
                  your information always up-to-date.
                </p>
              </article>
            </Col>

            <Col xs={12} md={6} lg={3}>
              <article className="adv-card h-100">
                <span className="adv-dot">✓</span>
                <h3>Scalable integration</h3>
                <p>
                  Designed with flexibility to easily connect with eCommerce
                  systems and expand with business growth.
                </p>
              </article>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
}
export default App_scan;
