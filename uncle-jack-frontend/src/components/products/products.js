import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import "./products.css"
import React, { useState, useEffect } from 'react';
import milo from "../images/drinks/milo.jpg"


function ProductCard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch('http://127.0.0.1:5000/products');
      const data = await response.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <div className='cards'>
      <Row xs={1} md={3}>
        {products.map((product) => (
          <Col key={product.id}>
            <Card style={{ width: '18rem', marginBottom: '10px' }}>
              <Card.Img variant="top" src={product.image} />
              <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>{product.description}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <div>
                  SGD${product.price}
                </div>
                <Button variant="outline-primary" size="sm">Add to Cart</Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ProductCard;
