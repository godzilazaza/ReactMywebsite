import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Scanner from "../components/Scanner";                 // คอมโพเนนต์กล้อง/สแกนบาร์โค้ด (คาดว่าเรียก ZXing ภายใน)
import { downloadCSV } from "../utils/csv";                  // ยูทิลดาวน์โหลดไฟล์ CSV จาก array
import Cart, { CartItem } from "../components/Cart";         // ตะกร้าสินค้า + type ของรายการสินค้า
import {
  loadCart,                                                  // โหลดตะกร้าจาก storage (เช่น localStorage)
  saveCart,                                                  // บันทึกตะกร้าไป storage
  clearCart as clearCartStorage,                             // ล้างตะกร้าใน storage
} from "../utils/storage";
import { ToastContainer, toast } from "react-toastify";      // แจ้งเตือนแบบ toast
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";        // ใช้ Link เปลี่ยนหน้า (useNavigate ยังไม่ถูกใช้ในไฟล์นี้)

type Log = {
  time: string;                                              // เวลาแสดงผล (string ที่ format แล้ว)
  code: string;                                              // รหัสบาร์โค้ดที่อ่านได้
  name: string;                                              // ชื่อสินค้า (ถ้ามี)
  price: string;                                             // ราคาที่แสดงผล (string พร้อมหน่วย)
  status: "FOUND" | "NOT_IN_DB" | "INVALID";                 // สถานะผลลัพธ์การค้นหา
  image?: string | null;                                     // URL รูปสินค้า (ถ้ามี)
};

export default function ProgramBarcode() {
  // เก็บข้อมูลรายการล่าสุดที่สแกนได้ (เพื่อโชว์การ์ดสรุปด้านบน)
  const [last, setLast] = useState<Log | null>(null);

  // ประวัติการสแกนทั้งหมด (ด้านล่างเป็นตาราง)
  const [logs, setLogs] = useState<Log[]>([]);

  // นับจำนวนที่พบในฐานข้อมูล (FOUND) ใช้โชว์ในสรุป
  const [dbHit, setDbHit] = useState<number>(0);

  // เมื่อสแกนแล้ว "ไม่พบสินค้าใน DB" จะเก็บ code ล่าสุดไว้เพื่อโชว์แบนเนอร์ชวนเพิ่มสินค้า
  const [notFoundCode, setNotFoundCode] = useState<string | null>(null);

  // -------- Cart state ----------
  // เริ่มต้นด้วยข้อมูลจาก storage
  const [cart, setCart] = useState<CartItem[]>(() => loadCart());

  // ทุกครั้งที่ cart เปลี่ยน ให้ save ไป storage
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  // ---------- SOUND: Web Audio helpers ----------
  const audioCtxRef = useRef<AudioContext | null>(null);

  // เตรียม AudioContext (บางเบราว์เซอร์จะ suspend ต้อง resume ก่อน)
  const ensureAudio = useCallback(async () => {
    if (!audioCtxRef.current) {
      // @ts-ignore
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AC();
    }
    if (audioCtxRef.current.state === "suspended") {
      try {
        await audioCtxRef.current.resume();
      } catch {}
    }
    return audioCtxRef.current!;
  }, []);

  // ฟังก์ชัน beep สร้างเสียงสั้น ๆ ด้วย Oscillator
  const beep = useCallback(
    async (
      freq = 880,                 // ความถี่
      durationMs = 120,           // ระยะเวลา
      type: OscillatorType = "sine",
      gain = 0.08                 // ความดัง
    ) => {
      const ctx = await ensureAudio();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      g.gain.setValueAtTime(gain, ctx.currentTime);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      setTimeout(() => {
        // หยุดและทำความสะอาด node
        try { osc.stop(); } catch {}
        try { osc.disconnect(); g.disconnect(); } catch {}
      }, durationMs);
    },
    [ensureAudio]
  );

  // เสียงสำเร็จ (สองโน้ต) เวลาเพิ่มสินค้าลงตะกร้าได้
  const chimeSuccess = useCallback(async () => {
    await beep(1320, 110, "square", 0.06);
    setTimeout(() => {
      beep(990, 130, "square", 0.06);
    }, 120);
  }, [beep]);

  // เสียงเตือนตอนโดนคูลดาวน์
  const warnCooldown = useCallback(async () => {
    await beep(440, 160, "sine", 0.07);
  }, [beep]);

  // --------- Cooldown guards (กันสแกนรัว/เพิ่มซ้ำเร็วไป) ---------
  const lastAnyAddRef = useRef(0);                            // timestamp การเพิ่มครั้งล่าสุด
  const codeCooldownRef = useRef(new Map<string, number>());  // map เก็บเวลาเพิ่มของแต่ละ code
  const GLOBAL_COOLDOWN_MS = 600;                             // กันเพิ่มถี่เกินไปโดยรวม
  const PER_CODE_COOLDOWN_MS = 1500;                          // กันโค้ดเดิมจากการถือค้าง/ยิงซ้ำ

  // ตรวจว่าตอนนี้อนุญาตให้เพิ่มสินค้าได้ไหม
  const canAddNow = useCallback((code: string) => {
    const now = Date.now();
    if (now - lastAnyAddRef.current < GLOBAL_COOLDOWN_MS) return false;
    const last = codeCooldownRef.current.get(code) ?? 0;
    if (now - last < PER_CODE_COOLDOWN_MS) return false;
    // ผ่านเงื่อนไข → อัพเดตเวลาไว้กันซ้ำ
    lastAnyAddRef.current = now;
    codeCooldownRef.current.set(code, now);
    return true;
  }, []);

  // ---------- Cart ops ----------
  // เพิ่มสินค้าลงตะกร้า: ถ้ามีอยู่แล้วให้เพิ่ม qty, ถ้าไม่มีก็ใส่เข้าไปใหม่
  const addToCart = useCallback(
    (p: { code: string; name: string; price: number; image?: string | null }) => {
      setCart((prev) => {
        const idx = prev.findIndex((x) => x.code === p.code);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
          return next;
        }
        return [
          { code: p.code, name: p.name, price: p.price, qty: 1, image: p.image ?? null },
          ...prev,
        ];
      });
    },
    []
  );

  // เปลี่ยนจำนวนสินค้า (ไม่ให้ต่ำกว่า 1)
  const changeQty = useCallback((code: string, nextQty: number) => {
    setCart((prev) =>
      prev.map((x) => (x.code === code ? { ...x, qty: Math.max(1, nextQty) } : x))
    );
  }, []);

  // ลบสินค้าออกจากตะกร้า
  const removeItem = useCallback((code: string) => {
    setCart((prev) => prev.filter((x) => x.code !== code));
  }, []);

  // เคลียร์ตะกร้าทั้งหมด + ล้างใน storage
  const clearCart = useCallback(() => {
    setCart([]);
    clearCartStorage();
  }, []);

  // ---------- Callback จาก ZXing/Scanner ----------
  // รับผล decode { code, product, validEAN13 }
  const onDecoded = useCallback(
    ({ code, product, validEAN13 }: any) => {
      // ตีความสถานะเบื้องต้น
      let status: Log["status"] = "FOUND";
      if (!product) status = validEAN13 ? "NOT_IN_DB" : "INVALID";

      // สร้าง entry สำหรับบันทึก log
      const entry: Log = {
        time: new Date().toLocaleTimeString(),
        code,
        name: product?.name ?? "-",
        price: product ? `${product.price} THB` : "-",
        status,
        image: product?.image ?? null,
      };

      // เติม log ด้านบนสุด และจำกัดไม่เกิน 199 แถว
      setLogs((prev) => [entry, ...prev].slice(0, 199));

      if (status === "FOUND") {
        // อัพเดตสรุปผล
        setDbHit((h) => h + 1);
        setLast(entry);
        setNotFoundCode(null); // ถ้าเคยไม่เจอ พอเจอแล้วซ่อนแบนเนอร์

        // กันเพิ่มซ้ำเร็วเกินไป
        if (canAddNow(code)) {
          addToCart({
            code,
            name: product.name,
            price: product.price,
            image: product.image,
          });
          toast.success(`เพิ่ม ${product.name} ลงตะกร้าแล้ว ✅`, { autoClose: 1200 });
          try { navigator.vibrate?.(60); } catch {}
          chimeSuccess();
        } else {
          toast.warn("ถือสินค้าอยู่ — กันเพิ่มซ้ำเร็วเกินไป ⚠️", { autoClose: 1000 });
          warnCooldown();
        }
      } else if (status === "NOT_IN_DB") {
        // ไม่พบในฐาน → โชว์ปุ่มลัดไปหน้าเพิ่มสินค้า พร้อมพารามิเตอร์ code
        setNotFoundCode(code);
        toast.info("ไม่พบในคลัง — กดเพิ่มสินค้าได้เลย", { autoClose: 1200 });
      }
      // กรณี INVALID จะถูกบันทึกลง log เฉย ๆ
    },
    [addToCart, canAddNow, chimeSuccess, warnCooldown]
  );

  // อัตรา FOUND เป็นเปอร์เซ็นต์ (memoized)
  const foundRate = useMemo(() => {
    const total = logs.length || 1;
    const found = logs.filter((l) => l.status === "FOUND").length;
    return ((found / total) * 100).toFixed(0);
  }, [logs]);

  // สไตล์หัวตาราง (ภายในคอมโพเนนต์) — ตัวนี้จะไม่ชนกับตัวข้างล่างเพราะอยู่คนละสโคป
  const th : React.CSSProperties = {
    textAlign:"left",
    borderBottom:"1px solid #eee",
    padding:"8px 10px",
    background:"#fff",
    color:"#000"
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "96px 16px 24px" }}>
      {/* ส่วนหัว/ปุ่มไปหน้าเพิ่มสินค้า — ถูกคอมเมนต์ไว้ เผื่อเปิดใช้ในอนาคต */}
      {/* 
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h2 className="m-0">🛒 Product Scanner + Cart (React + ZXing)</h2>
        <div className="d-flex gap-2">
          <Link to="/add-product" className="btn btn-sm btn-primary">
            + เพิ่มสินค้า
          </Link>
        </div>
      </div> 
      */}

      <div className="row g-3">
        {/* พื้นที่ซ้าย: กล้องสแกน + แบนเนอร์ไม่พบสินค้า + การ์ดสรุปล่าสุด + ปุ่ม CSV/clear + ตาราง log */}
        <div className="col-12 col-lg-6">
          <Scanner onDecoded={onDecoded} />

          {/* แถบแจ้งเตือนกรณีไม่พบสินค้า พร้อมปุ่มไปเพิ่ม */}
          {notFoundCode && (
            <div className="alert alert-warning d-flex align-items-center justify-content-between mt-2" role="alert">
              <div>
                ไม่พบสินค้าในคลัง: <b>{notFoundCode}</b>
              </div>
              <Link
                to={`/add-product?code=${encodeURIComponent(notFoundCode)}`}
                className="btn btn-sm btn-outline-dark"
              >
                เพิ่มรายการนี้เลย
              </Link>
            </div>
          )}

          {/* การ์ดสรุปรายการล่าสุดที่ FOUND */}
          {last && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                display: "flex",
                gap: 12,
                alignItems: "center",
                background: "#000",     // ธีมเข้ม
              }}
            >
              {/* แสดงรูปสินค้า ถ้าโหลดรูปไม่สำเร็จให้ซ่อน img */}
              {last.image ? (
                <img
                  src={last.image}
                  width={64}
                  height={64}
                  style={{ borderRadius: 8, objectFit: "cover", background: "#111" }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  alt=""
                />
              ) : null}

              {/* ข้อมูลซ้าย */}
              <div style={{ flex: 1 }}>
                <div><b>Code:</b> {last.code}</div>
                <div><b>สินค้า:</b> {last.name}</div>
                <div><b>ราคา:</b> {last.price}</div>
                <div><b>สถานะ:</b> <span style={{ color: "green" }}>FOUND</span></div>
              </div>

              {/* ข้อมูลขวา: stat รวม */}
              <div style={{ textAlign: "right" }}>
                <div><b>สแกนทั้งหมด:</b> {logs.length}</div>
                <div><b>เจอใน DB:</b> {dbHit}</div>
                <div><b>Found rate:</b> {foundRate}%</div>
              </div>
            </div>
          )}

          {/* ปุ่ม export CSV + เคลียร์ log */}
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button onClick={() => downloadCSV("scan_log.csv", logs)} className="btn btn-outline-secondary btn-sm">
              Export CSV
            </button>
            <button
              onClick={() => {
                setLogs([]);
                setDbHit(0);
              }}
              className="btn btn-outline-secondary btn-sm"
            >
              Clear Log
            </button>
          </div>

          {/* ตารางประวัติการสแกน */}
          <h5 style={{ marginTop: 16 }}>ประวัติการสแกน</h5>
          <div
            style={{
              maxHeight: 260,
              overflow: "auto",
              border: "1px solid #eee",
              borderRadius: 8,
              background: "#000",       // ธีมเข้ม (ตัวอักษรใน td ยังเป็นสีปกติ)
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background:"#fff" }}>
                <tr>
                  <th style={th}>เวลา</th>
                  <th style={th}>โค้ด</th>
                  <th style={th}>สินค้า</th>
                  <th style={th}>ราคา</th>
                  <th style={th}>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l, i) => (
                  <tr key={i}>
                    <td style={td}>{l.time}</td>
                    <td style={td}>{l.code}</td>
                    <td style={td}>{l.name}</td>
                    <td style={td}>{l.price}</td>
                    <td
                      style={{
                        ...td,
                        color:
                          l.status === "FOUND"
                            ? "green"
                            : l.status === "NOT_IN_DB"
                            ? "#b08900"
                            : "crimson",
                      }}
                    >
                      {l.status}
                    </td>
                  </tr>
                ))}
                {!logs.length && (
                  <tr>
                    <td style={td} colSpan={5}>ยังไม่มีข้อมูล</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* พื้นที่ขวา: ตะกร้าสินค้า */}
        <div className="col-12 col-lg-6">
          <Cart
            items={cart}
            vatRate={0.07}                                   // อัตรา VAT 7%
            onQtyChange={changeQty}
            onRemove={removeItem}
            onClear={clearCart}
            onCheckout={(summary) => {
              // แสดงผลรวมและล้างตะกร้าเมื่อ checkout
              toast.success(`Checkout สำเร็จ รวม ${summary.items.length} รายการ 🧾`, { autoClose: 1500 });
              clearCart();
            }}
          />
        </div>
      </div>

      {/* Toasts */}
      <ToastContainer position="bottom-right" theme="dark" />

      {/* ปุ่มบังคับ enable sound (ถ้าบราว์เซอร์บล็อกออโต้เพลย์) — ปิดไว้ก่อน
      <button className="btn btn-sm btn-outline-secondary mt-2" onClick={ensureAudio}>
        Enable Sound
      </button> 
      */}
    </div>
  );
}

// ====== สไตล์ส่วนกลางของตาราง (นอกคอมโพเนนต์) ======
// หมายเหตุ: ด้านบนมี th ภายในคอมโพเนนต์อีกตัวหนึ่ง (สโคปคนละส่วน จึงไม่ชนกัน)
const th: React.CSSProperties = {
  textAlign: "left",
  borderBottom: "1px solid #eee",
  padding: "8px 10px",
  background: "#fafafa",
};

const td: React.CSSProperties = {
  borderBottom: "1px solid #f0f0f0",
  padding: "8px 10px",
  fontSize: 14,
};
