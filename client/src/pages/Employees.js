import React, { useEffect, useState } from "react";
import API from "../utils/API";
import { Input, FormBtn, SelectOffice } from "../components/Form";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import EquipmentTable from "../components/EquipmentTable/EquipmentTable"
import Loader from "../components/Loader/Loader";
import Col from "react-bootstrap/Col";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [equipment, setEquipment] = useState([]);

  const [officeNameList, setOfficeNameList] = useState([]);
  const [formObject, setFormObject] = useState({});
  const [updatedEmployeeObject, setUpdateEmployeeObject] = useState({});

  const [editState, setEditState] = useState({
    locked: true,
    _id: "",
  });
  useEffect(() => {
    loadEmployees();
    getOfficeNames();
    loadEquipment();
  }, []);

    //Get equipment
    function loadEquipment() {
      API.getEquipment()
        .then((res) => setEquipment(res.data))
        .catch((err) => console.log(err));
    }
  
  //Get employee
  function loadEmployees() {
    API.getEmployees()
      .then((res) => setEmployees(res.data))
      .catch((err) => console.log(err));
  }

  function getOfficeNames() {
    API.getOfficeNames()
      .then((res) => setOfficeNameList(res.data))
      .catch((err) => console.log(err));
  }

  //update employee
  const updateEmployee = (id, employeeData) => {
    API.updateEmployee(id, employeeData)
      .then(loadEmployees)
      .then(switchEditState)
      .catch((err) => console.log(err));
  };

  //delete employee
  function deleteEmployee(id) {
    API.deleteEmployee(id)
      .then((res) => loadEmployees())
      .catch((err) => console.log(err));
  }

  //sets state for form object for its contents
  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormObject({ ...formObject, [name]: value });
  }

  function handleInputChangeUpdateEmployee(event) {
    const { name, value } = event.target;
    setUpdateEmployeeObject({ ...updatedEmployeeObject, [name]: value });
  }

  const handleSelectOfficeChange = (event, employee) => {
    const office = { _id: event.target.value };
    setFormObject({ ...formObject, office_id: office });
    setUpdateEmployeeObject({ ...updatedEmployeeObject, office_id: office });
    if (employee) {
      setEmployees(
        employees.map((item) => {
          if (item._id === employee._id) {
            return { ...item, office_id: office._id };
          }
          return item;
        })
      );
    }
  };

  function clearForm() {
    document.getElementById("create-course-form").reset();
  }

  function switchEditState(id) {
    if (editState._id === id) {
      setEditState({
        _id: "",
      });
    } else {
      setEditState({
        _id: id,
      });
    }
  }

  //Add employee when button click
  function handleFormSubmit(event) {
    event.preventDefault();
    if (
      formObject.name &&
      formObject.address &&
      formObject.city &&
      formObject.state &&
      formObject.zip &&
      formObject.phone &&
      formObject.email
    ) {
      API.insertEmployee({
        // employee DATA HERE
        name: formObject.name,
        address: formObject.address,
        city: formObject.city,
        state: formObject.state,
        zip: formObject.zip,
        office_id: formObject.office_id,
        phone: formObject.phone,
        email: formObject.email,
      })
        .then((res) => loadEmployees())
        .then(clearForm())
        .catch((err) => console.log(err));
    }
  }

  return (
    <div className="container">
      <h1>Employees</h1>
      {employees.length ? (
        employees.map((employee) => (
          <Accordion key={employee._id}>
            <Card style={{ marginBottom: "10px", borderRadius: "5px" }}>
              <Accordion.Toggle
                as={Card.Header}
                eventKey="0"
                style={{ background: "light-grey" }}
              >
                {employee.name}
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <form>
                    <Row>
                      <SelectOffice
                        label="Current Office"
                        onChange={(e) => handleSelectOfficeChange(e, employee)}
                        options={officeNameList}
                        value={employee.office_id}
                        width={12}
                        disabled={employee._id === editState._id ? false : true}
                      />
                    </Row>
                    <Row>
                      <Input
                        data-value={employee._id}
                        label="Employee Name"
                        onChange={handleInputChangeUpdateEmployee}
                        name="name"
                        placeholder={employee.name}
                        width={12}
                        disabled={employee._id === editState._id ? false : true}
                      />
                    </Row>
                    <Row>
                      <Input
                        data-value={employee._id}
                        label="Address"
                        onChange={handleInputChangeUpdateEmployee}
                        name="address"
                        placeholder={employee.address}
                        width={5}
                        disabled={employee._id === editState._id ? false : true}
                      />
                      <Input
                        data-value={employee._id}
                        label="City"
                        onChange={handleInputChangeUpdateEmployee}
                        name="city"
                        placeholder={employee.city}
                        width={3}
                        disabled={employee._id === editState._id ? false : true}
                      />
                      <Input
                        data-value={employee._id}
                        label="State"
                        onChange={handleInputChangeUpdateEmployee}
                        name="state"
                        placeholder={employee.state}
                        width={2}
                        disabled={employee._id === editState._id ? false : true}
                      />
                      <Input
                        data-value={employee._id}
                        label="Zip"
                        onChange={handleInputChangeUpdateEmployee}
                        name="zip"
                        placeholder={employee.zip}
                        width={2}
                        disabled={employee._id === editState._id ? false : true}
                      />
                      <Input
                        data-value={employee._id}
                        label="Phone"
                        onChange={handleInputChangeUpdateEmployee}
                        name="phone"
                        placeholder={employee.phone}
                        width={2}
                        disabled={employee._id === editState._id ? false : true}
                      />
                      <Input
                        data-value={employee._id}
                        label="Email"
                        onChange={handleInputChangeUpdateEmployee}
                        name="email"
                        placeholder={employee.email}
                        width={2}
                        disabled={employee._id === editState._id ? false : true}
                      />
                    </Row>
                    <Row>
                      <div className="col">
                        <Button onClick={() => switchEditState(employee._id)}>
                          {employee._id === editState._id
                            ? "Cancel Update"
                            : "Update This Employee"}
                        </Button>
                        {employee._id === editState._id ? (
                          <Button
                            variant={"success"}
                            onClick={() =>
                              updateEmployee(
                                employee._id,
                                updatedEmployeeObject
                              )
                            }
                          >
                            Save and Update
                          </Button>
                        ) : (
                          ""
                        )}
                        {employee._id === editState._id ? (
                          ""
                        ) : (
                          <Button
                            variant={"danger"}
                            className={"float-right"}
                            onClick={() => deleteEmployee(employee._id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </Row>
                  </form>
                  <br />
                  <Row>
                    <Col>
                      <Accordion>
                      <Card style={{ marginBottom: "10px", borderRadius: "5px" }}>
                          <Card.Header>
                            <Accordion.Toggle
                              as={Card.Header}
                              eventKey="0"
                              style={{ background: "light-grey" }}
                            >
                              Show Equipment List
                            </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body>
                            <EquipmentTable equipment={equipment.filter(eq=> eq.employee_id === employee._id)}/>

                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                      </Accordion>
                    </Col>
                  </Row>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        ))
      ) : (
        <div>{}</div>
      )}
      <Accordion>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            Add Employee
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <form id="create-course-form">
                <SelectOffice
                  label="Select Office"
                  name="office_id"
                  onChange={handleSelectOfficeChange}
                  options={officeNameList}
                  width={12}
                />

                <Input
                  onChange={handleInputChange}
                  name="name"
                  placeholder="Name (required)"
                />
                <Input
                  onChange={handleInputChange}
                  name="address"
                  placeholder="Address (required)"
                />
                <Input
                  onChange={handleInputChange}
                  name="city"
                  placeholder="City (required)"
                />
                {/*NEEDS TO BE A DROPDOWN. WILL DO LATER*/}
                <Input
                  onChange={handleInputChange}
                  name="state"
                  placeholder="State (required)"
                />
                <Input
                  onChange={handleInputChange}
                  name="zip"
                  placeholder="Zip (required)"
                />
                <Input
                  onChange={handleInputChange}
                  name="phone"
                  placeholder="Phone (required)"
                />
                <Input
                  onChange={handleInputChange}
                  name="email"
                  placeholder="Email (required)"
                />

                {/*NEEDS TO ADD THE Employee FIELD*/}
                <FormBtn
                  disabled={
                    !(
                      formObject.name &&
                      formObject.address &&
                      formObject.city &&
                      formObject.state &&
                      formObject.zip &&
                      formObject.phone &&
                      formObject.email
                    )
                  }
                  onClick={handleFormSubmit}
                >
                  Add New Employee
                </FormBtn>
              </form>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
}
