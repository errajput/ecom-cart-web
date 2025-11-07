"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { CartItem } from "@/lib/types";

interface Receipt {
  total: number;
  timestamp: string;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch cart items on mount
  useEffect(() => {
    fetchAPI("/cart")
      .then((res) => {
        setCartItems(res.items || []);
      })
      .catch(console.error);
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  const handleCheckout = async () => {
    if (!name || !email) {
      alert("Please fill in your name and email");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchAPI("/checkout", {
        method: "POST",
        body: JSON.stringify({ cartItems }),
      });
      setReceipt(data);
    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (receipt) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-3xl font-bold mb-4 text-green-600">
          Order Successful!
        </h1>
        <p className="text-lg mb-2">Total: ₹{receipt.total}</p>
        <p className="text-gray-600 mb-2">
          Timestamp: {new Date(receipt.timestamp).toLocaleString()}
        </p>
        <p className="text-gray-700">Thank you for your order, {name}!</p>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center"> Checkout</h1>

      <section className="border rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Cart Summary</h2>
        {cartItems.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border-b py-2"
              >
                <span>
                  {item.product.name} (x{item.qty})
                </span>
                <span>₹{item.product.price * item.qty}</span>
              </div>
            ))}
            <div className="text-right font-bold text-lg mt-4">
              Total: ₹{total}
            </div>
          </>
        )}
      </section>

      <section className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Your Details</h2>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-2 mb-3 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="cursor-pointer w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </section>
    </main>
  );
}
