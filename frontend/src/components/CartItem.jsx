import React from 'react';

const CartItem = ({ item, updateQuantity, removeItem }) => {
  const handleChange = (e) => {
    const quantity = Math.max(1, parseInt(e.target.value, 10));
    updateQuantity(item.id, quantity);
  };

  return (
    <div className="cart-item">
      <h2>{item.name}</h2>
      <p>${item.price.toFixed(2)} each</p>
      <input type="number" value={item.quantity} onChange={handleChange} min="1" />
      <p>Line Total: ${(item.price * item.quantity).toFixed(2)}</p>
      <button onClick={() => removeItem(item.id)}>Remove</button>
    </div>
  );
};

export default CartItem;
