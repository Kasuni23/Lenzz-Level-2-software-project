import { useEffect, useState, useRef } from "react";
import SideBar from "../Sidebar";
import "./Company.css";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { useProjectContext } from "../../../hooks/useProjectContext";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./../../../hooks/useAuthContext";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Badge from "react-bootstrap/Badge";
import { MdOutlineDeleteOutline } from "react-icons/md";
const NAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;

const Company = () => {
  const userRef = useRef();
  const errRef = useRef();
  const { dispatch } = useProjectContext();
  const { user } = useAuthContext();
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const history = useNavigate();
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [projectname, setprojectname] = useState("");
  const [validProjectName, setValidProjectName] = useState(false);
  const [ProjectNameFocus, setProjectNameFocus] = useState(false); // initialize with false
  const [description, setdescription] = useState("");
  const [validDescription, setValidDescription] = useState(false);
  const [DescriptionFocus, setDescriptionFocus] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [error, setError] = useState(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setValidProjectName(NAME_REGEX.test(projectname));
  }, [projectname]);
  useEffect(() => {
    setValidDescription(NAME_REGEX.test(description));
  }, [description]);
  useEffect(() => {
    setErrMsg("");
  }, [projectname, description]);

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchResult([]);
    setSearch("");
  };
  const handleRemoveUser = (user) => {
    const filteredUsers = selectedUsers.filter((u) => u.id !== user.id);
    setSelectedUsers(filteredUsers);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("you must be logged in");
      history("/login");
      return;
    }
    const project = { projectname, description, startDate, endDate };
    const response = await fetch("/api/project/creatproject", {
      method: "POST",
      body: JSON.stringify(project),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      history("/DashboardProvider");
      setprojectname("");
      setstartDate("");
      setendDate("");
      setdescription("");
      setError(null);
      console.log("new project created", json);
      dispatch({ type: "CREATE_PROJECT", payload: json });
    }
  };

  const handleTickClick = () => {
    setShowContent(!showContent);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch("/api/project:id", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        console.log("projects", json);
        dispatch({ type: "SHOW_PROJECTS", payload: json });
      }
    };

    if (user && user.projects) {
      fetchProjects();
    }
  }, [dispatch, user]);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {}
  };

  return (
    <SideBar>
      <div style={{ marginLeft: "50px" }}>
        <div
          className="card shadow"
          style={{
            width: " 1300px",
            height: " 315px",
            marginLeft: "150px",
            marginTop: "80px",
          }}
        >
          <div className="projectpart" style={{ display: "flex" }}>
            <h1 style={{ marginLeft: "25px", marginTop: "10px" }}>Projects</h1>
            <Button
              variant="info"
              style={{
                width: "200px",
                height: "50px",
                marginTop: "15px",
                marginLeft: "25px",
                padding: "10px",
                fontSize: "20px",
                color: "white",
              }}
              block="true"
              onClick={handleShow}
            >
              Add project
            </Button>
            <Modal show={showModal} onHide={handleClose}>
              <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
              <Modal.Header closeButton>
                <Modal.Title>Add Project Details</Modal.Title>
                <br />
              </Modal.Header>
              <Modal.Body>
                <Form className="needs-validation">
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label style={{ fontWeight: "bold" }}>
                      Project Name
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={validProjectName ? "valid" : "hide"}
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={
                          validProjectName || !projectname ? "hide" : "invalid"
                        }
                      />
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      ref={userRef}
                      autoComplete="on"
                      onChange={(e) => setprojectname(e.target.value)}
                      required
                      aria-invalid={validProjectName ? "false" : "true"}
                      aria-describedby="uidnote"
                      onFocus={() => setProjectNameFocus(true)}
                      onBlur={() => setProjectNameFocus(false)}
                      value={projectname}
                      placeholder="Enter your project name..."
                    />
                    <p
                      className={
                        ProjectNameFocus && projectname && !validProjectName
                          ? "instructions"
                          : "offscreen"
                      }
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                      4 to 24 characters.
                      <br />
                      Must begin with a letter.
                      <br />
                      Letters, numbers, underscores, hyphens allowed.
                    </p>
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label style={{ fontWeight: "bold" }}>
                      Description
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={validDescription ? "valid" : "hide"}
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={
                          validDescription || !description ? "hide" : "invalid"
                        }
                      />
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      ref={userRef}
                      autoComplete="on"
                      onChange={(e) => setdescription(e.target.value)}
                      required
                      aria-invalid={validDescription ? "false" : "true"}
                      aria-describedby="uidnote"
                      onFocus={() => setDescriptionFocus(true)}
                      onBlur={() => setDescriptionFocus(false)}
                      value={description}
                      placeholder="Enter your Description..."
                    />
                    <p
                      className={
                        DescriptionFocus && description && !validDescription
                          ? "instructions"
                          : "offscreen"
                      }
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                      4 to 24 characters.
                      <br />
                      Must begin with a letter.
                      <br />
                      Letters, numbers, underscores, hyphens allowed.
                    </p>
                  </Form.Group>
                  <div className="mb-6 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="exampleCheck1"
                      onClick={handleTickClick}
                    />
                    <label className="form-check-label" htmlFor="exampleCheck1">
                      If you need to add date
                    </label>
                  </div>
                  {showContent ? (
                    <div>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label style={{ fontWeight: "bold" }}>
                          Start Date
                        </Form.Label>
                        <Form.Control
                          type="date"
                          autoFocus
                          onChange={(e) => setstartDate(e.target.value)}
                          value={startDate}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label style={{ fontWeight: "bold" }}>
                          End Date
                        </Form.Label>
                        <Form.Control
                          type="date"
                          autoFocus
                          onChange={(e) => setendDate(e.target.value)}
                          value={endDate}
                        />
                      </Form.Group>
                    </div>
                  ) : null}
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                  Create Project
                </Button>
                {error && (
                  <div
                    className="error"
                    style={{
                      padding: " 10px",
                      paddingLeft: "65px",
                      background: " #ffefef",
                      border: " 1px solid var(--error)",
                      color: "red",
                      borderRadius: "15px",
                      margin: " 10px 0",
                      marginRight: "55px",
                      width: " 340px",
                    }}
                  >
                    {error}
                  </div>
                )}
              </Modal.Footer>
            </Modal>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "20px",
              marginRight: "15px",
            }}
          >
            {user &&
              user.projects &&
              user.projects.map((project) => (
                <div
                  className="card shadow"
                  style={{
                    width: " 250px",
                    height: " 65px",
                    marginLeft: "25px",
                    padding: "5px",
                  }}
                  key={user._id}
                >
                  <h6>Project :{project.projectname}</h6>
                  <h6> Description :{project.description}</h6>
                </div>
              ))}
          </div>
        </div>
        <div
          className="card shadow"
          style={{
            width: "1300px",
            height: " 315px",
            marginLeft: "150px",
            marginTop: "10px",
          }}
        >
          <div className="projectpart" style={{ display: "flex" }}>
            <h1 style={{ marginLeft: "25px", marginTop: "10px" }}>Members</h1>
            <Button
              variant="info"
              style={{
                width: "200px",
                height: "50px",
                marginTop: "15px",
                marginLeft: "25px",
                padding: "10px",
                fontSize: "20px",
                color: "white",
              }}
              block="true"
              href="./Createproject"
            >
              Add member
            </Button>
          </div>
        </div>
      </div>
    </SideBar>
  );
};

export default Company;
