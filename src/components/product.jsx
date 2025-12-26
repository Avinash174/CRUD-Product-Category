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

  const CAT_API = "http://localhost:5050/categories";
  const PROD_API = "http://localhost:5050/products";

  // LOAD categories + products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetch(CAT_API);
        const catData = await catRes.json();
        console.log("Categories:", catData);
        setCategories(catData);

        const prodRes = await fetch(PROD_API);
        const prodData = await prodRes.json();
        setProducts(prodData);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, []);

  const reloadProducts = async () => {
    const res = await fetch(PROD_API);
    setProducts(await res.json());
  };

  const saveProduct = async () => {
    if (!name || !categoryId) {
      alert("Name & Category required");
      return;
    }

    const payload = {
      name,
      description,
      product_code: productCode,
      quantity,
      category_id: categoryId,
    };

    if (isEditing) {
      await fetch(`${PROD_API}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(PROD_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    resetForm();
    reloadProducts();
  };

  const editProduct = (p) => {
    setIsEditing(true);
    setEditId(p.id);
    setName(p.name);
    setDescription(p.description);
    setProductCode(p.product_code);
    setQuantity(p.quantity);
    setCategoryId(p.category_id);
  };

  const deleteProduct = async (id) => {
    await fetch(`${PROD_API}/${id}`, { method: "DELETE" });
    reloadProducts();
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

      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input placeholder="Code" value={productCode} onChange={(e) => setProductCode(e.target.value)} />
      <input type="number" placeholder="Qty" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

      {/* CATEGORY DROPDOWN */}
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <button onClick={saveProduct}>
        {isEditing ? "Update" : "Add"}
      </button>

      {isEditing && <button onClick={resetForm}>Cancel</button>}

      <hr />

      <h2>Product List</h2>
      <table>
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
              <td>
                <FaEdit onClick={() => editProduct(p)} style={{ cursor: "pointer" }} />
                <FaTrash onClick={() => deleteProduct(p.id)} style={{ cursor: "pointer", marginLeft: 10 }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Product;
