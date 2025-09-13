import React, { useMemo } from "react";
import { formatTHB } from "../utils/money";

export type CartItem = {
  code: string;
  name: string;
  price: number;   // หน่วยเป็น number (ไม่ใช่ "xx THB")
  qty: number;
  image?: string | null;
};

type Props = {
  items: CartItem[];
  vatRate?: number; // 0.07 = 7%
  onQtyChange: (code: string, nextQty: number) => void;
  onRemove: (code: string) => void;
  onClear: () => void;
  onCheckout: (summary: {
    subtotal: number; vat: number; total: number;
    items: CartItem[];
  }) => void;
};

export default function Cart({
  items,
  vatRate = 0.07,
  onQtyChange,
  onRemove,
  onClear,
  onCheckout,
}: Props) {
  const { subtotal, vat, total } = useMemo(() => {
    const sub = items.reduce((s, it) => s + it.price * it.qty, 0);
    const v = Math.round(sub * vatRate * 100) / 100;
    return { subtotal: sub, vat: v, total: sub + v };
  }, [items, vatRate]);

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>🧺 ตะกร้าสินค้า</h3>
        <button className="btn btn-sm btn-outline-secondary" onClick={onClear} disabled={!items.length}>
          ล้างตะกร้า
        </button>
      </div>

      {!items.length ? (
        <div style={{ padding: 12, color: "#777" }}>ยังไม่มีสินค้าในตะกร้า</div>
      ) : (
        <div style={{ maxHeight: 320, overflow: "auto" }}>
          <table className="table table-sm align-middle" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{width:56}}></th>
                <th>สินค้า</th>
                <th className="text-end">ราคา</th>
                <th className="text-center" style={{width:140}}>จำนวน</th>
                <th className="text-end">รวม</th>
                <th style={{width:56}}></th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it.code}>
                  <td>
                    {it.image ? (
                      <img src={it.image} width={44} height={44} style={{ borderRadius: 6, objectFit: "cover" }} />
                    ) : (
                      <div style={{ width:44, height:44, borderRadius:6, background:"#eee" }}/>
                    )}
                  </td>
                  <td>
                    <div style={{fontWeight:600}}>{it.name}</div>
                    <div style={{fontSize:12, color:"#777"}}>{it.code}</div>
                  </td>
                  <td className="text-end">{formatTHB(it.price)}</td>
                  <td className="text-center">
                    <div className="btn-group btn-group-sm" role="group">
                      <button className="btn btn-outline-secondary" onClick={() => onQtyChange(it.code, Math.max(1, it.qty - 1))}>−</button>
                      <button className="btn btn-light" disabled style={{ minWidth: 44 }}>{it.qty}</button>
                      <button className="btn btn-outline-secondary" onClick={() => onQtyChange(it.code, it.qty + 1)}>+</button>
                    </div>
                  </td>
                  <td className="text-end">{formatTHB(it.price * it.qty)}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => onRemove(it.code)}>ลบ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* สรุปราคา */}
      <div style={{ marginTop: 12, borderTop: "1px dashed #e5e7eb", paddingTop: 12 }}>
        <div className="d-flex justify-content-between">
          <div>Subtotal</div><div>{formatTHB(subtotal)}</div>
        </div>
        <div className="d-flex justify-content-between">
          <div>VAT (7%)</div><div>{formatTHB(vat)}</div>
        </div>
        <div className="d-flex justify-content-between fw-bold" style={{ fontSize: 18 }}>
          <div>ยอดสุทธิ</div><div>{formatTHB(total)}</div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button
            className="btn btn-success"
            disabled={!items.length}
            onClick={() => onCheckout({ subtotal, vat, total, items })}
          >
            💳 ชำระเงิน (Checkout)
          </button>
        </div>
      </div>
    </div>
  );
}
