"use client";

import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {

      if (!user) {
        setLoading(false);
        router.replace("/admin/login");
        return;
      }

      setLoading(false);
    });
  }, []);

  if (loading) return <p className="p-6">Checking access...</p>;

  return <>{children}</>;
}
