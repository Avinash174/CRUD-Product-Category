import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CAT_API = "http://localhost:5050/categories";

function Category() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(CAT_API);
      setCategories(await res.json());
    };
    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (!name.trim()) {
      alert("Category name required");
      return;
    }

    await fetch(CAT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    setName("");
    setDescription("");

    const res = await fetch(CAT_API);
    setCategories(await res.json());
  };

  return (
    <div className="page">
      {/* ADD CATEGORY */}
      <div className="card">
        <div className="card-title">Add Category</div>
        <p className="muted">Create and manage product categories</p>

        <div className="form-grid single">
          <div className="form-control">
            <label>Category Name</label>
            <input
              placeholder="e.g. Electronics"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label>Description</label>
            <input
              placeholder="Short description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" onClick={addCategory}>
            Add Category
          </button>
        </div>
      </div>

      {/* CATEGORY LIST */}
      <div className="card">
        <div className="card-title">Categories</div>

        {categories.length === 0 ? (
          <p className="muted">No categories added yet</p>
        ) : (
          <div className="category-grid">
            {categories.map((c) => (
              <div className="category-card" key={c.id}>
                <h3>{c.name}</h3>
                <p>{c.description || "No description"}</p>

                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    navigate(`/products?category=${c.id}&name=${c.name}`)
                  }
                >
                  View Products
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Category;
