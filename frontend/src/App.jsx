import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PropertyHome from "./pages/PropertyHome";
import AddPropertyPage from "./pages/AddPropertyPage";
import PropertyPage from "./pages/PropertyPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<PropertyHome />} />
            <Route path="/properties/add-property" element={<AddPropertyPage />} />
            <Route path="/properties/:id" element={<PropertyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
