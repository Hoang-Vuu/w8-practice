import { useEffect, useState } from "react";
import PropertyListings from "../components/PropertyListings";

const PropertyHome = () => {
  const [properties, setProperties] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("/api/properties");
        if (!res.ok) {
          throw new Error("Could not fetch the data for that resource");
        }
        const data = await res.json();
        setIsPending(false);
        setProperties(data);
        setError(null);
      } catch (err) {
        setIsPending(false);
        setError(err.message);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="home">
      {error && <div>{error}</div>}
      {isPending && <div>Loading...</div>}
      {properties && <PropertyListings properties={properties} />}
    </div>
  );
};

export default PropertyHome;
