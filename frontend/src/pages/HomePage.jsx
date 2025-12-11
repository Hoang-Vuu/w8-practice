import { useEffect, useState } from "react";
import PropertyListings from "../components/PropertyListings";

const HomePage = () => {
  const [properties, setProperties] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("/api/properties");
        if (!res.ok) throw new Error("could not fetch the data for that resource");
        const data = await res.json();
        setProperties(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsPending(false);
      }
    };

    fetchProperties();
  }, []);

  const handlePropertyDeleted = (propertyId) => {
    setProperties((prev) => prev?.filter((p) => (p.id || p._id) !== propertyId));
  };

  return (
    <div className="home">
      {error && <div>{error}</div>}
      {isPending && <div>Loading...</div>}
      {properties && (
        <PropertyListings
          properties={properties}
          onPropertyDeleted={handlePropertyDeleted}
        />
      )}
    </div>
  );
};

export default HomePage;
