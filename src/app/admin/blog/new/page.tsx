import { requireEditor } from '@/lib/auth/session';
import { PostEditor } from '@/components/admin/PostEditor';

export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  await requireEditor();
  return (
    <div>
      <h1 className="mb-8 font-display text-display-sm text-tp-white">New post</h1>
      <PostEditor />
    </div>
  );
}
