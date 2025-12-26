import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

function Category() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const API = "http://localhost:5050/categories";

  // ✅ Safe useEffect
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(API);
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const reloadCategories = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setCategories(data);
  };

  const saveCategory = async () => {
    if (!name.trim()) return alert("Name required");

    const payload = { name, description };

    if (isEditing) {
      await fetch(`${API}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    resetForm();
    reloadCategories();
  };

  const editCategory = (cat) => {
    setIsEditing(true);
    setEditId(cat.id);
    setName(cat.name);
    setDescription(cat.description);
  };

  const deleteCategory = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    reloadCategories();
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setName("");
    setDescription("");
  };

  return (
    <div className="container">
      <h2>{isEditing ? "Edit Category" : "Add Category"}</h2>

      <input
        placeholder="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={saveCategory}>
        {isEditing ? "Update" : "Add"}
      </button>

      {isEditing && (
        <button onClick={resetForm} style={{ marginLeft: 10 }}>
          Cancel
        </button>
      )}

      <hr />

      <h2>Category List</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
              <td style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <button onClick={() => editCategory(cat)} title="Edit">
                  <FaEdit />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteCategory(cat.id)}
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

export default Category;
