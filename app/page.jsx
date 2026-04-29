'use client';

import { useState, useEffect } from 'react';
import data from '../data';
import styles from './styles.module.css';

export default function Home() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  // Load favorites and cart from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('catalogFavorites');
    const savedCart = localStorage.getItem('catalogCart');
    const savedDarkMode = localStorage.getItem('catalogDarkMode');

    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
      document.body.classList.toggle('dark-mode', JSON.parse(savedDarkMode));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('catalogFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('catalogCart', JSON.stringify(cart));
  }, [cart]);

  // Save dark mode to localStorage
  useEffect(() => {
    localStorage.setItem('catalogDarkMode', JSON.stringify(darkMode));
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const categories = [...new Set(data.map(item => item.category))];

  // Filter and sort data
  const getFilteredData = () => {
    let filtered = data.filter(item =>
      item.itemname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === 'name-asc') {
      filtered = [...filtered].sort((a, b) => a.itemname.localeCompare(b.itemname));
    } else if (sortBy === 'name-desc') {
      filtered = [...filtered].sort((a, b) => b.itemname.localeCompare(a.itemname));
    } else if (sortBy === 'category') {
      filtered = [...filtered].sort((a, b) => a.category.localeCompare(b.category));
    }

    return filtered;
  };

  const filteredData = getFilteredData();

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowDetail(true);
  };

  const handleBack = () => {
    setShowDetail(false);
    setSelectedItem(null);
  };

  const toggleFavorite = (itemName, e) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(itemName)
        ? prev.filter(f => f !== itemName)
        : [...prev, itemName]
    );
  };

  const addToCart = (item, e) => {
    e.stopPropagation();
    setCart(prev => {
      const existing = prev.find(i => i.itemname === item.itemname);
      if (existing) {
        return prev.map(i =>
          i.itemname === item.itemname
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemName) => {
    setCart(prev => prev.filter(i => i.itemname !== itemName));
  };

  const updateCartQuantity = (itemName, delta) => {
    setCart(prev => prev.map(i =>
      i.itemname === itemName
        ? { ...i, quantity: Math.max(1, i.quantity + delta) }
        : i
    ));
  };

  const toggleCompare = (item, e) => {
    e.stopPropagation();
    setCompareList(prev => {
      if (prev.find(i => i.itemname === item.itemname)) {
        return prev.filter(i => i.itemname !== item.itemname);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Compare View
  if (showCompare && compareList.length > 0) {
    const allProps = new Set();
    compareList.forEach(item => {
      item.itemprops.forEach(prop => allProps.add(prop.label));
    });

    return (
      <div className={styles.container}>
        <div className={styles.background}>
          <div className={`${styles.orb} ${styles.orb1}`}></div>
          <div className={`${styles.orb} ${styles.orb2}`}></div>
          <div className={`${styles.orb} ${styles.orb3}`}></div>
        </div>
        
        <button className={styles.backBtn} onClick={() => setShowCompare(false)}>
          ← Back to Catalog
        </button>

        <div className={styles.compareWrapper}>
          <h1 className={styles.compareTitle}>Compare Products</h1>

          <div className={styles.compareGrid}>
            <div className={styles.compareColumn}>
              <div className={styles.compareHeader}></div>
              {Array.from(allProps).map(prop => (
                <div key={prop} className={styles.compareCell}>{prop}</div>
              ))}
            </div>

            {compareList.map((item, idx) => (
              <div key={idx} className={styles.compareColumn}>
                <div className={styles.compareHeader}>
                  <img src={item.image} alt={item.itemname} />
                  <h3>{item.itemname}</h3>
                  <span className={styles.compareCategory}>{item.category}</span>
                  <button
                    className={styles.removeCompare}
                    onClick={(e) => toggleCompare(item, e)}
                  >
                    ×
                  </button>
                </div>
                {Array.from(allProps).map(prop => {
                  const propValue = item.itemprops.find(p => p.label === prop)?.value || '-';
                  return (
                    <div key={prop} className={styles.compareCell}>{propValue}</div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Detail View
  if (showDetail && selectedItem) {
    const isFavorite = favorites.includes(selectedItem.itemname);
    const inCart = cart.find(i => i.itemname === selectedItem.itemname);
    const isComparing = compareList.find(i => i.itemname === selectedItem.itemname);

    return (
      <div className={styles.container}>
        <div className={styles.background}>
          <div className={`${styles.orb} ${styles.orb1}`}></div>
          <div className={`${styles.orb} ${styles.orb2}`}></div>
          <div className={`${styles.orb} ${styles.orb3}`}></div>
        </div>
        
        <button className={styles.backBtn} onClick={handleBack}>
          ← Back to Catalog
        </button>

        <div className={styles.detailWrapper}>
          <div className={styles.detailImage}>
            <img src={selectedItem.image} alt={selectedItem.itemname} />
          </div>

          <div className={styles.detailContent}>
            <div className={styles.detailActions}>
              <button 
                className={`${styles.detailActionBtn} ${styles.primary}`}
                onClick={(e) => addToCart(selectedItem, e)}
              >
                {inCart ? `🛒 Added (${inCart.quantity})` : '🛒 Add to Cart'}
              </button>
              <button 
                className={`${styles.detailActionBtn} ${styles.secondary} ${isFavorite ? styles.active : ''}`}
                onClick={(e) => toggleFavorite(selectedItem.itemname, e)}
              >
                {isFavorite ? '❤️' : '🤍'} Favorite
              </button>
              <button 
                className={`${styles.detailActionBtn} ${styles.secondary} ${isComparing ? styles.active : ''}`}
                onClick={(e) => toggleCompare(selectedItem, e)}
              >
                {isComparing ? '✓' : '⚖️'} Compare
              </button>
            </div>

            <h1 className={styles.detailTitle}>{selectedItem.itemname}</h1>
            <p className={styles.detailCategory}>{selectedItem.category}</p>



            <div className={styles.propsSection}>
              <h2 className={styles.propsTitle}>Specifications</h2>
              <div className={styles.propsList}>
                {selectedItem.itemprops.map((prop, idx) => (
                  <div key={idx} className={styles.propItem}>
                    <span className={styles.propLabel}>{prop.label}</span>
                    <span className={styles.propValue}>{prop.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Catalog View
  return (
    <div className={styles.container}>
      {/* Animated Background */}
      <div className={styles.background}>
        <div className={`${styles.orb} ${styles.orb1}`}></div>
        <div className={`${styles.orb} ${styles.orb2}`}></div>
        <div className={`${styles.orb} ${styles.orb3}`}></div>
      </div>

      {showCart && (
        <div className={styles.cartOverlay} onClick={() => setShowCart(false)}>
          <div className={styles.cartSidebar} onClick={e => e.stopPropagation()}>
            <div className={styles.cartHeader}>
              <h2>Shopping Cart</h2>
              <button onClick={() => setShowCart(false)} className={styles.closeCart}>×</button>
            </div>

            {cart.length === 0 ? (
              <p className={styles.emptyCart}>Your cart is empty 🛒</p>
            ) : (
              <>
                <div className={styles.cartItems}>
                  {cart.map((item, idx) => (
                    <div key={idx} className={styles.cartItem}>
                      <img src={item.image} alt={item.itemname} />
                      <div className={styles.cartItemInfo}>
                        <h4>{item.itemname}</h4>
                        <p>{item.category}</p>
                        <div className={styles.quantityControls}>
                          <button onClick={() => updateCartQuantity(item.itemname, -1)}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.itemname, 1)}>+</button>
                        </div>
                      </div>
                      <button
                        className={styles.removeCartItem}
                        onClick={() => removeFromCart(item.itemname)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className={styles.cartFooter}>
                  <p>Total Items: <strong>{cartTotal}</strong></p>
                  <button className={styles.checkoutBtn}>Checkout</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <header className={styles.header}>
        <h1>Product Catalog</h1>
        <p>Explore our multi-category collection ✨</p>
      </header>

      {searchQuery && (
        <p className={styles.searchResults}>
          Found {filteredData.length} result{filteredData.length !== 1 ? 's' : ''} for "{searchQuery}"
        </p>
      )}

      {categories.map(category => {
        const categoryItems = filteredData.filter(item => item.category === category);

        if (categoryItems.length === 0) return null;

        return (
          <section key={category} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>{category}</h2>

            <div className={styles.grid}>
              {categoryItems.map((item, idx) => {
                const isFavorite = favorites.includes(item.itemname);
                const inCart = cart.find(i => i.itemname === item.itemname);
                const isComparing = compareList.find(i => i.itemname === item.itemname);

                return (
                  <div
                    key={idx}
                    className={styles.card}
                    onClick={() => handleItemClick(item)}
                  >
                    <div className={styles.cardBadges}>
                      {isFavorite && <span className={styles.favoriteBadge}>❤️</span>}
                      {isComparing && <span className={styles.compareBadge}>⚖️</span>}
                    </div>

                    <button
                      className={styles.cardFavorite}
                      onClick={(e) => toggleFavorite(item.itemname, e)}
                    >
                      {isFavorite ? '❤️' : '🤍'}
                    </button>

                    <div className={styles.cardImage}>
                      <img src={item.image} alt={item.itemname} />
                    </div>

                    {/* <div className={styles.cardContent}>
                      <h3>{item.itemname}</h3>
                      <div className={styles.cardActions}>
                        <span
                          className={styles.addCartBtn}
                          onClick={(e) => addToCart(item, e)}
                        >
                          {inCart ? `🛒 ${inCart.quantity}` : '🛒'}
                        </span>
                        <span
                          className={`${styles.compareBtn} ${isComparing ? styles.active : ''}`}
                          onClick={(e) => toggleCompare(item, e)}
                        >
                          {isComparing ? '✓' : '⚖️'}
                        </span>
                      </div>
                    </div> */}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {filteredData.length === 0 && (
        <div className={styles.noResults}>
          <p>No products found for "{searchQuery}"</p>
          <button onClick={() => setSearchQuery('')}>Clear Search</button>
        </div>
      )}
    </div>
  );
}
