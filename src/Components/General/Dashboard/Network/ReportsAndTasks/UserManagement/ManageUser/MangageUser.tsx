import React, { useState } from "react";
import { FaSearch, FaUser } from "react-icons/fa"; // For icons
import {
  Button,
  Card,
  CardBody,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Row,
  Table,
} from "reactstrap";
import AddUserModal from "./Modals/AddUserModal";

const ManageUser: React.FC = () => {
  // State for modal visibility
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Toggle modal
  const toggleAddUserModal = () => {
    setIsAddUserOpen(!isAddUserOpen);
  };

  return (
    <Row>
      {/* Card Container */}
      <Col md="12">
        <Card className="user-management-card shadow-sm">
          <CardBody>
            {/* Header */}
            <div className="d-flex align-items-center mb-3">
              <span className="me-1 fs-6 text-primary">
                <FaUser />
              </span>
              <h3 className="mb-0">Manage User</h3>
            </div>

            {/* Search and Add User Section */}
            <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
              {/* Search Bar */}
              <Col md="8" className="search-bar">
                <InputGroup>
                  <Input
                    type="text"
                    placeholder="Search by name or email... "
                  />
                  <InputGroupText className="bg-primary rounded-start-0 border-start-0">
                    <FaSearch />
                  </InputGroupText>
                </InputGroup>
              </Col>

              {/* Role Filter */}
              <Col
                md="4"
                className="d-flex justify-content-end align-items-center gap-3"
              >
                <div>
                  <Input
                    type="select"
                    id="roleFilter"
                    className="form-select py-2"
                  >
                    <option>All Roles</option>
                    <option>Senior Adviser</option>
                    <option>Compliance Officer</option>
                    <option>Junior Adviser</option>
                  </Input>
                </div>
                <div>
                  <Button
                    color="primary"
                    className="px-5 py-2"
                    onClick={toggleAddUserModal}
                  >
                    Add User
                    <i className="fa-solid fa-circle-plus ms-1"></i>
                  </Button>
                </div>
              </Col>
            </div>

            {/* User Table */}
            <Table bordered hover responsive>
              <thead className="text-center">
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Firm</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {/* User Row 1 */}
                <tr>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="avatar me-2">
                        <span className="bg-primary rounded-circle d-inline-block p-2 text-white">
                          JS
                        </span>
                      </span>
                      <div>
                        <strong>John Smith</strong>
                        <p className="text-muted small">john.smith@firmA.com</p>
                      </div>
                    </div>
                  </td>
                  <td>Senior Adviser</td>
                  <td>ABC Mortgages Ltd</td>
                  <td>
                    <span className="badge bg-success">Active</span>
                  </td>
                  <td>2024-01-15</td>
                  <td>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <Button color="success" size="sm" title="Update User">
                        <i className="icon-pencil-alt"></i>
                      </Button>
                      <Button color="danger" size="sm" title="Delete User">
                        <i className="icon-trash"></i>
                      </Button>
                    </div>
                  </td>
                </tr>

                {/* User Row 2 */}
                <tr>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="avatar me-2">
                        <span className="bg-primary rounded-circle d-inline-block p-2 text-white">
                          SJ
                        </span>
                      </span>
                      <div>
                        <strong>Sarah Johnson</strong>
                        <p className="text-muted small">sarah.j@firmbeta.com</p>
                      </div>
                    </div>
                  </td>
                  <td>Compliance Officer</td>
                  <td>Beta Financial Services</td>
                  <td>
                    <span className="badge bg-dark">Active</span>
                  </td>
                  <td>2024-01-14</td>
                  <td>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <Button color="success" size="sm" title="Update User">
                        <i className="icon-pencil-alt"></i>
                      </Button>
                      <Button color="danger" size="sm" title="Delete User">
                        <i className="icon-trash"></i>
                      </Button>
                    </div>
                  </td>
                </tr>

                {/* User Row 3 */}
                <tr>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="avatar me-2">
                        <span className="bg-primary rounded-circle d-inline-block p-2 text-white">
                          MW
                        </span>
                      </span>
                      <div>
                        <strong>Mike Wilson</strong>
                        <p className="text-muted small">m.wilson@gamma.co.uk</p>
                      </div>
                    </div>
                  </td>
                  <td>Junior Adviser</td>
                  <td>Gamma Mortgage Solutions</td>
                  <td>
                    <span className="badge bg-warning">Pending</span>
                  </td>
                  <td>Never</td>
                  <td>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <Button color="success" size="sm" title="Update User">
                        <i className="icon-pencil-alt"></i>
                      </Button>
                      <Button color="danger" size="sm" title="Delete User">
                        <i className="icon-trash"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>
      {/*Modal Component */}
      <AddUserModal isOpen={isAddUserOpen} toggle={toggleAddUserModal} />
      {/*Modal Component end */}
    </Row>
  );
};

export default ManageUser;
