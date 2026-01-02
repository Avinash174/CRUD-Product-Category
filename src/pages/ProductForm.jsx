import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const PROD_API = "http://localhost:5050/products";
const CAT_API = "http://localhost:5050/categories";

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const preCategory = params.get("category");

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categoryId, setCategoryId] = useState(preCategory || "");

  useEffect(() => {
    const loadData = async () => {
      const c = await fetch(CAT_API);
      setCategories(await c.json());

      if (id) {
        const p = await fetch(`${PROD_API}/${id}`);
        const data = await p.json();
        setName(data.name);
        setProductCode(data.product_code);
        setQuantity(data.quantity);
        setCategoryId(data.category_id);
      }
    };

    loadData();
  }, [id]);

  const saveProduct = async () => {
    if (!name || !categoryId) {
      alert("Product name and category required");
      return;
    }

    const payload = {
      name,
      product_code: productCode,
      quantity,
      category_id: categoryId,
    };

    await fetch(id ? `${PROD_API}/${id}` : PROD_API, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    navigate(`/products?category=${categoryId}`);
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-title">
          {id ? "Edit Product" : "Add Product"}
        </div>
        <p className="muted">Fill product details below</p>

        <div className="form-grid">
          <div className="form-control">
            <label>Product Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="form-control">
            <label>Product Code</label>
            <input
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label>Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary" onClick={saveProduct}>
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;
