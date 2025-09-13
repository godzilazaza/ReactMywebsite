// src/pages/AddProduct.jsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../utils/api";
import { isValidEAN13 } from "../utils/ean13";

/* ---------- helper: บีบอัดรูปเป็น webp ---------- */
async function compressImage(file, {
  maxWidth = 900,
  maxHeight = 900,
  quality = 0.82,
  type = "image/webp", // จะเปลี่ยนเป็น "image/jpeg" ก็ได้
} = {}) {
  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = URL.createObjectURL(file);
  });

  const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
  const w = Math.round(img.width * ratio);
  const h = Math.round(img.height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);

  const blob = await new Promise((res) => canvas.toBlob(res, type, quality));
  URL.revokeObjectURL(img.src);

  const ext = type.includes("webp") ? "webp" : "jpg";
  return new File([blob],
    (file.name || "image").replace(/\.\w+$/, "") + `.${ext}`,
    { type, lastModified: Date.now() }
  );
}

export default function AddProduct() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  // ฟอร์ม
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");     // โหมด URL
  const [imageFile, setImageFile] = useState(null); // โหมดไฟล์
  const [preview, setPreview] = useState("");       // พรีวิว

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // {type:'success'|'danger'|'info', text:''}

  // รับ code จาก query ?code=...
  useEffect(() => {
    const c = sp.get("code");
    if (c) setCode(c);
  }, [sp]);

  // พรีวิวรูป
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (imageUrl) {
      setPreview(imageUrl);
    } else {
      setPreview("");
    }
  }, [imageFile, imageUrl]);

  // ข้อความช่วย + สีตามสถานะ
  const codeStatus = useMemo(() => {
    if (!code) return { text: "กรอก EAN-13 (13 หลัก)", cls: "text-secondary" };
    if (!/^\d{13}$/.test(code)) return { text: "ต้องเป็นตัวเลข 13 หลักเท่านั้น", cls: "text-danger" };
    return isValidEAN13(code)
      ? { text: "รหัสถูกต้อง ✅", cls: "text-success" }
      : { text: "checksum ไม่ถูกต้อง ❌", cls: "text-danger" };
  }, [code]);

  async function uploadImageIfNeeded() {
    if (imageFile) {
      // ตรวจชนิดและขนาดคร่าว ๆ
      if (!/^image\//.test(imageFile.type)) {
        throw new Error("ไฟล์รูปไม่ถูกต้อง");
      }
      if (imageFile.size > 2 * 1024 * 1024) {
        // ถ้าใหญ่กว่า 2MB ให้บีบอัดก่อน (หรือบีบอัดทุกกรณีก็ได้)
      }

      // บีบอัดก่อนอัปโหลด
      const small = await compressImage(imageFile, {
        maxWidth: 900,
        maxHeight: 900,
        quality: 0.82,
        type: "image/webp",
      });

      const fd = new FormData();
      fd.append("file", small);

      const res = await fetch(`${API_BASE}/upload.php`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || data?.error) {
        throw new Error(data?.message || data?.error || "อัปโหลดรูปไม่สำเร็จ");
      }
      return data.url; // { url: "https://.../uploads/xxx.webp" }
    }
    if (imageUrl) return imageUrl;
    return null;
  }

  async function fetchExistingProduct(c) {
    try {
      const res = await fetch(`${API_BASE}/products.php?code=${encodeURIComponent(c)}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.code === c) return data;
      return null;
    } catch {
      return null;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);

    // validate
    if (!code || !name || !price || !stock) {
      setMsg({ type: "danger", text: "กรอกข้อมูลที่จำเป็นให้ครบก่อนครับ" });
      return;
    }
    if (!/^\d{13}$/.test(code) || !isValidEAN13(code)) {
      setMsg({ type: "danger", text: "รหัสบาร์โค้ดต้องเป็น EAN-13 ที่ถูกต้อง" });
      return;
    }
    const p = parseFloat(price);
    const s = parseInt(stock, 10);
    if (isNaN(p) || p < 0) { setMsg({ type: "danger", text: "ราคาไม่ถูกต้อง" }); return; }
    if (isNaN(s) || s < 0) { setMsg({ type: "danger", text: "สต็อกไม่ถูกต้อง" }); return; }

    setLoading(true);
    try {
      const exists = await fetchExistingProduct(code);
      if (exists) {
        const ok = window.confirm(
          `พบสินค้านี้อยู่แล้ว:\n\nชื่อเดิม: ${exists.name}\nราคาเดิม: ${exists.price}\nสต็อกเดิม: ${exists.stock}\n\nต้องการอัปเดตทับหรือไม่?`
        );
        if (!ok) { setLoading(false); return; }
      }

      // 1) อัปโหลดรูปถ้าจำเป็น → ได้ url
      const img = await uploadImageIfNeeded();

      // 2) บันทึกสินค้า (upsert)
      const body = {
        code,
        name,
        price: Number(p.toFixed(2)),
        stock: s,
        image: img, // อาจเป็น null ถ้าไม่แนบรูป
      };

      const res = await fetch(`${API_BASE}/products.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.success === false || data?.error) {
        throw new Error(data?.message || data?.error || "บันทึกไม่สำเร็จ");
      }

      setMsg({ type: "success", text: exists ? "อัปเดตสินค้าเรียบร้อย" : "เพิ่มสินค้าเรียบร้อย" });

      setTimeout(() => {
        const go = window.confirm("บันทึกแล้ว ต้องการกลับไปหน้าแสกนเพื่อทดสอบเลยไหม?");
        if (go) navigate(`/programBarcode`);
      }, 350);

      // เคลียร์บางฟิลด์สำหรับเพิ่มต่อ
      setName(""); setPrice(""); setStock("");
      setImageUrl(""); setImageFile(null);

    } catch (err) {
      setMsg({ type: "danger", text: err.message || "เกิดข้อผิดพลาด" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ paddingTop: 96, paddingBottom: 32, maxWidth: 720 }}>
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="mb-3">เพิ่ม / แก้ไข สินค้า</h2>
        <Link to="/programBarcode" className="btn btn-sm btn-outline-secondary">← กลับไปสแกน</Link>
      </div>

      {/* ข้อความบอกวิธีอัปโหลด ให้เป็นสีเขียวชัดเจน */}
      <p className="text-success">รองรับทั้งวางลิงก์รูป และอัปโหลดรูปจากเครื่อง</p>

      {msg && <div className={`alert alert-${msg.type} mt-2`} role="alert">{msg.text}</div>}

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="row g-3">
          <div className="col-md-5">
            <label className="form-label">บาร์โค้ด (EAN-13) *</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{13}"
              className="form-control"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 13))}
              placeholder="เช่น 8850123456786"
              required
            />
            <div className={`form-text ${codeStatus.cls}`}>{codeStatus.text}</div>
          </div>

          <div className="col-md-7">
            <label className="form-label">ชื่อสินค้า *</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น น้ำดื่ม 600ml"
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">ราคา (บาท) *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="เช่น 10.00"
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">สต็อก *</label>
            <input
              type="number"
              min="0"
              step="1"
              className="form-control"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="เช่น 120"
              required
            />
          </div>

          {/* โหมดรูป: URL */}
          <div className="col-md-4">
            <label className="form-label">ลิงก์รูปภาพ (ถ้ามี)</label>
            <input
              type="url"
              className="form-control"
              value={imageUrl}
              onChange={(e) => { setImageUrl(e.target.value); if (e.target.value) setImageFile(null); }}
              placeholder="https://..."
            />
            <div className="form-text">ถ้าใส่ลิงก์ จะไม่ใช้ไฟล์ที่อัปโหลด</div>
          </div>

          {/* โหมดรูป: ไฟล์ */}
          <div className="col-md-12">
            <label className="form-label">อัปโหลดรูปจากเครื่อง (jpg/png/webp) ≤ 2MB</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImageFile(file);
                if (file) setImageUrl(""); // ถ้าเลือกไฟล์ให้เคลียร์ URL ออก
              }}
            />
          </div>
        </div>

        {/* พรีวิวรูป */}
        {preview && (
          <div className="mt-3">
            <div className="form-label">พรีวิวรูป</div>
            <img
              src={preview}
              alt="preview"
              style={{ width: 140, height: 140, objectFit: "cover", borderRadius: 8, border: "1px solid #eee", background: "#fff" }}
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          </div>
        )}

        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "กำลังบันทึก..." : "💾 บันทึก"}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => {
              setName(""); setPrice(""); setStock(""); setImageUrl(""); setImageFile(null); setPreview(""); setMsg(null);
            }}
            disabled={loading}
          >
            ล้างฟอร์ม
          </button>
        </div>
      </form>
    </div>
  );
}
