import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

function Category() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState(""); // success | error

  const API = "http://localhost:5050/categories";

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(API);
      setCategories(await res.json());
    };
    fetchCategories();
  }, []);

  const reloadCategories = async () => {
    const res = await fetch(API);
    setCategories(await res.json());
  };

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMsgType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const saveCategory = async () => {
    if (!name.trim()) {
      showMessage("Category name required", "error");
      return;
    }

    try {
      if (isEditing) {
        await fetch(`${API}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description }),
        });
        showMessage("Category updated successfully");
      } else {
        await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description }),
        });
        showMessage("Category added successfully");
      }

      resetForm();
      reloadCategories();
    } catch {
      showMessage("Operation failed", "error");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      showMessage("Category deleted successfully");
      reloadCategories();
    } catch {
      showMessage("Delete failed", "error");
    }
  };

  const editCategory = (cat) => {
    setIsEditing(true);
    setEditId(cat.id);
    setName(cat.name);
    setDescription(cat.description);
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

      {/* MESSAGE */}
      {message && (
        <div className={`msg ${msgType}`}>{message}</div>
      )}

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

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
              <td>
                <FaEdit onClick={() => editCategory(cat)} />
                <FaTrash
                  onClick={() => deleteCategory(cat.id)}
                  style={{ marginLeft: 10, cursor: "pointer" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Category;
