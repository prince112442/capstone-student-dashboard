const { useState, useEffect } = React;

// --- Components ---

// 1. Navigation
const Navbar = ({ setView, view }) => (
    <nav>
        <h1>🎓 Campus Market</h1>
        <ul>
            <li><a onClick={() => setView('home')}>Home</a></li>
            <li><a onClick={() => setView('marketplace')}>Marketplace</a></li>
            <li><a onClick={() => setView('dashboard')}>My Dashboard</a></li>
            <li><a onClick={() => setView('add-product')} style={{color: '#e67e22'}}>+ Sell Item</a></li>
        </ul>
    </nav>
);

// 2. Landing Page
const Home = ({ setView }) => (
    <div style={{textAlign: 'center', padding: '4rem 1rem'}}>
        <h1>Buy & Sell on Campus</h1>
        <p>The easiest way to trade textbooks, electronics, and more with your peers.</p>
        <button onClick={() => setView('marketplace')} style={{maxWidth: '200px', marginTop: '2rem'}}>Browse Products</button>
    </div>
);

// 3. Add Product Form
const AddProduct = ({ onAddProduct, setView }) => {
    const [formData, setFormData] = useState({ title: '', price: '', category: 'Electronics', contact: '', description: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!formData.title || !formData.price) return alert("Please fill required fields");
        
        const newProduct = {
            id: Date.now(),
            ...formData,
            price: parseFloat(formData.price),
            image: 'https://via.placeholder.com/300?text=Product+Image' // Placeholder
        };
        
        onAddProduct(newProduct);
        setView('marketplace');
    };

    return (
        <div className="form-card">
            <h2>Sell an Item</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Product Title</label>
                    <input type="text" onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. HP Laptop" />
                </div>
                <div className="form-group">
                    <label>Price (GHS ₵)</label>
                    <input type="number" onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="e.g. 1500" />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <select onChange={(e) => setFormData({...formData, category: e.target.value})}>
                        <option>Electronics</option>
                        <option>Books</option>
                        <option>Fashion</option>
                        <option>Food</option>
                        <option>Services</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Contact Info (WhatsApp/Phone)</label>
                    <input type="text" onChange={(e) => setFormData({...formData, contact: e.target.value})} placeholder="024 XXX XXXX" />
                </div>
                <button type="submit">Post Product</button>
            </form>
        </div>
    );
};

// 4. Marketplace (Grid & Search)
const Marketplace = ({ products, onDelete }) => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filter === 'All' || p.category === filter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="container">
            <div className="filters">
                <input 
                    type="text" 
                    className="search-bar" 
                    placeholder="Search for books, laptops..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select onChange={(e) => setFilter(e.target.value)} style={{padding: '0.8rem'}}>
                    <option value="All">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Books">Books</option>
                    <option value="Fashion">Fashion</option>
                </select>
            </div>

            <div className="product-grid">
                {filteredProducts.map(product => (
                    <div key={product.id} className="product-card">
                        <div className="product-img">
                            <img src={product.image} alt={product.title} style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                        </div>
                        <div className="product-info">
                            <span className="category-tag">{product.category}</span>
                            <h3>{product.title}</h3>
                            <div className="price">₵ {product.price.toFixed(2)}</div>
                            <p style={{fontSize: '0.9rem', color: '#666', margin: '10px 0'}}>{product.description}</p>
                            <div style={{marginTop: '10px', fontSize: '0.8rem', fontWeight:'bold'}}>
                                📞 Seller: {product.contact}
                            </div>
                            <button className="contact-btn">Contact Seller</button>
                            {onDelete && <button className="delete-btn" onClick={() => onDelete(product.id)}>Delete</button>}
                        </div>
                    </div>
                ))}
                {filteredProducts.length === 0 && <p>No products found.</p>}
            </div>
        </div>
    );
};

// 5. Dashboard (User's Items)
const Dashboard = ({ products, onDelete }) => {
    // In a real app, we would filter by logged-in user ID. 
    // Here we just show all items for demo purposes or allow deleting.
    return (
        <div className="container">
            <div className="dashboard-header">
                <h2>My Dashboard</h2>
            </div>
            <Marketplace products={products} onDelete={onDelete} />
        </div>
    );
};

// --- Main App Logic ---

const App = () => {
    const [view, setView] = useState('home');
    const [products, setProducts] = useState([]);

    // Load from LocalStorage on startup
    useEffect(() => {
        const storedProducts = JSON.parse(localStorage.getItem('campusProducts')) || [];
        setProducts(storedProducts);
    }, []);

    // Save to LocalStorage whenever products change
    useEffect(() => {
        localStorage.setItem('campusProducts', JSON.stringify(products));
    }, [products]);

    const handleAddProduct = (newProduct) => {
        setProducts([...products, newProduct]);
        alert("Product added successfully!");
    };

    const handleDeleteProduct = (id) => {
        if(confirm("Are you sure you want to delete this item?")) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    return (
        <div>
            <Navbar setView={setView} view={view} />
            
            {view === 'home' && <Home setView={setView} />}
            {view === 'marketplace' && <Marketplace products={products} />}
            {view === 'add-product' && <AddProduct onAddProduct={handleAddProduct} setView={setView} />}
            {view === 'dashboard' && <Dashboard products={products} onDelete={handleDeleteProduct} />}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);