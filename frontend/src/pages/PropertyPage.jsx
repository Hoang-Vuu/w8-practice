import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const PropertyPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deleteProperty = async (id) => {
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete property");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const onDeleteClick = (propertyId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this property?");
    if (!confirmDelete) return;
    deleteProperty(propertyId);
    navigate("/");
  };

  return (
    <div className="property-preview">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h2>{property.title}</h2>
          <p>Type: {property.type}</p>
          <p>Description: {property.description}</p>
          <p>Price: ${property.price.toLocaleString()}</p>
          <p>Location: {property.location.address}, {property.location.city}, {property.location.state}</p>
          <p>Square Feet: {property.squareFeet}</p>
          <p>Year Built: {property.yearBuilt}</p>
          <p>Bedrooms: {property.bedrooms}</p>
          <button onClick={() => onDeleteClick(property.id)}>Delete</button>
        </>
      )}
    </div>
  );
};

export default PropertyPage;
