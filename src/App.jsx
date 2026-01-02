import Category from "./components/category.jsx";
import Product from "./components/product.jsx";

function App() {
  return (
    <div className="container">
      <h1>Product & Category CRUD App</h1>
      <Category />
      <hr />
      <Product />
    </div>
  );
}

export default App;
