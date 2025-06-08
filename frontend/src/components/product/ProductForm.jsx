import { useEffect, useState } from "react";
import classes from "./ProductForm.module.css";
import { Form, useActionData, useLoaderData } from "react-router-dom";
import { redirect } from "react-router-dom";

export default function ProductForm() {
  const actionData = useActionData();
  const productData = useLoaderData();

  const isEditMode = !!productData;

  const sizeOptions = {
    tshirt: ["S", "M", "L", "XL"],
    shoes: ["UK7", "UK8", "UK9", "UK10"],
    jeans: ["28", "30", "32", "34", "36", "38"],
    cargo: ["28", "30", "32", "34", "36", "38"],
    shirt: ["S", "M", "L", "XL"],
  };

  const [formData, setFormData] = useState({
    category: "",
    size: [],
  });

  const [genderInput, setGenderInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setFormData((prev) => ({
      ...prev,
      category: selectedCategory,
      size: sizeOptions[selectedCategory] || [],
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  useEffect(() => {
    if (isEditMode && productData?.category) {
      setFormData({
        category: productData.category,
        size: sizeOptions[productData.category] || [],
      });
    }
  }, [isEditMode, productData]);

  return (
    <div className={classes.container}>
      <h2 className={classes.heading}>
        {isEditMode ? "Edit Product" : "Add New Product"}
      </h2>
      <Form
        method="post"
        className={classes.form}
        encType="multipart/form-data"
      >
        {/* Title */}
        <label className={classes.label}>Title</label>
        <input
          type="text"
          name="title"
          placeholder="Product title"
          defaultValue={isEditMode ? productData?.title : ""}
          required
          className={classes.input}
        />
        {actionData?.errors?.map((err, index) =>
          err.path === "title" ? (
            <p key={index} className={classes.fieldError}>
              {err.msg}
            </p>
          ) : null
        )}

        {/* Description */}
        <label className={classes.label}>Description</label>
        <textarea
          name="description"
          placeholder="Product description"
          required
          className={classes.textarea}
          defaultValue={isEditMode ? productData?.description : ""}
        ></textarea>
        {actionData?.errors?.map((err, index) =>
          err.path === "description" ? (
            <p key={index} className={classes.fieldError}>
              {err.msg}
            </p>
          ) : null
        )}

        {/* Price & Stock */}
        <div className={classes.row}>
          <div className={classes.column}>
            <label className={classes.label}>Price</label>
            <input
              type="number"
              name="price"
              placeholder="₹"
              defaultValue={isEditMode ? productData?.price : ""}
              required
              min="0"
              inputMode="numeric"
              pattern="[0-9]*"
              className={classes.input}
            />
          </div>
          <div className={classes.column}>
            <label className={classes.label}>Stock</label>
            <input
              type="number"
              name="stock"
              placeholder="Qty"
              defaultValue={isEditMode ? productData?.stock : ""}
              required
              min="0"
              inputMode="numeric"
              pattern="[0-9]*"
              className={classes.input}
            />
          </div>
        </div>
        {actionData?.errors?.map((err, index) =>
          err.path === "price" ? (
            <p key={index} className={classes.fieldError}>
              {err.msg}
            </p>
          ) : null
        )}
        {actionData?.errors?.map((err, index) =>
          err.path === "stock" ? (
            <p key={index} className={classes.fieldError}>
              {err.msg}
            </p>
          ) : null
        )}
        {/* Category */}
        <label className={classes.label}>Category</label>
        <select
          name="category"
          defaultValue={isEditMode ? productData?.category : ""}
          required
          className={classes.input}
          onChange={handleCategoryChange}
        >
          <option value="">Select Category</option>
          {Object.keys(sizeOptions).map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
        {actionData?.errors?.map((err, index) =>
          err.path === "category" ? (
            <p key={index} className={classes.fieldError}>
              {err.msg}
            </p>
          ) : null
        )}

        {/* Brand */}
        <label className={classes.label}>Brand</label>
        <input
          type="text"
          name="brand"
          placeholder="Nike, Levi's..."
          defaultValue={isEditMode ? productData?.brand : ""}
          required
          className={classes.input}
        />
        {actionData?.errors?.map((err, index) =>
          err.path === "brand" ? (
            <p key={index} className={classes.fieldError}>
              {err.msg}
            </p>
          ) : null
        )}

        {/* Size */}
        {/* Sizes as checkboxes */}
        {formData.category && formData.size.length > 0 && (
          <>
            <label className={classes.label}>Size</label>
            <div className={classes.checkboxGroup}>
              {formData.size.map((size) => (
                <label key={size} className={classes.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="size"
                    value={size}
                    defaultChecked={
                      isEditMode ? productData?.size?.includes(size) : false
                    }
                  />
                  {size}
                </label>
              ))}
            </div>
          </>
        )}
        {actionData?.errors?.map((err, index) =>
          err.path === "size" ? (
            <p key={index} className={classes.fieldError}>
              {err.msg}
            </p>
          ) : null
        )}

        {/* Color */}
        <label className={classes.label}>Gender</label>
        <input
          type="text"
          name="gender"
          defaultValue={isEditMode ? productData?.gender : ""}
          placeholder="Men, Women, Kids, Unisex"
          onChange={(e) => setGenderInput(e.target.value)}
          className={classes.input}
        />
        {actionData?.errors?.map((err, index) =>
          err.path === "gender" ? (
            <p key={index} className={classes.fieldError}>
              {err.msg}
            </p>
          ) : null
        )}

        {/* Image Upload */}
        <label className={classes.label}>Product Image</label>
        <input
          name="images"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={classes.input}
        />
        {actionData?.errors?.map((err, index) =>
          err.path === "images" ? (
            <p key={index} className={classes.fieldError}>
              {err.msg}
            </p>
          ) : null
        )}
        {isEditMode && !imagePreview && (
          <div className={classes.imagePreview}>
            <img src={productData.images} alt="Existing" />
          </div>
        )}

        {/* Submit */}
        <button type="submit" className={classes.button}>
          {isEditMode ? "Update Product" : "Add Product"}
        </button>

        {actionData?.error ? (
          <p className={classes.fieldError}>{actionData.error}</p>
        ) : null}
      </Form>
    </div>
  );
}

async function loadAdminEditProduct({ params }) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(
    `http://localhost:5050/admin/products/${params.productId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Could not load data.");
    error.status = response.status || 500;
    throw error;
  }

  return data.product;
}

export async function action({ request, params }) {
  const data = await request.formData();
  const token = sessionStorage.getItem("token");

  const isEditMode = !!params.productId;

  const url = isEditMode
    ? `http://localhost:5050/admin/editProduct/${params.productId}`
    : `http://localhost:5050/admin/add-Product`;

  const productData = {
    title: data.get("title"),
    description: data.get("description"),
    price: parseFloat(data.get("price")),
    stock: parseFloat(data.get("stock")),
    category: data.get("category"),
    brand: data.get("brand"),
    size: data.getAll("size"),
    color: data.get("color"),
    images: data.get("images"),
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  const resData = await response.json();

  if (!response.ok) {
    return {
      error:
        resData.message ||
        "Failed creating the product. Please login or try again later.",
      errors: resData.data || [],
    };
  }

  return redirect("/all-products");
}

export async function loader({ params }) {
  return await loadAdminEditProduct({ params });
}
