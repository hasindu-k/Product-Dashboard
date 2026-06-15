import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/services/productservice";

interface ProductDetailsProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailsProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id).catch(() => null);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: product.title,
    description: product.description,
  };
}

export default async function ProductDetails({ params }: ProductDetailsProps) {
  const { id } = await params;
  const product = await getProduct(id).catch(() => null);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-6 py-8 text-gray-900">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-6 inline-block rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Back to Home
        </Link>

        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="h-72 w-full rounded border border-gray-200 object-contain p-4"
            />
          ) : (
            <div className="flex h-72 w-full items-center justify-center rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
              No image
            </div>
          )}

          <div>
            <p className="mb-2 text-sm capitalize text-gray-600">
              {product.category}
            </p>
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <p className="mt-4 text-gray-700">{product.description}</p>
            <p className="mt-4 text-xl font-semibold">${product.price}</p>
            <p className="mt-2 text-sm text-gray-600">
              ⭐ {product.rating.rate} ({product.rating.count} reviews)
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
