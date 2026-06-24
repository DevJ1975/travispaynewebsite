import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-content flex-col items-center justify-center px-6 text-center">
      <p className="text-overline uppercase text-tp-gold">404</p>
      <h1 className="mt-4 font-display text-display-lg font-light text-tp-white">
        This page took a different stage
      </h1>
      <p className="mt-4 max-w-prose text-tp-gray">
        The page you are looking for moved or never existed.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center rounded-tp-md bg-tp-gold px-6 font-medium text-tp-black transition-colors hover:bg-tp-gold-dk"
      >
        Back home
      </Link>
    </div>
  );
}
