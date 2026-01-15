"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { addItem, toggleActive } from "@/lib/admin-firestore";

const db = getFirestore();

export default function KhandManager() {
  const [prakhandList, setPrakhandList] = useState<any[]>([]);
  const [khandList, setKhandList] = useState<any[]>([]);
  const [selectedPrakhand, setSelectedPrakhand] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "prakhand"), (snap) => {
      setPrakhandList(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    });

    const unsub2 = onSnapshot(collection(db, "khand"), (snap) => {
      setKhandList(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  // 🔑 group khands by prakhandId
  const groupedKhands = prakhandList.map((p) => ({
    ...p,
    khands: khandList.filter(
      (k) => k.prakhandId === p.id
    ),
  }));

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h2 className="mb-4 text-lg font-semibold text-orange-600">
        Khand Management
      </h2>

      {/* ADD KHAND */}
      <div className="mb-6 flex gap-2">
        <select
          value={selectedPrakhand}
          onChange={(e) => setSelectedPrakhand(e.target.value)}
          className="rounded border px-2 py-1"
        >
          <option value="">Select Prakhand</option>
          {prakhandList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Khand name"
          className="flex-1 rounded border px-3 py-1"
        />

        <button
          onClick={async () => {
            if (!name || !selectedPrakhand) return;
            await addItem("khand", {
              name,
              prakhandId: selectedPrakhand,
            });
            setName("");
          }}
          className="rounded bg-orange-500 px-4 text-white"
        >
          Add
        </button>
      </div>

      {/* GROUPED VIEW */}
      <div className="space-y-4">
        {groupedKhands.map((p) => (
          <div key={p.id} className="rounded border p-3">
            <h3 className="mb-2 font-semibold text-gray-800">
              {p.name}
            </h3>

            {p.khands.length === 0 ? (
              <p className="text-sm text-gray-400">
                No khands added
              </p>
            ) : (
              <ul className="space-y-1">
                {p.khands.map((k:any) => (
                  <li
                    key={k.id}
                    className="flex justify-between rounded bg-gray-50 px-2 py-1"
                  >
                    <span>{k.name}</span>
                    <button
                      onClick={() =>
                        toggleActive(
                          "khand",
                          k.id,
                          !k.isActive
                        )
                      }
                      className={
                        k.isActive
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {k.isActive ? "Active" : "Inactive"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
