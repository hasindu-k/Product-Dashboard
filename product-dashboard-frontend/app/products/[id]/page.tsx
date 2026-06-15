import axios from "axios";
import Link from "next/link";
import { type Product } from "@/store/productstore";

interface ProductDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetails({ params }: ProductDetailsProps) {
  const { id } = await params;
  const { data: product } = await axios.get<Product>(
    `https://fakestoreapi.com/products/${id}`,
  );

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
          <img
            src={product.image}
            alt={product.title}
            className="h-72 w-full rounded border border-gray-200 object-contain p-4"
          />

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
