import { notFound } from 'next/navigation';
import { requireEditor } from '@/lib/auth/session';
import { getPageByIdAdmin } from '@/lib/queries/pages';
import { PageEditor } from '@/components/admin/PageEditor';

export const dynamic = 'force-dynamic';

export default async function EditPageRoute({ params }: { params: Promise<{ id: string }> }) {
  await requireEditor();
  const { id } = await params;
  const page = await getPageByIdAdmin(id);
  if (!page) notFound();

  return <PageEditor pageId={page.id} slug={page.slug} initialData={page.draftData} />;
}
