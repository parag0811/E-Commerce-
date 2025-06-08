import { Suspense, useState } from "react";
import NavigationBar from "../components/navigation/NavigationBar";
import Products from "../components/product/Products";
import Sidebar from "../components/navigation/Sidebar";
import { Await, useLoaderData, useLocation } from "react-router-dom";
import Spinner from "../spinner/spinner";

function ProductsPage() {
  const [sidebarIsVisible, setSidebarIsVisible] = useState(false);
  const data = useLoaderData();
  const products = data?.products || [];

  const toggleSidebar = () => {
    setSidebarIsVisible((prev) => !prev);
  };

  const location = useLocation();
  const path = window.location.pathname;

  return (
    <>
      <NavigationBar path={path} onClickVisible={toggleSidebar} />
      {sidebarIsVisible && <Sidebar />}
      <main style={{ paddingTop: "80px" }}>
        <Suspense fallback={<Spinner />}>
          <Await resolve={products}>
            {(loadedData) => (
              <Products
                products={loadedData.products}
                totalPages={loadedData.totalPages}
                currentPage={loadedData.currentPage}
              />
            )}
          </Await>
        </Suspense>
      </main>
    </>
  );
}

async function loadProducts({ request }) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const minPrice = url.searchParams.get("minPrice");
  const maxPrice = url.searchParams.get("maxPrice");
  const gender = url.searchParams.get("gender");
  const page = url.searchParams.get("page") || 1;
  const limit = 2;

  const queryParams = new URLSearchParams();

  if (category) queryParams.append("category", category);
  if (minPrice) queryParams.append("minPrice", minPrice);
  if (maxPrice) queryParams.append("maxPrice", maxPrice);
  if (gender) queryParams.append("gender", gender);
  queryParams.append("page", page);
  queryParams.append("limit", limit);

  const endPoint = `http://localhost:5050/products?${queryParams.toString()}`;

  const response = await fetch(endPoint);
  const resData = await response.json();
  if (!response.ok) {
    const error = new Error(resData.message || "Could not fetch products.");
    error.status = response.status || 500;
    throw error;
  }
  return {
    products: resData.products || [],
    totalPages: resData.totalPages || 1,
    currentPage: +page,
  };
}

export async function loader(args) {
  return {
    products: loadProducts(args),
  };
}

export default ProductsPage;
