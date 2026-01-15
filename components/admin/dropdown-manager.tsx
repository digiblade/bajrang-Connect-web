"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { addItem, toggleActive } from "@/lib/admin-firestore";

const db = getFirestore();

export default function DropdownManager({
  title,
  collectionName,
}: {
  title: string;
  collectionName: string;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, collectionName),
      (snap) => {
        setItems(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        );
      }
    );
    return () => unsub();
  }, []);

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h2 className="mb-3 text-lg font-semibold text-orange-600">
        {title}
      </h2>

      <div className="mb-4 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`Add ${title}`}
          className="flex-1 rounded border px-3 py-2"
        />
        <button
          onClick={async () => {
            if (!name.trim()) return;
            await addItem(collectionName, { name });
            setName("");
          }}
          className="rounded bg-orange-500 px-4 text-white"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((i) => (
          <li
            key={i.id}
            className="flex items-center justify-between rounded border p-2"
          >
            <span>{i.name}</span>
            <button
              onClick={() =>
                toggleActive(
                  collectionName,
                  i.id,
                  !i.isActive
                )
              }
              className={`text-sm ${
                i.isActive
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {i.isActive ? "Active" : "Inactive"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
