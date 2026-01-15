import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const db = getFirestore();

export async function addItem(col: string, data: any) {
  await addDoc(collection(db, col), {
    ...data,
    isActive: true,
    createdAt: serverTimestamp(),
  });
}

export async function toggleActive(
  col: string,
  id: string,
  value: boolean
) {
  await updateDoc(doc(db, col, id), { isActive: value });
}
