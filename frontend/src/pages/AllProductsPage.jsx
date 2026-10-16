import React from 'react';
import ProductCard from '../components/ProductCard';
import spaMassages from '../data/spaMassages.json';

const AllProductsPage = () => {
  return (
    <div className="all-products-page">
      <h1>Spa Massages</h1>
      <div className="product-list">
        {spaMassages.map((massage) => (
          <ProductCard key={massage.id} massage={massage} />
        ))}
      </div>
      <a href="/curtup">Go to Cart</a>
    </div>
  );
};

export default AllProductsPage;
