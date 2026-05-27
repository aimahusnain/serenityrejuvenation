"use client";

import { createContext, useContext } from "react";

export type Product = {
  id: string;
  title: string;
  price?: string | null;
  description: string;
  image: string;
  benefits: string[];
};

type ProductsContextType = {
  products: Product[];
};

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({
  children,
  initialProducts,
}: {
  children: React.ReactNode;
  initialProducts: Product[];
}) {
  return (
    <ProductsContext.Provider value={{ products: initialProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used inside ProductsProvider");
  return ctx.products;
}