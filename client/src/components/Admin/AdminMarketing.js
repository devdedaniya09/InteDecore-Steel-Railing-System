import React, { useState } from 'react';

const AdminMarketing = () => {
  const [promotions, setPromotions] = useState([]);
  const [newPromo, setNewPromo] = useState({
    title: '',
    discount: '',
    expiryDate: ''
  });

  const handleAddPromotion = () => {
    if (!newPromo.title || !newPromo.discount || !newPromo.expiryDate) {
      alert('Please fill out all fields');
      return;
    }

    setPromotions([...promotions, newPromo]);
    setNewPromo({ title: '', discount: '', expiryDate: '' });
  };

  return (
    <div style={styles.container}>
      <h2>🛒 Admin Marketing Panel</h2>

      <div style={styles.form}>
        <h3>Add Promotion</h3>
        <input
          type="text"
          placeholder="Promotion Title"
          value={newPromo.title}
          onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Discount %"
          value={newPromo.discount}
          onChange={(e) => setNewPromo({ ...newPromo, discount: e.target.value })}
          style={styles.input}
        />
        <input
          type="date"
          value={newPromo.expiryDate}
          onChange={(e) => setNewPromo({ ...newPromo, expiryDate: e.target.value })}
          style={styles.input}
        />
        <button onClick={handleAddPromotion} style={styles.button}>Add Promotion</button>
      </div>

      <div style={styles.promotionList}>
        <h3>Current Promotions</h3>
        {promotions.length === 0 ? (
          <p>No promotions added yet.</p>
        ) : (
          <ul>
            {promotions.map((promo, index) => (
              <li key={index} style={styles.promoItem}>
                <strong>{promo.title}</strong> - {promo.discount}% off until {promo.expiryDate}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Simple CSS-in-JS styling
const styles = {
  container: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px'
  },
  form: {
    marginBottom: '2rem',
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '6px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)'
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '0.5rem',
    margin: '0.5rem 0',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  promotionList: {
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '6px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)'
  },
  promoItem: {
    marginBottom: '0.5rem'
  }
};

export default AdminMarketing;
