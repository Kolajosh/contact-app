import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import fireDb from "../firebase";
import { toast } from "react-toastify";
import { Button, Container, Form } from "react-bootstrap";

const initialState = {
  name: "",
  email: "",
  contact: "",
  status: "",
};

function AddEdit() {
  const [state, setState] = useState(initialState);
  const [data, setData] = useState({});

  const { name, email, contact, status } = state;

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    fireDb.child("contacts").on("value", (snapshot) => {
      if (snapshot.val() !== null) {
        setData({ ...snapshot.val() });
      } else {
        setData({});
      }
    });
    return () => {
      setData({});
    };
  }, [id]);

  useEffect(() => {
    if (id) {
      setState({ ...data[id] });
    } else {
      setState({ ...initialState });
    }

    return () => {
      setState({ ...initialState });
    };
  }, [id, data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };


  // When button is clicked
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !contact || !status) {
      toast.error("Please provide value in each field");
    } else {
      //To add new user
      if (!id) {
        fireDb.child("contacts").push(state, (err) => {
          if (err) {
            toast.error(err);
          } else {
            toast.success("Contact Added Successfully");
          }
        });
        //To update existing user
      }else{
        fireDb.child(`contacts/${id}`).set(state, (err) => {
          if (err) {
            toast.error(err);
          } else {
            toast.success("Contact Updated Successfully");
          }
        });
      }

      setTimeout(() => navigate("/"), 3000);
    }
  };
  return (
    <>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your Name"
              onChange={handleInputChange}
              name="name"
              id="name"
              value={name || ""}
            />
            <Form.Text className="text-muted">
              How do you want to save your contact
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              onChange={handleInputChange}
              name="email"
              id="email"
              value={email || ""}
            />
            <Form.Text className="text-muted">
              Please provide contact email
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contact</Form.Label>
            <Form.Control
              type="number"
              placeholder="Your Number"
              onChange={handleInputChange}
              name="contact"
              id="contact"
              value={contact || ""}
            />
            <Form.Text className="text-muted">
              Please provide contact number
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Control
              type="text"
              placeholder="Active / Inactive"
              onChange={handleInputChange}
              name="status"
              id="status"
              value={status || ""}
            />
            <Form.Text className="text-muted">
              How do you want to save your contact
            </Form.Text>
          </Form.Group>

          <Button variant="success" type="submit">
            {id ? "Update" : "Save"}
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default AddEdit;
