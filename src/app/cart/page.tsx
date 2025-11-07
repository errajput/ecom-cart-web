"use client";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { CartItem } from "@/lib/types";
import Link from "next/link";
import { formatPrice } from "@/utils/format";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Fetch cart on mount
  useEffect(() => {
    getCart();
  }, []);

  async function getCart() {
    try {
      const res = await fetchAPI("/cart");
      setCart(res.items || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(id: string) {
    await fetchAPI(`/cart/${id}`, { method: "DELETE" });
    getCart();
  }

  async function handleUpdate(id: string, newQty: number) {
    if (newQty < 1) return; // prevent negative or zero
    await fetchAPI(`/cart`, {
      method: "POST",
      body: JSON.stringify({ productId: id, qty: newQty }),
    });
    getCart();
  }

  if (loading) return <div className="p-6">Loading cart...</div>;

  return (
    <main className="p-6 max-w-3xl mx-auto relative">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center border p-4 rounded-lg"
            >
              <div>
                <p className="font-semibold">{item.product?.name}</p>
                <p className="text-gray-600">
                  {formatPrice(item.product?.price)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center border rounded">
                  <button
                    onClick={() =>
                      handleUpdate(
                        item.product._id,
                        item.qty > 1 ? item.qty - 1 : 1
                      )
                    }
                    className="px-2 py-1 text-lg font-bold hover:bg-gray-200"
                  >
                    -
                  </button>
                  <input
                    value={item.qty}
                    min={1}
                    className="w-12 text-center "
                    onChange={(e) =>
                      handleUpdate(item.product._id, Number(e.target.value))
                    }
                  />
                  <button
                    onClick={() => handleUpdate(item.product._id, item.qty + 1)}
                    className="px-2 py-1 text-lg font-bold hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemove(item._id!)}
                  className="cursor-pointer text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="border-t pt-4 mt-6 flex justify-between items-center">
            <p className="text-xl font-bold">Total: {formatPrice(total)}</p>
            <Link
              href="/checkout"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4 inline-block"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
