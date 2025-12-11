import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditPropertyPage = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) {
      navigate("/login");
    } else {
      setUser(stored);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/properties/${propertyId}`);
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || "Failed to load property");
        }
        const data = await res.json();
        setFormData({
          title: data.title || "",
          type: data.type || "Apartment",
          description: data.description || "",
          price: data.price ?? "",
          location: {
            address: data.location?.address || "",
            city: data.location?.city || "",
            state: data.location?.state || "",
          },
          squareFeet: data.squareFeet ?? "",
          yearBuilt: data.yearBuilt ?? "",
          bedrooms: data.bedrooms ?? "",
        });
      } catch (err) {
        setError(err.message || "Error loading property");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("location.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "price" || name === "squareFeet" || name === "yearBuilt" || name === "bedrooms" ? Number(value) : value,
      }));
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!formData) return;

    const token = user?.token || user?.user?.token;

    if (!token) {
      setError("You must be logged in to edit properties");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/login"), 2000);
        setSaving(false);
        return;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to update property");
      }

      setSuccess(true);
      setTimeout(() => navigate(`/property/${propertyId}`), 1200);
    } catch (err) {
      setError(err.message || "Error updating property");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="content">Loading property...</div>;
  if (error && !user) return <div className="content">Redirecting to login...</div>;
  if (error) return <div className="content error">Error: {error}</div>;
  if (!formData) return <div className="content">Property not found</div>;

  return (
    <div className="create">
      <h2>Edit Property</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Property updated! Redirecting...</div>}

      <form onSubmit={submitForm}>
        <label>Property Title:</label>
        <input
          type="text"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
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
        ></textarea>

        <label>Price:</label>
        <input
          type="number"
          name="price"
          required
          value={formData.price}
          onChange={handleChange}
        />

        <label>Street Address:</label>
        <input
          type="text"
          name="location.address"
          required
          value={formData.location.address}
          onChange={handleChange}
        />

        <label>City:</label>
        <input
          type="text"
          name="location.city"
          required
          value={formData.location.city}
          onChange={handleChange}
        />

        <label>State:</label>
        <input
          type="text"
          name="location.state"
          required
          value={formData.location.state}
          onChange={handleChange}
        />

        <label>Square Feet:</label>
        <input
          type="number"
          name="squareFeet"
          required
          value={formData.squareFeet}
          onChange={handleChange}
        />

        <label>Year Built:</label>
        <input
          type="number"
          name="yearBuilt"
          required
          value={formData.yearBuilt}
          onChange={handleChange}
        />

        <label>Number of Bedrooms:</label>
        <input
          type="number"
          name="bedrooms"
          required
          value={formData.bedrooms}
          onChange={handleChange}
        />

        <button disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
      </form>
    </div>
  );
};

export default EditPropertyPage;