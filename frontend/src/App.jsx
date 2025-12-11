import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages & components
import Home from "./pages/HomePage";
import AddPropertyPage from "./pages/AddPropertyPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import EditPropertyPage from "./pages/EditPropertyPage";
import Navbar from "./components/Navbar";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-property" element={<AddPropertyPage />} />
            <Route path="/property/:propertyId" element={<PropertyDetailPage />} />
            <Route path="/property/:propertyId/edit" element={<EditPropertyPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;