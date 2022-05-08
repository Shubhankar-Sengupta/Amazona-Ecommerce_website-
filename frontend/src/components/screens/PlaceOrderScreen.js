import React, { useContext, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { Helmet } from 'react-helmet-async';
import CheckoutSteps from '../main_components/CheckoutSteps';
import { Store } from '../../Store';
import { Link, useNavigate } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';

function PlaceOrderScreen() {
  const {
    state,
    userInfo,
    state: { cart },
  } = useContext(Store);

  const navigate = useNavigate();

  const placeOrderHandler = () => {};

  const {
    cart: { shippingAddress, paymentMethod, cartItems },
  } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23

  cart.itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );

  cart.taxPrice = round2(0.15 * cart.itemsPrice);

  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);

  cart.totalPrice = cart.itemsPrice + cart.taxPrice + cart.shippingPrice;

  useEffect(() => {
    if (!paymentMethod) {
      navigate('/payment');
    }
  }, [navigate, cart]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>Place Order</title>
      </Helmet>

      <h1 className="mt-3">Preview Order</h1>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {shippingAddress.fullName}
                <br />
                <strong>Address: </strong> {shippingAddress.address},
                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </Card.Text>

              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>

              <Card.Text>
                <strong>Method: </strong>
                {paymentMethod}
              </Card.Text>

              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.slug}</Link>
                      </Col>
                      <Col md={3}>
                        {' '}
                        <span>{item.quantity}</span>{' '}
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>

              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${cart.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${cart.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>
                      {' '}
                      <strong>Order</strong>{' '}
                    </Col>
                    <Col>${cart.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      className="btn btn-primary"
                      onClick={placeOrderHandler}
                      disabled={cartItems.length === 0}
                    >
                      Place Order
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrderScreen;
