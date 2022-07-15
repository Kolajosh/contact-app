import React, { useState, useEffect } from "react";
import fireDb from "../firebase";
import { useParams } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

function View() {
  const [user, setUser] = useState({});

  const { id } = useParams();

  useEffect(() => {
    fireDb
      .child(`contacts/${id}`)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          setUser({ ...snapshot.val() });
        } else {
          setUser({});
        }
      });
  }, [id]);

  console.log("user", user);
  return (
    <>
      <Container>
        <h2 className="my-3">User Contact Details</h2>
        <div className="my-2">
          <strong>ID: </strong>
          <span>{id}</span>
        </div>
        <div className="my-2">
          <strong>Name: </strong>
          <span>{user.name}</span>
        </div>
        <div className="my-2">
          <strong>Email: </strong>
          <span>{user.email}</span>
        </div>
        <Button href="/" className="my-2">
          Go back
        </Button>
      </Container>
    </>
  );
}

export default View;
