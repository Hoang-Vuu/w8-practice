import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PropertyDetailPage = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    setUser(stored);
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/properties/${propertyId}`);
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || "Property not found");
        }
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        setError(err.message || "Error loading property");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId]);

  const token = user?.token || user?.user?.token;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    if (!token) {
      setError("You must be logged in to delete properties");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Delete failed");
      }
      navigate("/");
    } catch (err) {
      setError(err.message || "Error deleting property");
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    navigate(`/property/${propertyId}/edit`);
  };

  if (loading) return <div className="content">Loading...</div>;
  if (error) return <div className="content error-message">Error: {error}</div>;
  if (!property) return <div className="content">Property not found</div>;

  return (
    <div className="property-detail">
      <div className="property-header">
        <h1>{property.title}</h1>
        <button className="btn-back" onClick={() => navigate("/")}>← Back</button>
      </div>

      <div className="property-info">
        <p><strong>Type:</strong> {property.type}</p>
        <p><strong>Price:</strong> ${Number(property.price).toLocaleString()}</p>
        <p><strong>Address:</strong> {property.location?.address}</p>
        <p><strong>City:</strong> {property.location?.city}</p>
        <p><strong>State:</strong> {property.location?.state}</p>
        <p><strong>Square Feet:</strong> {Number(property.squareFeet).toLocaleString()}</p>
        <p><strong>Year Built:</strong> {property.yearBuilt}</p>
        <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
        <p><strong>Description:</strong></p>
        <p className="description">{property.description}</p>
      </div>

      {token && (
        <div className="property-actions detail-actions">
          <button className="btn-secondary" onClick={handleEdit} disabled={isDeleting}>
            Edit Property
          </button>
          <button className="btn-danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Property"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;