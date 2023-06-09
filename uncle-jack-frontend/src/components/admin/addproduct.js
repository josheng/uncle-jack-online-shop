import React, { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import DOMPurify from 'dompurify';


const AddProduct = () => {
  const [products, setProducts] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    image: '',
    price: 0,
  });

function sanitizeInput(input) {
  const sanitized = {};
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'string') {
      sanitized[key] = DOMPurify.sanitize(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}


  const handleAddModalOpen = () => setShowAddModal(true);
  const handleAddModalClose = () => {
    setShowAddModal(false);
    setNewProduct({
      name: '',
      description: '',
      category: '',
      image: '',
      price: 0,
    });
  };

  const handleNewProductChange = (event) => {
    const { name, value } = event.target;
    setNewProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const logActions = () => {
    // log actions
    fetch(`http://engch28.pythonanywhere.com/user_activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: 1,
        activity_type: "created a new product",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('failed to create log');
        }
      })
      .catch((error) => console.error(error));
  };

  const handleAddProductSubmit = (event) => {
    event.preventDefault();
    const sanitizedData = sanitizeInput(newProduct);
    fetch('http://engch28.pythonanywhere.com/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sanitizedData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Add the new product to the local state
        setProducts((prevState) => [...prevState, data]);
        handleAddModalClose();
        setShowSuccessAlert(true);
        logActions()
        // window.location.reload();
      })
      .catch((error) => {
        console.error(error)
        setShowErrorAlert(true);
      });
  };


  return (
    <>
      {showSuccessAlert && (
        <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
          Created new product!
        </Alert>
      )}
      {showErrorAlert && (
        <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
          Failed to create product!
        </Alert>
      )}
      <Button variant="primary" onClick={handleAddModalOpen}>
        Add Product
      </Button>
      <Modal show={showAddModal} onHide={handleAddModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddProductSubmit}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleNewProductChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={newProduct.description}
                onChange={handleNewProductChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={newProduct.category}
                onChange={handleNewProductChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={newProduct.image}
                onChange={handleNewProductChange}
                placeholder='https://example.com/image.jpg'
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleNewProductChange}
              />
            </Form.Group>
            <Button type="submit">Add</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddProduct;
