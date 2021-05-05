export type ShopState = {
  cart: Cart;
  products: Product[];
};

type Item = {
  id: string;
  quantity: number;
};

export type Cart = {
  items: Item[];
  add: (id: string) => void;
  remove: (id: string) => void;
  count: number;
  clear: () => void;
  url?: string;
};

export type Variant = {
  id: string;
  available: boolean;
  price: string;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  images: string[];
  available: boolean;
  variants: Variant[];
};
