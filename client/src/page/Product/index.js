import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../useAuth';
import './style.scss';
import 'font-awesome/css/font-awesome.min.css';

function ProductListing() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]); // Cart state
    const isAuthenticated = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const [totalItem, setTotalItem] = useState(0);
    const [userID, setUserID] = useState(0);
    const location = useLocation();

    const handleLogout = () => {
        localStorage.setItem('lastVisitedPath', location.pathname);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = "/";
    }

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://dummyjson.com/products');
                setProducts(response.data.products);
            } catch (error) {
                console.error("Error fetching products", error);
            }
        }
        fetchProducts();
    }, [cartItems]);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setUserID(userId)
        if (userID) {
            cartFetch(userID)

        }

    }, [userID, totalItem]);

    const cartFetch = async (id) => {
        axios.get(`${apiBaseUrl}/cart/${userID}`)
            .then(response => {
                setCartItems(response.data);
                const totalItemsInCart = response.data.cart.reduce((acc, item) => acc + item.quantity, 0);
                setTotalItem(totalItemsInCart)
                console.log(totalItemsInCart)

            })
            .catch(error => {
                console.error("Error fetching cart data:", error);
            });

    }
    const addToCart = async (product) => {
        try {
            const authToken = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            console.log()
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            };

            const payload = {
                userId,
                product

            };

            const response = await axios.post(`${apiBaseUrl}/cart/add-to-cart`, payload, config);
            cartFetch(userID)
            if (response.status === 200) {
                setCartItems(response.data.cart);
            }
        } catch (error) {
            console.error("Failed to add product to cart:", error);
        }
    }


    if (!isAuthenticated) {
        return <Navigate to="/signin" />;
    }
    return (
        <div className='product-container'>
            <div className="floating-logout" onClick={handleLogout}>
                <i className="fa fa-sign-out"></i>
            </div>
            <div className='wrapper'>
                <div className='shop-container'>
                    <h2>Products</h2>
                    <div className="cart-icon-container">
                        <a href='/products/cart'>
                            <i className="fa fa-shopping-cart"></i>
                            <span className="cart-quantity">{totalItem}</span>
                        </a>
                    </div>
                </div>
                <div className='product__list'>
                    {products && products?.map(product => (

                        <div className='product__item' key={product.id}>
                            <div>
                                <img src={product.images[0]} alt={`${product.brand} product`} />
                                <div className='price-container'>
                                    <h3>{product.brand}</h3>
                                    <p>${product.price}</p>
                                </div>
                                <p>{product.description}</p>

                            </div>
                            <div>
                                <button onClick={() => addToCart(product)}>Add to Cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default ProductListing;
