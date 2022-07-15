import React, { useState, useEffect } from "react";
import fireDb from "../firebase";
import { Button, Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Pen, Trash, Eye } from "react-bootstrap-icons";
import { toast } from "react-toastify";

function Home() {
  const [data, setData] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [sort, setSort] = useState(false);

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
  }, []);

  const onDelete = (id) => {
    if (window.confirm("Are you sure yo want to delete this contact ?")) {
      fireDb.child(`contacts/${id}`).remove((err) => {
        if (err) {
          toast.error(err);
        } else {
          toast.success("Contact deleted successfully");
        }
      });
    }
  };

  const handleChange = (e) => {
    setSort(true);
    fireDb
      .child("contacts")
      .orderByChild(`${e.target.value}`)
      .on("value", (snapshot) => {
        let sortedData = [];
        snapshot.forEach((snap) => {
          sortedData.push(snap.val());
        });
        setSortedData(sortedData);
      });
  };
  const handleReset = () => {
    setSort(false);
    fireDb.child("contacts").on("value", (snapshot) => {
      if (snapshot.val() !== null) {
        setData({ ...snapshot.val() });
      } else {
        setData({});
      }
    }); 
  };

  const filterData =(value)=>{
    fireDb.child("contacts").orderByChild("status").equalTo(value).on("value", (snapshot)=>{
      if(snapshot.val()){
        const data = snapshot.val()
        setData(data)
      }
    })
  }

  return (
    <>
      <Container>
        <Table striped hover className="mt-3">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Status</th>
              {!sort && <th>Action</th>}
            </tr>
          </thead>
          {!sort && (
            <tbody>
              {Object.keys(data).map((id, index) => {
                return (
                  <tr key={id}>
                    <th scope="row">{index + 1}</th>
                    <td>{data[id].name}</td>
                    <td>{data[id].email}</td>
                    <td>{data[id].contact}</td>
                    <td>{data[id].status}</td>
                    <td>
                      <Link to={`/update/${id}`}>
                        <Button
                          variant="success"
                          className="align-items-center"
                        >
                          <Pen>Edit</Pen>
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        className="mx-3 align-items-center"
                        onClick={() => onDelete(id)}
                      >
                        <Trash>Delete</Trash>
                      </Button>
                      <Link to={`/view/${id}`}>
                        <Button
                          variant="secondary"
                          className="align-items-center"
                        >
                          <Eye>View</Eye>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}

          {sort && (
            <tbody>
              {sortedData.map((item, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.contact}</td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </Table>
        <label className="mb-2">Sort by:</label>
        <div className="d-flex">
          <select onChange={handleChange} className="form-select">
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="contact">Contact</option>
            <option value="status">Status</option>
          </select>
          <Button variant="danger" className="mx-2" onClick={handleReset}>
            Reset
          </Button>
        </div>
        <label className="mt-2">Status: </label>
        <Button
          variant="success"
          className="mx-2 mt-2"
          onClick={() => filterData("Active")}
        >
          Active
        </Button>
        <Button
          variant="danger"
          className=" mt-2"
          onClick={() => filterData("Inactive")}
        >
          Inactive
        </Button>
      </Container>
    </>
  );
}

export default Home;
