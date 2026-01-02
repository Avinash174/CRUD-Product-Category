import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [productCode, setProductCode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // 🔔 Message state
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState(""); // success | error

  const CAT_API = "http://localhost:5050/categories";
  const PROD_API = "http://localhost:5050/products";

  // 🔔 Show message helper (✅ MUST BE ABOVE useEffect)
  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMsgType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  // ✅ Load categories & products (ESLint-safe)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const c = await fetch(CAT_API);
        setCategories(await c.json());

        const p = await fetch(PROD_API);
        setProducts(await p.json());
      } catch (err) {
        console.error(err);
        showMessage("Failed to load data", "error");
      }
    };

    fetchData();
  }, []);

  // 🔁 Reload only products
  const reloadProducts = async () => {
    const res = await fetch(PROD_API);
    setProducts(await res.json());
  };

  // ➕ / ✏️ ADD or UPDATE
  const saveProduct = async () => {
    if (!name || !categoryId) {
      showMessage("Name and Category are required", "error");
      return;
    }

    const payload = {
      name,
      description,
      product_code: productCode,
      quantity,
      category_id: categoryId,
    };

    try {
      if (isEditing) {
        await fetch(`${PROD_API}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        showMessage("Product updated successfully");
      } else {
        await fetch(PROD_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        showMessage("Product added successfully");
      }

      resetForm();
      reloadProducts();
    } catch {
      showMessage("Operation failed", "error");
    }
  };

  // ✏️ EDIT
  const editProduct = (p) => {
    setIsEditing(true);
    setEditId(p.id);
    setName(p.name);
    setDescription(p.description);
    setProductCode(p.product_code);
    setQuantity(p.quantity);
    setCategoryId(p.category_id);
  };

  // 🗑 DELETE
  const deleteProduct = async (id) => {
    try {
      await fetch(`${PROD_API}/${id}`, { method: "DELETE" });
      showMessage("Product deleted successfully");
      reloadProducts();
    } catch {
      showMessage("Delete failed", "error");
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setName("");
    setDescription("");
    setProductCode("");
    setQuantity("");
    setCategoryId("");
  };

  return (
    <div className="container">
      <h2>{isEditing ? "Edit Product" : "Add Product"}</h2>

      {/* 🔔 MESSAGE */}
      {message && <div className={`msg ${msgType}`}>{message}</div>}

      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input placeholder="Product Code" value={productCode} onChange={(e) => setProductCode(e.target.value)} />
      <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <button onClick={saveProduct}>
        {isEditing ? "Update" : "Add"}
      </button>

      {isEditing && (
        <button onClick={resetForm} style={{ marginLeft: 10 }}>
          Cancel
        </button>
      )}

      <hr />

      <h2>Product List</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Qty</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.product_code}</td>
              <td>{p.quantity}</td>
              <td>{p.category_name}</td>
              <td style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <button onClick={() => editProduct(p)} title="Edit">
                  <FaEdit />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteProduct(p.id)}
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Product;
