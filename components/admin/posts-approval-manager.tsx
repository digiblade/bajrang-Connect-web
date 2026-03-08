"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { deletePost, updatePostStatus } from "@/lib/admin-firestore";

const db = getFirestore();

type PostRecord = {
  id: string;
  caption?: string;
  mediaType?: string;
  mediaUrl?: string;
  createdAt?: { seconds?: number };
  status?: string;
  userId?: string;
  userMobile?: string;
  userName?: string;
  prakhandId?: string;
  khandId?: string;
};

function formatCreatedAt(post: PostRecord) {
  if (!post.createdAt?.seconds) return "N/A";
  return new Date(post.createdAt.seconds * 1000).toLocaleString();
}

export default function PostsApprovalManager() {
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "posts"),
      (snap) => {
        const data = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<PostRecord, "id">),
        }));
        setPosts(data);
      },
      () => {
        setError("Failed to load posts.");
      }
    );

    return () => unsub();
  }, []);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const left = a.createdAt?.seconds ?? 0;
      const right = b.createdAt?.seconds ?? 0;
      return right - left;
    });
  }, [posts]);

  async function onToggleBlock(postId: string, isBlocked: boolean) {
    setPending((prev) => ({ ...prev, [`block-${postId}`]: true }));
    setError("");
    try {
      await updatePostStatus(postId, isBlocked ? "approved" : "blocked");
    } catch {
      setError("Failed to update post state.");
    } finally {
      setPending((prev) => ({ ...prev, [`block-${postId}`]: false }));
    }
  }

  async function onDelete(postId: string) {
    setPending((prev) => ({ ...prev, [`delete-${postId}`]: true }));
    setError("");
    try {
      await deletePost(postId);
    } catch {
      setError("Failed to delete post.");
    } finally {
      setPending((prev) => ({ ...prev, [`delete-${postId}`]: false }));
    }
  }

  return (
    <section className="rounded-xl bg-white p-4 shadow">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-orange-600">
          Post Approval
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Admin can block/unblock or delete any post.
        </p>
      </div>

      {error ? (
        <p className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {sortedPosts.length === 0 ? (
        <p className="rounded border border-dashed p-4 text-sm text-gray-500">
          No posts found in `posts` collection.
        </p>
      ) : (
        <div className="space-y-3">
          {sortedPosts.map((post) => {
            const blockPending = pending[`block-${post.id}`];
            const deletePending = pending[`delete-${post.id}`];
            const author = post.userName || post.userId || "Unknown";
            const isBlocked = post.status === "blocked";

            return (
              <article
                key={post.id}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {post.caption || "Untitled Post"}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      By {author} • {formatCreatedAt(post)}
                    </p>
                  </div>
                  <span
                    className={`rounded px-2 py-1 text-xs font-semibold ${
                      isBlocked
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {isBlocked ? "Blocked" : post.status || "Approved"}
                  </span>
                </div>

                {post.mediaUrl ? (
                  <img
                    src={post.mediaUrl}
                    alt={post.caption || "Post media"}
                    className="mt-3 h-44 w-full rounded-md object-cover"
                  />
                ) : null}

                <div className="mt-3 text-sm text-gray-700">
                  <p>{post.caption || "-"}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Media: {post.mediaType || "-"} | Mobile: {post.userMobile || "-"}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => onToggleBlock(post.id, isBlocked)}
                    disabled={blockPending}
                    className={`rounded px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50 ${
                      isBlocked
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-amber-600 hover:bg-amber-700"
                    }`}
                  >
                    {isBlocked ? "Unblock Post" : "Block Post"}
                  </button>

                  <button
                    onClick={() => onDelete(post.id)}
                    disabled={deletePending}
                    className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Delete Post
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
