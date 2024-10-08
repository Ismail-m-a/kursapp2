import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from './ProductSearch.module.css';

const ProductSearch = ({
  loading: initialLoading = false,
  noResult: initialNoResult = false,
  products: initialProducts = [],
  showModal: initialShowModal = false,
  selectedProduct: initialSelectedProduct = null,
  onSearch,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(initialLoading);
  const [noResult, setNoResult] = useState(initialNoResult);
  const [products, setProducts] = useState(initialProducts);
  const [showModal, setShowModal] = useState(initialShowModal);
  const [selectedProduct, setSelectedProduct] = useState(initialSelectedProduct);
  const inputRef = useRef(null);

  // Focus input on first render
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Debounced search to prevent too many re-renders on typing
  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  const searchProducts = useCallback(
    debounce((query) => {
      if (!query.trim()) {
        setProducts([]);
        setNoResult(false);
        return;
      }

      setLoading(true);

      if (onSearch) {
        onSearch(query)
          .then((searchResults) => {
            if (searchResults && searchResults.length > 0) {
              setProducts(searchResults);
              setNoResult(false);
            } else {
              setProducts([]);
              setNoResult(true);
            }
          })
          .catch(() => {
            setProducts([]);
            setNoResult(true);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, 500), // 500ms debounce time
    [onSearch]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    searchProducts(query);
  };

  const handleShowModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <p>Welcome! Discover products you'll love and explore exciting items.</p>
        <ul>
          <li>Use the search bar to find products that match your interests.</li>
          <li>Click a product image for more details.</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Search for products"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          ref={inputRef}
          className={styles.input}
        />
        <button type="submit" className={styles.submitBtn}>
          Search
        </button>
      </form>

      {loading && <div className={styles.loadingSpinner}>Loading...</div>}
      {noResult && <div className={styles.noResults}>No products found.</div>}

      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product.id} className={styles.card}>
            <div className={styles.cardImageWrapper}>
              <img
                src={product.image}
                alt={product.title}
                className={styles.cardImg}
                onClick={() => handleShowModal(product)}
              />
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>
                {product.title.length > 40 ? `${product.title.substring(0, 37)}...` : product.title}
              </h3>
              <p className={styles.cardText}>
                <strong>Description: </strong>
                {product.description.length > 100
                  ? `${product.description.substring(0, 97)}...`
                  : product.description}
              </p>
              <p>Price: $ {product.price}</p>
              <br />
              <button className={styles.moreInfoBtn} onClick={() => handleShowModal(product)}>
                More Info
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedProduct && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <br />
              <button onClick={handleCloseModal} className={styles.closeBtn}>
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className={styles.modalImg}
              />
              <h3>{selectedProduct.title}</h3>
              <p>
                <strong>Description: </strong>
                {selectedProduct.description}
              </p>
              <p>
                <strong>Price: </strong>${selectedProduct.price}
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button onClick={handleCloseModal} className={styles.closeBtn}>
                Close
              </button>
              <button className={styles.addBtn}>Add to Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
