import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PROD_API = "http://localhost:5050/products";

function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const categoryId = params.get("category");
  const categoryName = params.get("name");

  useEffect(() => {
    const loadProducts = async () => {
      const url = categoryId
        ? `${PROD_API}?category_id=${categoryId}`
        : PROD_API;

      const res = await fetch(url);
      setProducts(await res.json());
    };

    loadProducts();
  }, [categoryId]);

  return (
    <div className="page">
      <div className="card">
        <div className="card-title">
          Products {categoryName && `- ${categoryName}`}
        </div>

        <button
          className="btn btn-primary"
          onClick={() =>
            navigate(`/products/add${categoryId ? `?category=${categoryId}` : ""}`)
          }
        >
          + Add Product
        </button>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="3" className="muted">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.product_code}</td>
                    <td>{p.quantity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
