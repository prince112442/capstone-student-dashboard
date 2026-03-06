// =============================
// Campus Market - Clean Version
// =============================

const { useState, useEffect } = React;

/* ================= NAVBAR ================= */
const Navbar = ({ setView }) => (
    <nav>
        <h1>🎓 Campus Market</h1>
        <ul>
            <li><a onClick={() => setView('home')}>Home</a></li>
            <li><a onClick={() => setView('marketplace')}>Marketplace</a></li>
            <li><a onClick={() => setView('dashboard')}>My Dashboard</a></li>
            <li>
                <a
                    onClick={() => setView('add-product')}
                    style={{ color: "#e67e22" }}
                >
                    + Sell Item
                </a>
            </li>
        </ul>
    </nav>
);

/* ================= HOME ================= */
const Home = ({ setView }) => (
    <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
        <h1>Buy & Sell on Campus</h1>
        <p>
            Trade textbooks, electronics, fashion & services with students.
        </p>

        <button
            onClick={() => setView("marketplace")}
            style={{ marginTop: "2rem", maxWidth: "200px" }}
        >
            Browse Products
        </button>
    </div>
);

/* ================= ADD PRODUCT ================= */
const AddProduct = ({ onAddProduct, setView }) => {
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        category: "Electronics",
        contact: "",
        description: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title || !formData.price) {
            alert("Title and Price are required!");
            return;
        }

        const newProduct = {
            id: Date.now(),
            ...formData,
            price: parseFloat(formData.price),
            image: "https://via.placeholder.com/300"
        };

        onAddProduct(newProduct);
        setView("marketplace");
    };

    return (
        <div className="form-card">
            <h2>Sell an Item</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Product Title"
                    onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                    }
                />

                <input
                    type="number"
                    placeholder="Price (GHS)"
                    onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                    }
                />

                <select
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            category: e.target.value
                        })
                    }
                >
                    <option>Electronics</option>
                    <option>Books</option>
                    <option>Fashion</option>
                    <option>Food</option>
                    <option>Services</option>
                </select>

                <input
                    type="text"
                    placeholder="Contact Info"
                    onChange={(e) =>
                        setFormData({ ...formData, contact: e.target.value })
                    }
                />

                <textarea
                    placeholder="Product Description"
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            description: e.target.value
                        })
                    }
                />

                <button type="submit">Post Product</button>
            </form>
        </div>
    );
};

/* ================= MARKETPLACE ================= */
const Marketplace = ({ products, onDelete }) => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const filtered = products.filter((p) => {
        const matchSearch = p.title
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchCategory =
            filter === "All" || p.category === filter;

        return matchSearch && matchCategory;
    });

    return (
        <div className="container">
            <div className="filters">
                <input
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select onChange={(e) => setFilter(e.target.value)}>
                    <option>All</option>
                    <option>Electronics</option>
                    <option>Books</option>
                    <option>Fashion</option>
                </select>
            </div>

            <div className="product-grid">
                {filtered.map((product) => (
                    <div key={product.id} className="product-card">
                        <img
                            src={product.image}
                            alt={product.title}
                            style={{ width: "100%" }}
                        />

                        <h3>{product.title}</h3>
                        <p>₵ {product.price.toFixed(2)}</p>
                        <p>{product.description}</p>
                        <p>📞 {product.contact}</p>

                        <button className="contact-btn">
                            Contact Seller
                        </button>

                        {onDelete && (
                            <button
                                className="delete-btn"
                                onClick={() =>
                                    onDelete(product.id)
                                }
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ))}

                {filtered.length === 0 && (
                    <p>No products found.</p>
                )}
            </div>
        </div>
    );
};

/* ================= DASHBOARD ================= */
const Dashboard = ({ products, onDelete }) => (
    <div className="container">
        <h2>My Dashboard</h2>
        <Marketplace
            products={products}
            onDelete={onDelete}
        />
    </div>
);

/* ================= MAIN APP ================= */
const App = () => {
    const [view, setView] = useState("home");
    const [products, setProducts] = useState([]);

    // Load products
    useEffect(() => {
        const stored =
            JSON.parse(
                localStorage.getItem("campusProducts")
            ) || [];

        setProducts(stored);
    }, []);

    // Save products
    useEffect(() => {
        localStorage.setItem(
            "campusProducts",
            JSON.stringify(products)
        );
    }, [products]);

    const handleAdd = (product) => {
        setProducts([...products, product]);
        alert("Product added!");
    };

    const handleDelete = (id) => {
        if (confirm("Delete this product?")) {
            setProducts(
                products.filter((p) => p.id !== id)
            );
        }
    };

    return (
        <div>
            <Navbar setView={setView} />

            {view === "home" && <Home setView={setView} />}
            {view === "marketplace" && (
                <Marketplace products={products} />
            )}
            {view === "add-product" && (
                <AddProduct
                    onAddProduct={handleAdd}
                    setView={setView}
                />
            )}
            {view === "dashboard" && (
                <Dashboard
                    products={products}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

/* ================= SAFE ROOT RENDER ================= */
window.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("root");

    if (container) {
        const root =
            ReactDOM.createRoot(container);

        root.render(<App />);
    }
});