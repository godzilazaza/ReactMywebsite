import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { isValidEAN13 } from "../utils/ean13";
import { API_BASE } from "../utils/api";
import { Link } from "react-router-dom";

type Product = { name: string; price: number; stock: number; image?: string };
type Props = {
  onDecoded: (p: {
    code: string;
    product?: Product;
    validEAN13: boolean;
  }) => void;
};

export default function Scanner({ onDecoded }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  const startingRef = useRef(false);
  const runningRef = useRef(false);

  const cooldownRef = useRef<Set<string>>(new Set());

  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [mobileRearOnly, setMobileRearOnly] = useState(false); // ⬅ โหมดมือถือกล้องหลัง

  /** ปิด tracks ให้หมด + ล้าง video */
  const hardStopTracks = () => {
    const el = videoRef.current;
    const stream = el?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => {
      try {
        t.stop();
      } catch {}
    });
    if (el) {
      try {
        el.pause();
      } catch {}
      el.srcObject = null;
      try {
        el.load();
      } catch {}
    }
  };

  /** หยุดสแกน */
  const stopScanner = useCallback(() => {
    if (!runningRef.current && !startingRef.current) return;
    try {
      controlsRef.current?.stop();
    } catch {}
    controlsRef.current = null;

    hardStopTracks();
    setShowVideo(false); // ถอด video ออกจาก DOM เพื่อคืนอุปกรณ์แน่ๆ

    startingRef.current = false;
    runningRef.current = false;
    setRunning(false);
  }, []);

  /** อ่านสินค้าจาก API ก่อน แล้วค่อย fallback products.json */
  const lookupProduct = useCallback(async (code: string) => {
    // 1) API
    try {
      const r = await fetch(
        `${API_BASE}/products.php?code=${encodeURIComponent(code)}`,
        {
          headers: { Accept: "application/json" },
        }
      );
      if (r.ok) {
        const data = await r.json();
        if (data && data.code === code) {
          return {
            name: data.name as string,
            price: Number(data.price),
            stock: Number(data.stock ?? 0),
            image: data.image ?? undefined,
          } as Product;
        }
      }
    } catch {}

    // 2) products.json (dev/local)
    try {
      const r2 = await fetch("/products.json");
      const db = await r2.json();
      return db?.[code] as Product | undefined;
    } catch {}

    return undefined;
  }, []);

  /** เปิดสแกน: พยายามใช้ constraints (facingMode) ก่อน แล้วค่อย fallback เป็น deviceId */
  const startScanner = useCallback(async () => {
    if (startingRef.current || runningRef.current) return;
    startingRef.current = true;
    try {
      setError("");
      setShowVideo(true);

      if (!readerRef.current)
        readerRef.current = new BrowserMultiFormatReader();

      // ลองเปิดด้วย constraints (เหมาะกับมือถือ)
      const constraints: MediaStreamConstraints = {
        video: mobileRearOnly
          ? {
              facingMode: { ideal: "environment" },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            }
          : {
              facingMode: { ideal: "user" },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
        audio: false,
      };

      let controls: IScannerControls | null = null;
      try {
        controls = await readerRef.current.decodeFromConstraints(
          constraints as any,
          videoRef.current!,
          async (result, err, c) => {
            controlsRef.current = c;
            if (!result) return;

            const code = result.getText().trim();
            if (!code) return;

            // คูลดาวน์ 1s ต่อโค้ด กันถือค้างยิงรัว
            if (cooldownRef.current.has(code)) return;
            cooldownRef.current.add(code);
            setTimeout(() => cooldownRef.current.delete(code), 1000);

            const valid = code.length === 13 ? isValidEAN13(code) : false;

            try {
              const product = await lookupProduct(code);
              onDecoded({ code, product, validEAN13: valid });
            } catch {
              onDecoded({ code, validEAN13: valid });
            }
          }
        );
      } catch {
        // ถ้า constraints ไม่ผ่าน → หา deviceId แล้วเปิดแบบเดิม
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        if (!devices.length) throw new Error("ไม่พบกล้องวิดีโอ");

        const backCam =
          devices.find((d) => /back|rear|environment/i.test(d.label))
            ?.deviceId ?? devices[0].deviceId;

        controls = await readerRef.current.decodeFromVideoDevice(
          backCam,
          videoRef.current!,
          async (result, err, c) => {
            controlsRef.current = c;
            if (!result) return;

            const code = result.getText().trim();
            if (!code) return;

            if (cooldownRef.current.has(code)) return;
            cooldownRef.current.add(code);
            setTimeout(() => cooldownRef.current.delete(code), 1000);

            const valid = code.length === 13 ? isValidEAN13(code) : false;

            try {
              const product = await lookupProduct(code);
              onDecoded({ code, product, validEAN13: valid });
            } catch {
              onDecoded({ code, validEAN13: valid });
            }
          }
        );
      }

      controlsRef.current = controls!;
      runningRef.current = true;
      setRunning(true);
    } catch (e: any) {
      console.error("Scanner start error:", e);
      setError(e?.message ?? "ไม่สามารถเปิดกล้องได้");
      stopScanner();
    } finally {
      startingRef.current = false;
    }
  }, [lookupProduct, mobileRearOnly, onDecoded, stopScanner]);

  // auto start/cleanup
  useEffect(() => {
    startScanner();
    return () => stopScanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileRearOnly]); // เปลี่ยนโหมดมือถือ ให้รีสตาร์ทกล้องใหม่

  // HMR: cleanup ตอนโมดูลถูกแทนที่
  useEffect(() => {
    (window as any).__stopScanner = stopScanner;
    if (import.meta && (import.meta as any).hot) {
      (import.meta as any).hot.dispose(() => {
        (window as any).__stopScanner?.();
      });
    }
    return () => {
      delete (window as any).__stopScanner;
    };
  }, [stopScanner]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* แถบควบคุม */}
      <div className="d-flex flex-wrap gap-2 mb-2 align-items-center">
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={startScanner}
          disabled={running}
        >
          ▶ เปิดกล้อง
        </button>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={stopScanner}
          disabled={!running}
        >
          ■ ปิดกล้อง
        </button>
        <Link to="/add-product" className="btn btn-sm btn-success">
          ＋ เพิ่มสินค้า
        </Link>

        <div className="form-check ms-1">
          <input
            id="rearOnly"
            type="checkbox"
            className="form-check-input"
            checked={mobileRearOnly}
            onChange={(e) => {
              setMobileRearOnly(e.target.checked);
              // การเปลี่ยนค่าจะไป trigger useEffect ให้รีสตาร์ทกล้องเอง
            }}
          />
          <label
            htmlFor="rearOnly"
            className="form-check-label"
            style={{ userSelect: "none" }}
          >
            โหมดมือถือ: ใช้กล้องหลัง
          </label>
        </div>
      </div>

      {/* กล้อง + เส้นเล็ง */}
      {showVideo && (
        <div style={{ position: "relative" }}>
          <video
            ref={videoRef}
            style={{ width: "100%", borderRadius: 8, background: "#000" }}
            playsInline
            muted
            autoPlay
          />
          {running && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                width: "100%",
                height: 2,
                background: "red",
                transform: "translateY(-50%)",
                opacity: 0.85,
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      )}

      {error && <p style={{ color: "crimson", marginTop: 8 }}>{error}</p>}
      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
        วางบาร์โค้ดให้ตัดกับเส้นสีแดง • ใช้ได้บน HTTPS หรือ localhost
      </div>
    </div>
  );
}
