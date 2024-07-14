"use client";

import { useState } from "react";
import { createEscrow } from "@/utils/escrow";

export default function CreateEscrowPage() {
  const [loading, setLoading] = useState(false);
  const [txId, setTxId] = useState("");
  const [seed, setSeed] = useState("");
  const [deposit, setDeposit] = useState("");
  const [receive, setReceive] = useState("");

  const handleCreate = async () => {
    setLoading(true);
    try {
      const tx = await createEscrow(
        parseInt(seed),
        parseInt(deposit),
        parseInt(receive)
      );
      setTxId(tx);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 text-white">Create Escrow</h1>
      <div className="w-full max-w-md bg-black p-6 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Seed"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded-md"
        />
        <input
          type="text"
          placeholder="Deposit Amount"
          value={deposit}
          onChange={(e) => setDeposit(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded-md"
        />
        <input
          type="text"
          placeholder="Receive Amount"
          value={receive}
          onChange={(e) => setReceive(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded-md"
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className={`w-full px-4 py-2 font-bold text-white rounded-md ${loading ? "bg-gray-400" : "bg-purple-500 hover:bg-purple-700"}`}
        >
          {loading ? "Creating..." : "Create"}
        </button>
        {txId && <p className="mt-4 text-green-500">Transaction ID: {txId}</p>}
      </div>
    </main>
  );
}
