import { create } from "zustand";

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string | null;
  price: number;
  rating: {
    rate: number;
    count: number;
  };
  user_rating?: number | null;
}

interface ProductState {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
}));
