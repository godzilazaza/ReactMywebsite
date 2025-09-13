const KEY = "cart_items_v1";

export type PersistCartItem = {
  code: string;
  name: string;
  price: number;
  qty: number;
  image?: string | null;
};

export function loadCart(): PersistCartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: PersistCartItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
}

export function clearCart() {
  localStorage.removeItem(KEY);
}
