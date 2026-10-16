import React from 'react';
import { useCart } from '../hooks/useCart';

const ProductCard = ({ massage }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <h2>{massage.name}</h2>
      <p>{massage.description}</p>
      <p>${massage.price.toFixed(2)}</p>
      <button onClick={() => addToCart(massage)}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
