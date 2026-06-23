'use client';

import { useActionState, useState } from 'react';
import { savePost, type PostFormState } from '@/lib/actions/posts';
import { Markdown } from '@/components/blog/Markdown';
import { BLOG_CATEGORIES, type BlogPost } from '@/lib/types/blog';
import { errorClass, fieldClass, labelClass } from '@/components/forms/styles';

const initialState: PostFormState = { ok: false, message: '' };
const CATEGORIES = BLOG_CATEGORIES.filter((category) => category !== 'All');

export function PostEditor({ post }: { post?: BlogPost }) {
  const [state, action, pending] = useActionState(savePost, initialState);
  const [body, setBody] = useState(post?.bodyMdx ?? '');

  return (
    <form action={action} className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-5">
        {post && <input type="hidden" name="id" value={post.id} />}

        <div>
          <label htmlFor="title" className={labelClass}>
            Title
          </label>
          <input id="title" name="title" defaultValue={post?.title} className={fieldClass} />
          {state.fieldErrors?.title && <p className={errorClass}>{state.fieldErrors.title}</p>}
        </div>

        <div>
          <label htmlFor="slug" className={labelClass}>
            Slug
          </label>
          <input id="slug" name="slug" defaultValue={post?.slug} className={fieldClass} />
          {state.fieldErrors?.slug && <p className={errorClass}>{state.fieldErrors.slug}</p>}
        </div>

        <div>
          <label htmlFor="excerpt" className={labelClass}>
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            defaultValue={post?.excerpt}
            className={fieldClass}
          />
          {state.fieldErrors?.excerpt && <p className={errorClass}>{state.fieldErrors.excerpt}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className={labelClass}>
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue={post?.categories[0] ?? CATEGORIES[0]}
              className={fieldClass}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="status" className={labelClass}>
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={post?.status === 'published' ? 'published' : 'draft'}
              className={fieldClass}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="tags" className={labelClass}>
            Tags (comma-separated)
          </label>
          <input id="tags" name="tags" defaultValue={post?.tags.join(', ')} className={fieldClass} />
        </div>

        <div>
          <label htmlFor="coverImageUrl" className={labelClass}>
            Cover image URL
          </label>
          <input
            id="coverImageUrl"
            name="coverImageUrl"
            defaultValue={post?.coverImageUrl}
            className={fieldClass}
          />
          {state.fieldErrors?.coverImageUrl && (
            <p className={errorClass}>{state.fieldErrors.coverImageUrl}</p>
          )}
        </div>

        <div>
          <label htmlFor="bodyMdx" className={labelClass}>
            Body (Markdown)
          </label>
          <textarea
            id="bodyMdx"
            name="bodyMdx"
            rows={16}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className={`${fieldClass} font-mono`}
          />
          {state.fieldErrors?.bodyMdx && <p className={errorClass}>{state.fieldErrors.bodyMdx}</p>}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 items-center rounded-tp-md bg-tp-gold px-6 font-medium text-tp-black disabled:opacity-50"
          >
            {pending ? 'Saving…' : 'Save'}
          </button>
          {state.message && (
            <span role="status" className={state.ok ? 'text-sm text-tp-success' : 'text-sm text-tp-error'}>
              {state.message}
            </span>
          )}
        </div>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="mb-3 text-overline uppercase text-tp-gold">Live preview</p>
        <div className="rounded-tp-lg border border-tp-border bg-tp-surface p-6">
          {body.trim() ? <Markdown>{body}</Markdown> : <p className="text-tp-muted">Start writing to see a preview.</p>}
        </div>
      </div>
    </form>
  );
}
