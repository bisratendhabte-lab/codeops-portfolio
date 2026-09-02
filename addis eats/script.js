
// ----- DATA : menu array -----
const menuData = [
  { id: 'd1', name: 'Doro Wat', price: 240, category: 'Main', spicy: true },
  { id: 'd2', name: 'Shiro', price: 120, category: 'Vegetarian', spicy: false },
  { id: 'd3', name: 'Tibs', price: 280, category: 'Main', spicy: true },
  { id: 'd4', name: 'Kitfo', price: 300, category: 'Main', spicy: true },
  { id: 'd5', name: 'Firfir', price: 150, category: 'Breakfast', spicy: true },
  { id: 'd6', name: 'Atakilt Wat', price: 110, category: 'Vegetarian', spicy: false },
  { id: 'd7', name: 'Beyaynetu', price: 200, category: 'Vegetarian', spicy: false },
];

// ----- COMPONENTS -----

// Card : wrapper using children prop
function Card({ children }) {
  return <div className="card">{children}</div>;
}
Card.propTypes = {
  children: PropTypes.node.isRequired
};

// Dish : displays name, price, spicy badge (conditionally)
//        with default currency = 'ETB'
function Dish({ name, price, currency = 'ETB', spicy }) {
  return (
    <div className="dish-item">
      <div className="dish-info">
        <span className="dish-name">{name}</span>
        {spicy && <span className="badge">Spicy</span>}
      </div>
      <span className="price">{price} {currency}</span>
    </div>
  );
}
Dish.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  currency: PropTypes.string,
  spicy: PropTypes.bool,
};

// Menu : filters dishes by category, shows empty state, maps with keys
function Menu({ dishes, category, onSelectCategory }) {
  const filtered = dishes.filter(d => d.category === category);

  return (
    <div>
      <div className="filter-bar">
        {['Main', 'Vegetarian', 'Breakfast'].map(cat => (
          <button
            key={cat}
            className={`filter-btn ${category === cat ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">No {category} dishes today</div>
      ) : (
        <div className="menu-grid">
          {filtered.map(dish => (
            <Dish key={dish.id} {...dish} />
          ))}
        </div>
      )}
    </div>
  );
}
Menu.propTypes = {
  dishes: PropTypes.array.isRequired,
  category: PropTypes.string.isRequired,
  onSelectCategory: PropTypes.func.isRequired,
};

// App : holds state for category filter and TeleBirr form,
//       computes running order total.
function App() {
  const [category, setCategory] = React.useState('Main');
  const [phone, setPhone] = React.useState('');
  const [deliveryStatus, setDeliveryStatus] = React.useState('');

  // running order total (sum of all dish prices)
  const total = menuData.reduce((sum, d) => sum + d.price, 0);

  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    const cleaned = phone.replace(/\s/g, '');
    // simple TeleBirr validation: 10 digits starting with 09
    if (/^09\d{8}$/.test(cleaned)) {
      setDeliveryStatus(`✅ TeleBirr delivery confirmed for ${cleaned}`);
    } else {
      setDeliveryStatus('❌ Enter a valid 10-digit TeleBirr number (09xxxxxxxx)');
    }
  };

  return (
    <div>
      <h1 style={{ fontWeight: 600, fontSize: '1.8rem', marginBottom: '0.25rem' }}>Addis Eats</h1>
      <p style={{ color: '#5a4f40', marginBottom: '1.5rem' }}>🇪🇹 today’s menu</p>

      <Card>
        <Menu
          dishes={menuData}
          category={category}
          onSelectCategory={setCategory}
        />
      </Card>

      {/* order total */}
      <div className="order-total">
        <span>🧾 order total</span>
        <span>{total} ETB</span>
      </div>

      {/* TeleBirr delivery form */}
      <Card>
        <h3 style={{ marginBottom: '0.5rem', fontWeight: 500 }}>🚚 TeleBirr delivery</h3>
        <form className="telebirr-form" onSubmit={handleDeliverySubmit}>
          <input
            type="tel"
            placeholder="09xxxxxxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button type="submit">Confirm delivery</button>
        </form>
        {deliveryStatus && (
          <div className={`delivery-feedback ${deliveryStatus.includes('❌') ? 'error' : ''}`}>
            {deliveryStatus}
          </div>
        )}
      </Card>

      <p style={{ fontSize: '0.8rem', color: '#8a7e6e', marginTop: '1.5rem', textAlign: 'center' }}>
        Day 27 · props, validation, conditional rendering, lists & state
      </p>
    </div>
  );
}

// ----- RENDER -----
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);