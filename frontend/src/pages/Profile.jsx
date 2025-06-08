import { useState, useEffect } from "react";
import { useLoaderData, useLocation } from "react-router-dom";
import NavigationBar from "../components/navigation/NavigationBar.jsx";
import Sidebar from "../components/navigation/Sidebar.jsx";
import classes from "./ProfilePage.module.css";

function ProfilePage() {
  const [sidebarIsVisible, setSidebarIsVisible] = useState(false);
  const data = useLoaderData();
  const products = data?.products || [];

  const toggleSidebar = () => {
    setSidebarIsVisible((prev) => !prev);
  };

  const location = useLocation();
  const path = location.pathname;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5050/auth/profile", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch profile.");
        }
        setFormData({
          name: data.user?.name || "",
          email: data.user?.email || "",
          street: data.user?.address?.street || "",
          city: data.user?.address?.city || "",
          state: data.user?.address?.state || "",
          zipCode: data.user?.address?.zipCode || "",
          country: data.user?.address?.country || "India",
        });
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.email.includes("@"))
      errors.email = "Valid email is required.";
    if (!formData.street.trim()) errors.street = "Street address is required.";
    if (!formData.city.trim()) errors.city = "City is required.";
    if (!formData.state.trim()) errors.state = "State is required.";
    if (!formData.zipCode.match(/^\d+$/))
      errors.zipCode = "Zip code must be a number.";
    if (!formData.zipCode.trim()) errors.zipCode = "Zip code is required.";
    if (!formData.country.trim()) errors.country = "Country is required.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setValidationErrors(formErrors);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("http://localhost:5050/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <NavigationBar path={path} onClickVisible={toggleSidebar} />
      {sidebarIsVisible && <Sidebar />}
      <main style={{ paddingTop: "80px" }}>
      <div className={classes.profileContainer}>
        <h2>Edit Profile</h2>
        {loading && <p>Loading...</p>}
        {error && <p className={classes.error}>{error}</p>}
        {success && <p className={classes.success}>{success}</p>}

        <form onSubmit={handleSubmit} className={classes.profileForm}>
          <div className={classes.formGroup}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {validationErrors.name && (
              <p className={classes.errorMessage}>{validationErrors.name}</p>
            )}
          </div>

          <div className={classes.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {validationErrors.email && (
              <p className={classes.errorMessage}>{validationErrors.email}</p>
            )}
          </div>

          <div className={classes.formGroup}>
            <label>Street</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
            />
            {validationErrors.street && (
              <p className={classes.errorMessage}>{validationErrors.street}</p>
            )}
          </div>

          <div className={classes.formGroup}>
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
            {validationErrors.city && (
              <p className={classes.errorMessage}>{validationErrors.city}</p>
            )}
          </div>

          <div className={classes.formGroup}>
            <label>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
            {validationErrors.state && (
              <p className={classes.errorMessage}>{validationErrors.state}</p>
            )}
          </div>

          <div className={classes.formGroup}>
            <label>Zip Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
            />
            {validationErrors.zipCode && (
              <p className={classes.errorMessage}>{validationErrors.zipCode}</p>
            )}
          </div>

          <div className={classes.formGroup}>
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
            {validationErrors.country && (
              <p className={classes.errorMessage}>{validationErrors.country}</p>
            )}
          </div>

          <button
            type="submit"
            className={classes.submitButton}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
      </main>
    </>
  );
}

export default ProfilePage;
