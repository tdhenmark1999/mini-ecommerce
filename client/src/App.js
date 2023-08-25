import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './page/Signup';
import Login from './page/Login';
import ProductListing from './page/Product';
import Cart from './page/Cart';
import Checkout from './page/Checkout';
import ProtectedRoute from './ProtectedRoute';

function withProtection(WrappedComponent) {
  const token = localStorage.getItem('token');

  if (token) {
    return WrappedComponent;
  }

  return <Navigate to="/" replace />;
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/products" element={withProtection(<ProductListing />)} />
        <Route path="/products/cart" element={withProtection(<Cart />)} />
        <Route path="/products/checkout" element={withProtection(<Checkout />)} />
      </Routes>
    </Router>


  );
}

export default App;
