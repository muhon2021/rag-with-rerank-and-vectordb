import React from 'react';
import CartItem from '../components/CartItem';
import { useCart } from '../hooks/useCart';

const CartPage = () => {
  const { cartItems, total, updateQuantity, removeItem } = useCart();

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <div>
          <p>Your cart is empty</p>
          <a href="/all-product">Back to Products</a>
        </div>
      ) : (
        <div>
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          ))}
          <div className="cart-total">
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
        </div>
      )}
      <a href="/all-product">Continue Shopping</a>
    </div>
  );
};

export default CartPage;
