import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Property Listings</h1>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/properties/add-property">Add Property</Link>
      </div>
    </nav>
  );
}

export default Navbar;
