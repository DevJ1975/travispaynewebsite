export interface GalleryBlockProps {
  images?: { url: string; alt?: string; caption?: string }[];
  columns?: '2' | '3' | '4';
  aspectRatio?: string;
}

const colClass: Record<string, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-3',
  '4': 'sm:grid-cols-4',
};

export function GalleryBlock({ images = [], columns = '3', aspectRatio = '16/9' }: GalleryBlockProps) {
  if (!images.length) {
    return (
      <section className="px-6 py-16 md:px-16">
        <p className="mx-auto max-w-site text-tp-muted">Add images in the editor.</p>
      </section>
    );
  }

  return (
    <section className="px-6 py-16 md:px-16">
      <div className={`mx-auto grid max-w-site grid-cols-1 gap-4 ${colClass[columns] ?? colClass['3']}`}>
        {images.map((image, index) => (
          <figure key={`${image.url}-${index}`}>
            <div style={{ aspectRatio }} className="overflow-hidden rounded-tp-lg bg-tp-elevated">
              {/* eslint-disable-next-line @next/next/no-img-element -- editor supplies arbitrary URLs */}
              <img src={image.url} alt={image.alt ?? ''} className="h-full w-full object-cover" />
            </div>
            {image.caption && <figcaption className="mt-2 text-xs text-tp-muted">{image.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </section>
  );
}
