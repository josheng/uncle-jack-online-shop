import Table from 'react-bootstrap/Table';
import React, { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import "./productlist.css"
import AddProduct from './addproduct';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editableCell, setEditableCell] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch('http://127.0.0.1:5000/products');
      const data = await response.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  const logActions = (msg) => {
    // log actions
    fetch(`http://127.0.0.1:5000/user_activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: 1,
        activity_type: msg,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('failed to create log');
        }
      })
      .catch((error) => console.error(error));
  };

  const handleEditClick = (id) => {
    setEditableCell(id === editableCell ? null : id);
  };

  const handleInputChange = (e, field, id) => {
    // Update the local state with the new value
    const updatedProducts = products.map((p) =>
      p.id === id ? { ...p, [field]: e.target.value } : p
    );
    setProducts(updatedProducts);
  };

  const handleSaveClick = (id) => {
    // Find the product being edited
    const product = products.find((p) => p.id === id);

    // Send a PATCH request to the API to update the product
    fetch(`http://127.0.0.1:5000/products/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the local state with the updated product
        const updatedProducts = products.map((p) =>
          p.id === data.id ? data : p
        );
        setProducts(updatedProducts);
        setEditableCell(null);
        setShowSuccessAlert(true);
        logActions("updated a product");
      })
      .catch((error) => {
        console.log(error)
        setShowErrorAlert(true);
      }
      );
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      fetch(`http://127.0.0.1:5000/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete product');
          }
          return response.json();
        })
        .then((data) => {
          setProducts(products.filter((p) => p.id !== id));
          setShowSuccessAlert(true);
          logActions("deleted a product");
        })
        .catch((error) => {
          console.error(error);
          setShowErrorAlert(true);
        });
    }
  };

  return (
    <>
      <AddProduct />
      {showSuccessAlert && (
        <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
          Product updated successfully!
        </Alert>
      )}
      {showErrorAlert && (
        <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
          Failed to update product!
        </Alert>
      )}
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Category</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td>
              {editableCell === product.id ? (
                <input
                type="text"
                value={product.name}
                onChange={(e) => handleInputChange(e, 'name', product.id)}
                />
                ) : (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span>{product.name}</span>
                </div>
              )}
            </td>
            <td>
              {editableCell === product.id ? (
                <input
                type="text"
                value={product.description}
                onChange={(e) =>
                  handleInputChange(e, 'description', product.id)
                }
                />
                ) : (
                  product.description
                  )}
            </td>
            <td>
              {editableCell === product.id ? (
                <input
                type="text"
                value={product.category}
                onChange={(e) =>
                  handleInputChange(e, 'category', product.id)
                }
                />
                ) : (
                  product.category
                  )}
            </td>
            <td>
              {editableCell === product.id ? (
                <input
                type="text"
                value={product.price}
                onChange={(e) =>
                  handleInputChange(e, 'price', product.id)
                }
                />
                ) : (
                  product.price
                  )}
            </td>
            <td>
              <Button variant='secondary' onClick={() => handleEditClick(product.id)}>
                {editableCell === product.id ? 'Cancel' : 'Edit'}
              </Button>
              <Button variant='success' onClick={() => handleSaveClick(product.id)}>
                Save
              </Button>
              <Button variant='danger' onClick={() => handleDeleteClick(product.id)}>
                Delete
              </Button>
            </td>
            </tr>
          ))}
      </tbody>
    </Table>
</>
  );
}

export default ProductList;
