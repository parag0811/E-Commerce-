import { Suspense } from "react";
import AdminProductsComponent from "../../components/admin/AdminProducts";
import { Await, useLoaderData } from "react-router-dom";
import Spinner from "../../spinner/spinner";

export default function AdminProductsPage() {
  const data = useLoaderData();
  const products = data?.products || [];
  return (
    <Suspense fallback={<Spinner />}>
      <Await resolve={products}>
        {(loadedAdminProducts) => (
          <AdminProductsComponent products={loadedAdminProducts} />
        )}
      </Await>
    </Suspense>
  );
}

async function loadAdminProducts() {
  const response = await fetch("http://localhost:5050/admin/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  const resData = await response.json();

  if (!response.ok) {
    const error = new Error(resData.message || "Could not fetch products.");
    error.status = response.status || 500;
    throw error;
  }

  return resData.products;
}

export async function loader() {
  return {
    products: loadAdminProducts(),
  };
}
