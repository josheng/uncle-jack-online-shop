import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "./header.css"

function HeaderBar() {
  return (
    <div>
      <Navbar bg="light" expand="lg" fixed='top'>
        <Container fluid>
          <Navbar.Brand href="#">🛒Uncle Jack's Minimart</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
              >
              <Nav.Link href="/">Products</Nav.Link>
              <NavDropdown title="Admin" id="navbarScrollingDropdown">
                <NavDropdown.Item href="/admin">Product List</NavDropdown.Item>
                <NavDropdown.Item href="/admin/user_activity">User Activity</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
   </div>
  );
}

export default HeaderBar;
