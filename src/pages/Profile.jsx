import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CAT_API = "http://localhost:5050/categories";
const PROD_API = "http://localhost:5050/products";

function Profile() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const c = await fetch(CAT_API);
      const p = await fetch(PROD_API);

      setCategories(await c.json());
      setProducts(await p.json());
    };

    loadData();
  }, []);

  const logout = () => {
    // later you can clear token/localStorage here
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Profile / Dashboard</h2>

      {/* SUMMARY */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <div className="category-card">
          <h3>Total Categories</h3>
          <p>{categories.length}</p>
        </div>

        <div className="category-card">
          <h3>Total Products</h3>
          <p>{products.length}</p>
        </div>
      </div>

      {/* CATEGORIES */}
      <h3>Categories Added</h3>
      {categories.length === 0 ? (
        <p>No categories added</p>
      ) : (
        <ul>
          {categories.map((c) => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      )}

      <hr />

      {/* PRODUCTS */}
      <h3>Products Added</h3>
      {products.length === 0 ? (
        <p>No products added</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.product_code}</td>
                <td>{p.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br />

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Profile;
