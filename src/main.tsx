'use client';

import { useState } from 'react';
import data from '../data.js';
import styles from './styles.module.css';

export default function main() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const categories = [...new Set(data.map(item => item.category))];

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowDetail(true);
  };

  const handleBack = () => {
    setShowDetail(false);
    setSelectedItem(null);
  };

  if (showDetail && selectedItem) {
    return (
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={handleBack}>
          ← Back to Catalog
        </button>
        
        <div className={styles.detailWrapper}>
          <div className={styles.detailImage}>
            <img src={selectedItem.image} alt={selectedItem.itemname} />
          </div>
          
          <div className={styles.detailContent}>
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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Product Catalog</h1>
        <p>Browse our multi-category collection</p>
      </header>

      {categories.map(category => {
        const categoryItems = data.filter(item => item.category === category);
        
        return (
          <section key={category} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>{category}</h2>
            
            <div className={styles.grid}>
              {categoryItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className={styles.card}
                  onClick={() => handleItemClick(item)}
                >
                  <div className={styles.cardImage}>
                    <img src={item.image} alt={item.itemname} />
                  </div>
                  <div className={styles.cardContent}>
                    <h3>{item.itemname}</h3>
                    <p>View Details →</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
