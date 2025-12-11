import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddPropertyPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) {
      navigate("/login");
    } else {
      setUser(stored);
    }
    setIsChecking(false);
  }, [navigate]);

  const [formData, setFormData] = useState({
    title: "",
    type: "Apartment",
    description: "",
    price: "",
    location: {
      address: "",
      city: "",
      state: "",
    },
    squareFeet: "",
    yearBuilt: "",
    bedrooms: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const token = user?.token || user?.user?.token;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("location.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === "price" || name === "squareFeet" || name === "yearBuilt" || name === "bedrooms" ? Number(value) : value,
      });
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!token) {
      setError("You must be logged in to add a property");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/login"), 2000);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(text || "Failed to create property");
      }

      setSuccess(true);
      setFormData({
        title: "",
        type: "Apartment",
        description: "",
        price: "",
        location: {
          address: "",
          city: "",
          state: "",
        },
        squareFeet: "",
        yearBuilt: "",
        bedrooms: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.message || "Error creating property");
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) {
    return <div className="create"><p>Checking authentication...</p></div>;
  }

  if (!user) {
    return <div className="create"><p>Redirecting to login...</p></div>;
  }

  return (
    <div className="create">
      <h2>Add a New Property</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Property added successfully! Redirecting...</div>}
      <form onSubmit={submitForm}>
        <label>Property Title:</label>
        <input
          type="text"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Beautiful Downtown Apartment"
        />

        <label>Property Type:</label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Commercial">Commercial</option>
          <option value="Condo">Condo</option>
          <option value="Townhouse">Townhouse</option>
        </select>

        <label>Description:</label>
        <textarea
          name="description"
          required
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the property..."
        ></textarea>

        <label>Price:</label>
        <input
          type="number"
          name="price"
          required
          value={formData.price}
          onChange={handleChange}
          placeholder="e.g., 500000"
        />

        <label>Street Address:</label>
        <input
          type="text"
          name="location.address"
          required
          value={formData.location.address}
          onChange={handleChange}
          placeholder="e.g., 123 Main Street"
        />

        <label>City:</label>
        <input
          type="text"
          name="location.city"
          required
          value={formData.location.city}
          onChange={handleChange}
          placeholder="e.g., New York"
        />

        <label>State:</label>
        <input
          type="text"
          name="location.state"
          required
          value={formData.location.state}
          onChange={handleChange}
          placeholder="e.g., NY"
        />

        <label>Square Feet:</label>
        <input
          type="number"
          name="squareFeet"
          required
          value={formData.squareFeet}
          onChange={handleChange}
          placeholder="e.g., 2500"
        />

        <label>Year Built:</label>
        <input
          type="number"
          name="yearBuilt"
          required
          value={formData.yearBuilt}
          onChange={handleChange}
          placeholder="e.g., 2015"
        />

        <label>Number of Bedrooms:</label>
        <input
          type="number"
          name="bedrooms"
          required
          value={formData.bedrooms}
          onChange={handleChange}
          placeholder="e.g., 3"
        />

        <button disabled={loading}>
          {loading ? "Adding..." : "Add Property"}
        </button>
      </form>
    </div>
  );
};

export default AddPropertyPage;