"use client";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { Product } from "@/lib/types";
import Link from "next/link";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchAPI("/products").then(setProducts).catch(console.error);
  }, []);

  const handleAddToCart = async (productId: string) => {
    await fetchAPI("/cart", {
      method: "POST",
      body: JSON.stringify({ productId, qty: 1 }),
    });
    alert("Added to cart!");
  };

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link
          href="/cart"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Go to Cart
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map((p) => (
          <div
            key={p._id}
            className="border p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-gray-600 mb-2">${p.price}</p>
            <button
              onClick={() => handleAddToCart(p._id)}
              className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
