import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddPropertyPage = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Apartment");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [squareFeet, setSquareFeet] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  const navigate = useNavigate();

  const addProperty = async (newProperty) => {
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProperty),
      });
      if (!res.ok) throw new Error("Failed to add property");
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    const newProperty = {
      title,
      type,
      description,
      price: Number(price),
      location: { address, city, state },
      squareFeet: Number(squareFeet),
      yearBuilt: Number(yearBuilt),
      bedrooms: Number(bedrooms),
    };
    addProperty(newProperty);
    navigate("/");
  };

  return (
    <div className="create">
      <h2>Add a New Property</h2>
      <form onSubmit={submitForm}>
        <label>Title:</label>
        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Commercial">Commercial</option>
        </select>

        <label>Description:</label>
        <textarea required value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Price:</label>
        <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} />

        <label>Address:</label>
        <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} />

        <label>City:</label>
        <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} />

        <label>State:</label>
        <input type="text" required value={state} onChange={(e) => setState(e.target.value)} />

        <label>Square Feet:</label>
        <input type="number" required value={squareFeet} onChange={(e) => setSquareFeet(e.target.value)} />

        <label>Year Built:</label>
        <input type="number" required value={yearBuilt} onChange={(e) => setYearBuilt(e.target.value)} />

        <label>Bedrooms:</label>
        <input type="number" required value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />

        <button>Add Property</button>
      </form>
    </div>
  );
};

export default AddPropertyPage;
