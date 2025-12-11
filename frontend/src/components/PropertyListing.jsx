const PropertyListing = ({ property }) => {
  return (
    <div className="property-preview">
      <h2>{property.title}</h2>
      <p>Type: {property.type}</p>
      <p>Description: {property.description}</p>
      <p>Price: ${property.price.toLocaleString()}</p>
      <p>Location: {property.location.address}, {property.location.city}, {property.location.state}</p>
      <p>Square Feet: {property.squareFeet} sqft</p>
      <p>Year Built: {property.yearBuilt}</p>
      <p>Bedrooms: {property.bedrooms}</p>
    </div>
  );
};

export default PropertyListing;
