import React from "react";
import { Navbar, Container, Nav, Form, FormControl } from "react-bootstrap";

const NavbarComponent = () => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="#">
          {/* Instagram Logo */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
            alt="Instagram"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          Instagram
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Form className="d-flex mx-auto" style={{ width: "300px" }}>
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
          </Form>
          <Nav className="ms-auto">
            <Nav.Link href="#">
              <i
                className="bi bi-house-fill"
                style={{ fontSize: "1.5rem" }}
              ></i>
            </Nav.Link>
            <Nav.Link href="#">
              <i
                className="bi bi-chat-left-dots-fill"
                style={{ fontSize: "1.5rem" }}
              ></i>
            </Nav.Link>
            <Nav.Link href="#">
              <i
                className="bi bi-compass-fill"
                style={{ fontSize: "1.5rem" }}
              ></i>
            </Nav.Link>
            <Nav.Link href="#">
              <i
                className="bi bi-heart-fill"
                style={{ fontSize: "1.5rem" }}
              ></i>
            </Nav.Link>
            <Nav.Link href="#">
              <i
                className="bi bi-person-circle"
                style={{ fontSize: "1.5rem" }}
              ></i>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
