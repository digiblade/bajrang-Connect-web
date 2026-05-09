"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, getFirestore, onSnapshot, query, orderBy } from "firebase/firestore";
import {
  createUpdate,
  updateUpdate,
  deleteUpdate,
  publishUpdate,
  archiveUpdate,
  type Update,
  type UpdateStatus,
  type UpdateCategory,
} from "@/lib/updates-firestore";

const db = getFirestore();

type UpdateRecord = Update & {
  id: string;
  createdAt?: { seconds?: number };
  updatedAt?: { seconds?: number };
  publishedAt?: { seconds?: number };
  scheduledFor?: { seconds?: number };
};

function formatTimestamp(timestamp?: { seconds?: number }) {
  if (!timestamp?.seconds) return "N/A";
  return new Date(timestamp.seconds * 1000).toLocaleString();
}

const categoryColors: Record<UpdateCategory, string> = {
  urgent: "bg-red-100 text-red-700",
  general: "bg-blue-100 text-blue-700",
  informational: "bg-gray-100 text-gray-700",
};

const statusColors: Record<UpdateStatus, string> = {
  draft: "bg-yellow-100 text-yellow-700",
  published: "bg-green-100 text-green-700",
  archived: "bg-gray-100 text-gray-700",
};

export default function UpdatesManager() {
  const [updates, setUpdates] = useState<UpdateRecord[]>([]);
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<UpdateStatus | "all">("all");
  const [editingUpdate, setEditingUpdate] = useState<UpdateRecord | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    category: "general" as UpdateCategory,
    scheduledFor: "",
  });

  useEffect(() => {
    const q = query(collection(db, "updates"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<UpdateRecord, "id">),
        }));
        setUpdates(data);
      },
      () => {
        setError("Failed to load updates.");
      }
    );

    return () => unsub();
  }, []);

  const filteredUpdates = useMemo(() => {
    if (filterStatus === "all") return updates;
    return updates.filter((u) => u.status === filterStatus);
  }, [updates, filterStatus]);

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      imageUrl: "",
      category: "general",
      scheduledFor: "",
    });
    setEditingUpdate(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (update: UpdateRecord) => {
    setFormData({
      title: update.title,
      content: update.content,
      imageUrl: update.imageUrl || "",
      category: update.category,
      scheduledFor: update.scheduledFor
        ? new Date(update.scheduledFor.seconds! * 1000).toISOString().slice(0, 16)
        : "",
    });
    setEditingUpdate(update);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const submitKey = editingUpdate ? `edit-${editingUpdate.id}` : "create";
    setPending((prev) => ({ ...prev, [submitKey]: true }));

    try {
      const data = {
        title: formData.title,
        content: formData.content,
        imageUrl: formData.imageUrl || undefined,
        category: formData.category,
        status: "draft" as UpdateStatus,
        scheduledFor: formData.scheduledFor
          ? new Date(formData.scheduledFor)
          : undefined,
      };

      if (editingUpdate) {
        await updateUpdate(editingUpdate.id, data);
      } else {
        await createUpdate(data);
      }

      setShowModal(false);
      resetForm();
    } catch {
      setError("Failed to save update.");
    } finally {
      setPending((prev) => ({ ...prev, [submitKey]: false }));
    }
  };

  const handlePublish = async (updateId: string) => {
    setPending((prev) => ({ ...prev, [`publish-${updateId}`]: true }));
    setError("");
    try {
      await publishUpdate(updateId);
    } catch {
      setError("Failed to publish update.");
    } finally {
      setPending((prev) => ({ ...prev, [`publish-${updateId}`]: false }));
    }
  };

  const handleArchive = async (updateId: string) => {
    setPending((prev) => ({ ...prev, [`archive-${updateId}`]: true }));
    setError("");
    try {
      await archiveUpdate(updateId);
    } catch {
      setError("Failed to archive update.");
    } finally {
      setPending((prev) => ({ ...prev, [`archive-${updateId}`]: false }));
    }
  };

  const handleDelete = async (updateId: string) => {
    if (!confirm("Are you sure you want to delete this update?")) return;

    setPending((prev) => ({ ...prev, [`delete-${updateId}`]: true }));
    setError("");
    try {
      await deleteUpdate(updateId);
    } catch {
      setError("Failed to delete update.");
    } finally {
      setPending((prev) => ({ ...prev, [`delete-${updateId}`]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-4 shadow">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-orange-600">
              Updates Management
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Create, manage, and broadcast updates to all users.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
          >
            Create Update
          </button>
        </div>

        <div className="mb-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as UpdateStatus | "all")}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="all">All Updates</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {error ? (
          <p className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {filteredUpdates.length === 0 ? (
          <p className="rounded border border-dashed p-4 text-sm text-gray-500">
            No updates found.
          </p>
        ) : (
          <div className="space-y-3">
            {filteredUpdates.map((update) => {
              const publishPending = pending[`publish-${update.id}`];
              const archivePending = pending[`archive-${update.id}`];
              const deletePending = pending[`delete-${update.id}`];

              return (
                <article
                  key={update.id}
                  className="rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900">
                          {update.title}
                        </h3>
                        <span
                          className={`rounded px-2 py-1 text-xs font-semibold ${categoryColors[update.category]}`}
                        >
                          {update.category}
                        </span>
                        <span
                          className={`rounded px-2 py-1 text-xs font-semibold ${statusColors[update.status]}`}
                        >
                          {update.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Created: {formatTimestamp(update.createdAt)}{" "}
                        {update.updatedAt &&
                          `• Updated: ${formatTimestamp(update.updatedAt)}`}
                      </p>
                    </div>
                  </div>

                  {update.imageUrl && (
                    <img
                      src={update.imageUrl}
                      alt={update.title}
                      className="mt-3 h-44 w-full rounded-md object-cover"
                    />
                  )}

                  <div className="mt-3">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {update.content}
                    </p>
                  </div>

                  {update.scheduledFor && (
                    <p className="mt-2 text-xs text-gray-500">
                      ⏰ Scheduled for: {formatTimestamp(update.scheduledFor)}
                    </p>
                  )}

                  {update.publishedAt && (
                    <p className="mt-2 text-xs text-gray-500">
                      📢 Published at: {formatTimestamp(update.publishedAt)}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {update.status === "draft" && (
                      <button
                        onClick={() => handlePublish(update.id!)}
                        disabled={publishPending}
                        className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        Publish
                      </button>
                    )}

                    {update.status === "published" && (
                      <button
                        onClick={() => handleArchive(update.id!)}
                        disabled={archivePending}
                        className="rounded bg-gray-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                      >
                        Archive
                      </button>
                    )}

                    {update.status === "draft" && (
                      <button
                        onClick={() => openEditModal(update)}
                        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(update.id!)}
                      disabled={deletePending}
                      className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingUpdate ? "Edit Update" : "Create Update"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Update title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  rows={6}
                  placeholder="Write your update content..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as UpdateCategory,
                    })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="general">General</option>
                  <option value="urgent">Urgent</option>
                  <option value="informational">Informational</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Schedule for (optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledFor}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledFor: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending.create || pending[`edit-${editingUpdate?.id}`]}
                  className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
                >
                  {editingUpdate ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
