import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-10 text-gray-900">
      <section className="w-full max-w-md rounded border border-gray-200 p-6 text-center shadow-sm">
        <p className="text-sm font-medium text-gray-500">404</p>
        <h1 className="mt-3 text-2xl font-bold">Page not found</h1>
        <p className="mt-3 text-sm text-gray-600">
          The product or page you are looking for is not available.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Back to products
        </Link>
      </section>
    </main>
  );
}
