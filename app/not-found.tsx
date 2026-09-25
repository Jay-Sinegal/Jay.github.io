export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="text-sm font-semibold tracking-[0.18em] text-cobalt uppercase">
          Error 404
        </p>
        <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-white">
          This page is not here.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-white/60">
          The brand strategy, however, is very much here. Head back to the homepage.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-md bg-cobalt px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          Back to jaylensinegal.com
        </a>
      </div>
    </main>
  );
}