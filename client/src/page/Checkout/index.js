import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.scss';
import { useLocation } from 'react-router-dom';

const CheckoutPage = () => {
    const [cart, setCart] = useState([]);
    const [message, setMessage] = useState('');
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    const handleLogout = () => {
        localStorage.setItem('lastVisitedPath', location.pathname);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = "/";
    }

    useEffect(() => {
        async function fetchCart() {
            try {
                const authToken = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');

                const config = {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                };

                const response = await axios.get(`${apiBaseUrl}/cart/${userId}/cart`, config);
                setCart(response.data);
            } catch (error) {
                console.error("Error fetching cart", error);
            }
        }

        fetchCart();
    }, []);

    const handleCheckout = async () => {
        setIsLoading(true);

        try {

            const isConfirmed = window.confirm("Are you sure you want to proceed with the checkout?");

            if (!isConfirmed) {
                setIsLoading(false);
                return;
            }

            const authToken = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            const config = {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            };

            const response = await axios.post(`${apiBaseUrl}/cart/${userId}/checkout`, {}, config);
            setMessage(response.data.message);
            alert(response.data.message)
            window.location.href = "/products";
        } catch (error) {
            console.error("Error during checkout", error);
            setMessage('Checkout failed.');
            setIsLoading(false);
        }
    };


    const getTotal = () => {
        const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        return total.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    }

    return (

        <div className='checkout-container'>
            <div className="floating-logout" onClick={handleLogout}>
                <i className="fa fa-sign-out"></i>
            </div>
            <div className='wrapper'>
                <div className='checkout-top-container'>
                    <a href='/products/cart'><i className="fa fa-arrow-left" aria-hidden="true"></i></a>
                    <h2 className='oswald-600'>Checkout</h2>

                </div>
                <div className='cart__list'>
                    {cart && cart.map(item => (

                        <div className='cart__item' key={item.product.id}>
                            <div>
                                <img src={item.product.images[0]} alt={`${item.product.brand} product`} />
                                <div className='price-container'>
                                    <h3>{item.product.brand}</h3>
                                    <p> {formatCurrency(item.product.price * item.quantity)}</p>
                                </div>
                                <p>{item.product.description}</p>

                            </div>
                            <div className='flex-price'>
                                <p className='oswald-600'>Quantity: {item.quantity}</p>
                                <p className='oswald-600'>Unit Price: {formatCurrency(item.product.price)}</p>
                            </div>

                        </div>
                    ))}
                </div>

                <div className='container-btn-checkout'>
                    <p>Payment Method: Cash</p>
                    <h3 className='total-text'>Total: <span>{getTotal()}</span></h3>
                    <button className='btn-checkout' onClick={handleCheckout}> {isLoading ? 'Processing...' : 'Submit'}</button>
                </div>
            </div>

        </div>
    );
};

export default CheckoutPage;
