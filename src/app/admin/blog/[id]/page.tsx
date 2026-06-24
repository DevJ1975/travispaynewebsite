import { notFound } from 'next/navigation';
import { requireEditor } from '@/lib/auth/session';
import { getPostByIdAdmin } from '@/lib/queries/blog';
import { PostEditor } from '@/components/admin/PostEditor';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireEditor();
  const { id } = await params;
  const post = await getPostByIdAdmin(id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-8 font-display text-display-sm text-tp-white">Edit post</h1>
      <PostEditor post={post} />
    </div>
  );
}
