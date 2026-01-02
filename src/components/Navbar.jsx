import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav>
      <button onClick={() => navigate("/profile")}>Profile</button>
      <button onClick={() => navigate("/categories")}>Categories</button>
      <button onClick={() => navigate("/products")}>Products</button>
      <button onClick={() => navigate("/login")}>Logout</button>
    </nav>
  );
}

export default Navbar;
