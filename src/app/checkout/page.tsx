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
      const payload = {
        name,
        email,
        cartItems: cartItems.map((item) => ({
          productId: item.product._id,
          qty: item.qty,
        })),
      };
      const data = await fetchAPI("/checkout", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setReceipt(data.receipt);
    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setReceipt(null);

  return (
    <main className="p-6 max-w-3xl mx-auto relative">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      {/* Cart Summary */}
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

      {/* User Details */}
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

      {/*  Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white w-96 p-6 rounded-2xl shadow-xl text-center">
            <h2 className="text-2xl font-semibold text-green-600 mb-2">
              Order Successful!
            </h2>
            <p className="text-lg mb-1 font-medium">
              Thank you for your order!
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Name:</strong> {name}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> {email}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Total:</strong> ₹{receipt.total}
            </p>
            <p className="text-gray-600">
              <strong>Date:</strong>{" "}
              {new Date(receipt.timestamp).toLocaleString()}
            </p>

            <button
              onClick={closeModal}
              className="cursor-pointer mt-5 bg-gray-800 text-white px-5 py-2 rounded-md hover:bg-gray-900"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
