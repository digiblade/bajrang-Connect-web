import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

const db = getFirestore();

export async function addItem(
  col: string,
  data: Record<string, unknown>
) {
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

export async function toggleUserFlag(
  userId: string,
  field: "isActive" | "isValid" | "admin",
  value: boolean
) {
  await updateDoc(doc(db, "users", userId), { [field]: value });
}

export function isUserBlocked(user: {
  isActive?: boolean;
  isValid?: boolean;
}) {
  return user.isActive === false && user.isValid === false;
}

export async function togglePostBlocked(
  postId: string,
  value: boolean
) {
  await updateDoc(doc(db, "posts", postId), { isBlocked: value });
}

export async function deletePost(postId: string) {
  await deleteDoc(doc(db, "posts", postId));
}

export async function updatePostStatus(
  postId: string,
  status: "approved" | "blocked"
) {
  await updateDoc(doc(db, "posts", postId), { status });
}
