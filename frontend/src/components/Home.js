import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button, Card, Badge, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaClipboardList } from 'react-icons/fa';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // UseEffect to fetch products when the component mounts
  useEffect(() => {
    // Fetch products on component mount
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Make the product API request
      const response = await axios.get('https://back-dvsv.onrender.com/auth/get-all-products');

      // Check for a successful response
      if (response.status === 200) {
        // Set the products in the state
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleLogout = () => {
    // Clear the user token from storage on logout
    localStorage.removeItem('token');
    // Redirect to the login page
    navigate('/login');
  };

  const addToCart = (productId) => {
    // Find the product by ID
    const productToAdd = products.find((product) => product._id === productId);

    // Check if the product is already in the cart
    const isProductInCart = cart.find((item) => item._id === productId);

    if (isProductInCart) {
      // If the product is already in the cart, increase its quantity
      setCart((prevCart) =>
        prevCart.map((item) =>
          item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      // If the product is not in the cart, add it with quantity 1
      setCart((prevCart) => [...prevCart, { ...productToAdd, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    // Decrease the quantity of the product in the cart
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeProductFromCart = (productId) => {
    // Remove the product from the cart
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  const calculateTotalPrice = () => {
    // Calculate the total price of items in the cart
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div>
      {/* Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            E-commerce Shop
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Nav className="mx-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/contact">
  Contact Us
</Nav.Link>
              {/* Optionally use a shopping cart icon for the Cart link */}
              <Nav.Link onClick={() => setShowCart(!showCart)}>
                <FaShoppingCart className="mr-1" />
                Cart
                {cart.length > 0 && (
                  <Badge pill variant="danger" className="ml-1">
                    {cart.length}
                  </Badge>
                )}
              </Nav.Link>
             
            </Nav>
            <div className="ms-auto">
              
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Content */}
      <Container className="mt-3">
        {/* Display Products */}
        <Row>
          {products.map((product) => (
            <Col key={product._id} md={4} className="mb-4">
              <Card>
                <Card.Img variant="top" src={product.image} />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>Price: ${product.price}</Card.Text>
                  <Button variant="primary" onClick={() => addToCart(product._id)}>
                    Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Cart Sidebar */}
      <div
        style={{
          height: '100%',
          overflowY: 'auto',
          position: 'fixed',
          top: 0,
          right: 0,
          width: '300px',
          backgroundColor: 'white',
          padding: '20px',
          transition: 'transform 0.3s ease-in-out',
          transform: showCart ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div className="d-flex justify-content-end mb-2">
          <Button variant="outline-dark" onClick={() => setShowCart(!showCart)}>
            Close
          </Button>
        </div>
        <h3>Your Cart</h3>
        <div className="row">
          {cart.map((item) => (
            <div key={item._id} className="col-md-12 mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>Price: ${item.price}</Card.Text>
                  <Card.Text>Quantity: {item.quantity}</Card.Text>
                  <Button
                    variant="outline-secondary"
                    className="me-2"
                    onClick={() => removeFromCart(item._id)}
                  >
                    -
                  </Button>
                  <Button variant="outline-secondary" onClick={() => addToCart(item._id)}>
                    +
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="mt-2"
                    onClick={() => removeProductFromCart(item._id)}
                  >
                    Remove from Cart
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>

        {/* Display Total Price */}
        <div className="mt-4">
          <h4>Total Price: ${calculateTotalPrice()}</h4>
        </div>
      </div>
    </div>
  );
};

export default Home;
