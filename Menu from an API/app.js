const MENU_DATA = [
    { id: 'd1', name: 'Doro Wat', price: 240, category: 'Main', spicy: true },
    { id: 'd2', name: 'Shiro', price: 120, category: 'Vegetarian', spicy: false },
    { id: 'd3', name: 'Tibs', price: 280, category: 'Main', spicy: true },
    { id: 'd4', name: 'Kitfo', price: 300, category: 'Main', spicy: true },
    { id: 'd5', name: 'Firfir', price: 150, category: 'Breakfast', spicy: true },
    { id: 'd6', name: 'Atakilt Wat', price: 110, category: 'Vegetarian', spicy: false },
    { id: 'd7', name: 'Beyaynetu', price: 200, category: 'Vegetarian', spicy: false },
];

function fetchDishes(category, signal) {
    return new Promise((resolve, reject) => {
        const delay = 300 + Math.random() * 300;
        const timeout = setTimeout(() => {
            if (signal && signal.aborted) {
                reject(new Error('Aborted'));
                return;
            }
            const filtered = MENU_DATA.filter(d => d.category === category);
            // 10% chance of error to test error state
            if (Math.random() < 0.1) {
                reject(new Error('Server error: could not load menu'));
            } else {
                resolve(filtered);
            }
        }, delay);

        if (signal) {
            signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new Error('Aborted'));
            });
        }
    });
}


// Card wrapper
function Card({ children }) {
    return <div className="card">{children}</div>;
}
Card.propTypes = { children: PropTypes.node.isRequired };

// Dish component
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

// DishList - shows list or empty state
function DishList({ dishes }) {
    if (dishes.length === 0) {
        return <div className="empty-state">No dishes in this category</div>;
    }
    return (
        <div>
            {dishes.map(d => (
                <Dish key={d.id} {...d} />
            ))}
        </div>
    );
}
DishList.propTypes = {
    dishes: PropTypes.array.isRequired,
};

function App() {
    // State
    const [category, setCategory] = React.useState('Main');
    const [dishes, setDishes] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    // Ref for focusing input
    const searchRef = React.useRef(null);

    // Effect 1: fetch dishes when category changes
    React.useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        setLoading(true);
        setError(null);

        async function load() {
            try {
                const result = await fetchDishes(category, signal);
                if (!signal.aborted) {
                    setDishes(result);
                }
            } catch (err) {
                if (err.message === 'Aborted') return;
                if (!signal.aborted) {
                    setError(err.message);
                }
            } finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }
        }

        load();

        // Cleanup: abort request
        return () => {
            controller.abort();
        };
    }, [category]);

    // Effect 2: focus search input on mount
    React.useEffect(() => {
        if (searchRef.current) {
            searchRef.current.focus();
        }
    }, []);

    // Early returns for loading and error
    if (loading) {
        return (
            <div>
                <h1>Addis Eats</h1>
                <p className="sub">🇪🇹 today's menu</p>
                <Card>
                    <div className="loading">⏳ Loading the menu...</div>
                </Card>
                <div className="footer">Day 29 · fetching with useEffect</div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1>Addis Eats</h1>
                <p className="sub">🇪🇹 today's menu</p>
                <Card>
                    <div className="error">❌ {error}</div>
                </Card>
                <div className="footer">Day 29 · fetching with useEffect</div>
            </div>
        );
    }

    // Happy path
    const total = dishes.reduce((sum, d) => sum + d.price, 0);

    return (
        <div>
            <h1>Addis Eats</h1>
            <p className="sub">🇪🇹 today's menu</p>

            <Card>
                <input
                    type="text"
                    className="search-input"
                    placeholder="🔍 search dishes..."
                    ref={searchRef}
                />
                <div style={{ marginTop: '1rem' }} />

                <div className="filter-bar">
                    {['Main', 'Vegetarian', 'Breakfast'].map(cat => (
                        <button
                            key={cat}
                            className={`filter-btn ${category === cat ? 'active' : ''}`}
                            onClick={() => setCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <DishList dishes={dishes} />

                <div className="order-total">
                    <span>🧾 order total</span>
                    <span>{total} ETB</span>
                </div>
            </Card>

            <div className="footer">Day 29 · useEffect, cleanup, useRef, fetching</div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);