import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

export async function adminLogin(email: string, password: string) {
  // 1️⃣ Login
  const cred = await signInWithEmailAndPassword(auth, email, password);

  if (!cred.user.uid) {
    await auth.signOut();
    throw new Error("Admin profile not found");
  }

  return true; // ✅ DONE
}
