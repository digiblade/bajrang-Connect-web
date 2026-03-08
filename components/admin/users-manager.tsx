"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { isUserBlocked, toggleUserFlag } from "@/lib/admin-firestore";

const db = getFirestore();

type UserRecord = {
  id: string;
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
  isValid?: boolean;
};

export default function UsersManager() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "users"),
      (snap) => {
        const data = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<UserRecord, "id">),
        }));
        setUsers(data);
      },
      () => {
        setError("Failed to load users.");
      }
    );

    return () => unsub();
  }, []);

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const left = `${a.fullName || a.name || ""} ${a.email || ""}`.trim();
      const right = `${b.fullName || b.name || ""} ${b.email || ""}`.trim();
      return left.localeCompare(right);
    });
  }, [users]);

  async function onToggle(
    userId: string,
    field: "isActive" | "isValid",
    currentValue?: boolean
  ) {
    const key = `${userId}-${field}`;
    setPending((prev) => ({ ...prev, [key]: true }));
    setError("");

    try {
      await toggleUserFlag(userId, field, !(currentValue === true));
    } catch {
      setError("Failed to update user status.");
    } finally {
      setPending((prev) => ({ ...prev, [key]: false }));
    }
  }

  return (
    <section className="rounded-xl bg-white p-4 shadow">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-orange-600">
          User Management
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          A user is blocked only when both `isValid` and `isActive` are false.
        </p>
      </div>

      {error ? (
        <p className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {sortedUsers.length === 0 ? (
        <p className="rounded border border-dashed p-4 text-sm text-gray-500">
          No users found in `users` collection.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="border-b px-3 py-2 font-semibold">User</th>
                <th className="border-b px-3 py-2 font-semibold">Email</th>
                <th className="border-b px-3 py-2 font-semibold">Phone</th>
                <th className="border-b px-3 py-2 font-semibold">isValid</th>
                <th className="border-b px-3 py-2 font-semibold">isActive</th>
                <th className="border-b px-3 py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => {
                const blocked = isUserBlocked(user);
                const pendingValid = pending[`${user.id}-isValid`];
                const pendingActive = pending[`${user.id}-isActive`];

                return (
                  <tr key={user.id} className="align-top">
                    <td className="border-b px-3 py-2">
                      {user.fullName || user.name || "Unknown"}
                    </td>
                    <td className="border-b px-3 py-2">
                      {user.email || "-"}
                    </td>
                    <td className="border-b px-3 py-2">
                      {user.phone || "-"}
                    </td>
                    <td className="border-b px-3 py-2">
                      <button
                        onClick={() =>
                          onToggle(user.id, "isValid", user.isValid)
                        }
                        disabled={pendingValid}
                        className={`rounded px-3 py-1 font-medium ${
                          user.isValid
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        } disabled:opacity-50`}
                      >
                        {user.isValid ? "True" : "False"}
                      </button>
                    </td>
                    <td className="border-b px-3 py-2">
                      <button
                        onClick={() =>
                          onToggle(user.id, "isActive", user.isActive)
                        }
                        disabled={pendingActive}
                        className={`rounded px-3 py-1 font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        } disabled:opacity-50`}
                      >
                        {user.isActive ? "True" : "False"}
                      </button>
                    </td>
                    <td className="border-b px-3 py-2">
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${
                          blocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {blocked ? "Blocked" : "Can Use App"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
