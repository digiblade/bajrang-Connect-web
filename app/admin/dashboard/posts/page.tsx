import PostsApprovalManager from "@/components/admin/posts-approval-manager";

export default function PostsAdminPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <h1 className="text-2xl font-bold text-orange-600">
        Posts Approval
      </h1>
      <PostsApprovalManager />
    </main>
  );
}
