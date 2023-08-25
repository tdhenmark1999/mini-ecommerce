import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.scss';
import { useLocation } from 'react-router-dom';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const location = useLocation();

    const handleLogout = () => {
        localStorage.setItem('lastVisitedPath', location.pathname);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = "/";
    }
    const fetchCartItems = async () => {
        try {
            const authToken = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            };

            const response = await axios.get(`${apiBaseUrl}/cart/${userId}`, config);

            setCartItems(response.data.cart);
            console.log(cartItems)
        } catch (error) {
            console.error("Error fetching cart items", error);
        }
    }

    useEffect(() => {

        fetchCartItems();
    }, []);


    const decreaseQuantity = async (productId) => {
        try {
            const authToken = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            };

            const payload = { productId };

            await axios.post(`${apiBaseUrl}/cart/${userId}/decrease-quantity`, payload, config);
            // You can then refresh the cart items or update the state based on the response
            fetchCartItems();
        } catch (error) {
            console.error("Error decreasing quantity", error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const isConfirmed = window.confirm("Are you sure you want to remove this product from the cart?");

            if (!isConfirmed) {
                return; // Exit the function if the user clicks "Cancel"
            }

            const authToken = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            };

            const payload = { productId };

            await axios.post(`${apiBaseUrl}/cart/${userId}/remove-product`, payload, config);
            fetchCartItems();
        } catch (error) {
            console.error("Error removing product", error);
        }
    };

    const getTotal = () => {
        const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        return total.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    }

    return (

        <div className='cart-container'>
            <div className="floating-logout" onClick={handleLogout}>
                <i className="fa fa-sign-out"></i>
            </div>
            <div className='wrapper'>
                <div className='shop-container'>
                    <a href='/products'><i className="fa fa-arrow-left" aria-hidden="true"></i></a>

                    <h2 className='oswald-600'>Your Cart</h2>

                </div>
                {cartItems.length === 0 ? (
                    <div className="empty-cart-message">
                        <img src='https://www.ktmcityshop.com/front/img/noproduct.png' />
                        No products in the cart.
                    </div>
                ) : (
                    <div className='cart__list'>
                        {cartItems && cartItems.map(item => (

                            <div className='cart__item' key={item.product.id}>
                                <div>
                                    <img src={item.product.images[0]} alt={`${item.product.brand} product`} />
                                    <div className='price-container'>
                                        <h3>{item.product.brand}</h3>
                                        <p> {formatCurrency(item.product.price * item.quantity)}</p>
                                    </div>
                                    <p>{item.product.description}</p>
                                    <div className='flex-price'>
                                        <p className='oswald-600'>Quantity: {item.quantity}</p>
                                        <p className='oswald-600'>Unit Price: {formatCurrency(item.product.price)}</p>
                                    </div>
                                </div>
                                <div className='btn-container'>
                                    <button onClick={() => decreaseQuantity(item.product.id)}> <i className="fa fa-minus"></i> Decrease Quantity</button>
                                    <button className='remove-cart-btn' onClick={() => removeFromCart(item.product.id)}><i className="fa fa-trash"></i> Remove from Cart</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div>
                    {cartItems.length === 0 ? (
                        <div></div>
                    ) : (
                        <div>
                            <h3 className='total-text'>Total: <span>{getTotal()}</span></h3>
                            <div className='container-btn-checkout'>
                                <a className='btn-checkout' href='/products/checkout'>Checkout</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Cart; 