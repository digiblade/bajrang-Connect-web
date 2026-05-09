import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";

const db = getFirestore();

export type UpdateCategory = "urgent" | "general" | "informational";
export type UpdateStatus = "draft" | "published" | "archived";

export interface Update {
  id?: string;
  title: string;
  content: string;
  imageUrl?: string;
  category: UpdateCategory;
  status: UpdateStatus;
  publishedAt?: Date;
  scheduledFor?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  notificationSent?: boolean;
}

export async function createUpdate(data: Omit<Update, "id" | "createdAt" | "updatedAt">) {
  await addDoc(collection(db, "updates"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateUpdate(updateId: string, data: Partial<Update>) {
  await updateDoc(doc(db, "updates", updateId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteUpdate(updateId: string) {
  await deleteDoc(doc(db, "updates", updateId));
}

export async function publishUpdate(updateId: string) {
  await updateDoc(doc(db, "updates", updateId), {
    status: "published",
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function archiveUpdate(updateId: string) {
  await updateDoc(doc(db, "updates", updateId), {
    status: "archived",
    updatedAt: serverTimestamp(),
  });
}

export async function getUpdateById(updateId: string): Promise<Update | null> {
  const docSnap = await getDoc(doc(db, "updates", updateId));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...(docSnap.data() as Omit<Update, "id">) };
}

export async function getUpdatesByStatus(
  status: UpdateStatus
): Promise<Update[]> {
  const q = query(
    collection(db, "updates"),
    where("status", "==", status),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Update, "id">),
  }));
}

export async function getAllUpdates(): Promise<Update[]> {
  const q = query(collection(db, "updates"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Update, "id">),
  }));
}
