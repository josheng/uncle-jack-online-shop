import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import "./products.css"
import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/esm/Container';


function ProductCard() {
  const [products, setProducts] = useState([]);
  const [checkedBoxes, setCheckedBoxes] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch('http://127.0.0.1:5000/products');
      const data = await response.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  const handleCheckboxChange = (event) => {
    const checkboxValue = event.target.value;

    if (event.target.checked) {
      setCheckedBoxes([...checkedBoxes, checkboxValue]);
    } else {
      setCheckedBoxes(checkedBoxes.filter((value) => value !== checkboxValue));
    }
  };

  const filteredProducts = products.filter((product) => {
    if (checkedBoxes.length === 0) {
      // If no checkboxes are selected, show all products
      return true;
    }

    // Show the product if its category matches any of the selected checkboxes
    return checkedBoxes.some((checkbox) => checkbox.toLowerCase() === product.category.toLowerCase());
  });

  return (
    <Container fluid>
      <Row>
        <Col className='filter'>
          Filter by Categories:
            <Form.Check type='checkbox' id='1' label='Breads' value='breads' onChange={handleCheckboxChange} />
            <Form.Check type='checkbox' id='2' label='Drinks' value='drinks'  onChange={handleCheckboxChange} />
            <Form.Check type='checkbox' id='3' label='Dairy' value='dairy'  onChange={handleCheckboxChange} />
        </Col>
        <Col md={9} className='cards'>
          <Row xs={1} md={3}>
            {filteredProducts.map((product) => (
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
        </Col>
      </Row>
    </Container>
  );
}

export default ProductCard;
