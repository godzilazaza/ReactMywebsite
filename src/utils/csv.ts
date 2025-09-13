export function downloadCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv =
    [headers.join(",")]
      .concat(rows.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(",")))
      .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
//Browser จะดาวน์โหลดไฟล์ .csv ที่เปิดใน Excel ได้
//downloadCSV คือฟังก์ชัน export ข้อมูลเป็น CSV แล้วให้ผู้ใช้โหลดไฟล์ได้ทันทีใน Browser