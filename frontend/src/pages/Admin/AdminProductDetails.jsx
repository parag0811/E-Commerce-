import { Suspense } from "react";
import AdminSingleProductDetails from "../../components/admin/SingleProductAdmin.jsx";
import { Await, useLoaderData } from "react-router-dom";
import Spinner from "../../spinner/spinner.jsx";

export default function AdminProductDetails() {
  const data = useLoaderData();
  const product = data?.product;

  return (
    <Suspense fallback={<Spinner />}>
      <Await resolve={product}>
        {(loadedAdminProductDetails) => (
          <AdminSingleProductDetails product={loadedAdminProductDetails} />
        )}
      </Await>
    </Suspense>
  );
}

async function loadAdminProductDetails({ params }) {
  const { productId } = params;

  const response = await fetch(
    `http://localhost:5050/admin/products/${productId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  const productData = await response.json();

  if (!response.ok) {
    const error = new Error(productData.message || "Could not fetch detail.");
    error.status = response.status || 500;
    throw error;
  }

  return productData.product;
}

export async function loader({ params }) {
  return {
    product: loadAdminProductDetails({ params }),
  };
}
