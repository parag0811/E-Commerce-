import { Suspense, useState } from "react";
import NavigationBar from "../components/navigation/NavigationBar";
import SingleProduct from "../components/product/SingleProduct";
import { Await, useLoaderData, useLocation } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import Spinner from "../spinner/spinner";

function SingleProductPage() {
  const [sidebarIsVisible, setSidebarIsVisible] = useState(false);
  const data = useLoaderData();
  const product = data?.product;

  const toggleSidebar = () => {
    setSidebarIsVisible((prev) => !prev);
  };

  const location = useLocation();
  const path = window.location.pathname;
  return (
    <>
      <NavigationBar path={path} onClickVisible={toggleSidebar} />
      {sidebarIsVisible && <Sidebar />}
      <Suspense fallback={<Spinner />}>
        <Await resolve={product}>
          {(loadSingleProduct) => <SingleProduct product={loadSingleProduct} />}
        </Await>
      </Suspense>
    </>
  );
}

async function loadSingleProduct({ params }) {
  const { productId } = params;

  const response = await fetch(`http://localhost:5050/products/${productId}`);

  const productData = await response.json();

  if (!response.ok) {
    const error = new Error(productData.message || "Could not fetch cart.");
    error.status = response.status || 500;
    throw error;
  }

  return productData.product;
}

export async function loader({ params }) {
  return {
    product: loadSingleProduct({ params }),
  };
}

export default SingleProductPage;
