import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Label,
  Row,
  Table,
  UncontrolledDropdown,
} from "reactstrap";

const mockUsers = [
  {
    initials: "JS",
    name: "John Smith",
    email: "john.smith@firm.com",
    phone: "+1 (555) 123-4567",
    role: "Principal",
    status: "Active",
    department: "Leadership",
    lastLogin: "2024-01-15",
  },
  {
    initials: "SJ",
    name: "Sarah Johnson",
    email: "sarah.johnson@firm.com",
    phone: "+1 (555) 234-5678",
    role: "Adviser",
    status: "Active",
    department: "Wealth Management",
    lastLogin: "2024-01-14",
  },
  {
    initials: "JM",
    name: "John Doe",
    email: "john.doe@firm.com",
    phone: "+1 (555) 345-6789",
    role: "Admin",
    status: "Active",
    department: "Accounting",
    lastLogin: "2024-01-13",
  },
  {
    initials: "JA",
    name: "John Abrahum",
    email: "john.abr@firm.com",
    phone: "+1 (555) 345-6789",
    role: "Adviser",
    status: "Inactive",
    department: "Accounting",
    lastLogin: "2024-01-13",
  },
  // ... more mock users ...
];

const UsersTab: React.FC = () => {
  const [filterIcon, setFilterIcon] = useState(false);
  const toggleFilterIcon = () => {
    setFilterIcon(!filterIcon);
  };
  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
        <Input
          className="w-100"
          placeholder="Search users by name, email, or role..."
          type="text"
          style={{ padding: "10px 10px" }}
        />
        <Button onClick={toggleFilterIcon} color="success" className="me-2">
          {filterIcon ? (
            <i className="fa-solid fa-filter-circle-xmark"></i>
          ) : (
            <i className="fa-solid fa-filter"></i>
          )}
        </Button>
      </div>
      <div>
        {filterIcon && (
          <Card className="shadow-lg p-3  bg-light-success">
            <Row className="justify-content-center g-3">
              <Col xs="12" sm="6" md="4" lg="3">
                <Label>Role</Label>
                <Input type="select" id="1" className="py-1">
                  <option value="">All Role</option>
                  <option value="PRINCIPAL">Principal</option>
                  <option value="ADVISER">Adviser</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPPORT">Support</option>
                </Input>
              </Col>
              <Col xs="12" sm="6" md="4" lg="3">
                <Label>Status</Label>
                <Input type="select" id="2" className="py-1">
                  <option value="">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="PENDING">Pending</option>
                </Input>
              </Col>
              <Col xs="12" sm="6" md="4" lg="3">
                <Label>Department</Label>
                <Input type="select" id="3" className="py-1">
                  <option value="">All Department</option>
                  <option value="LEADERSHIP">Leadership</option>
                  <option value="WEALTH_MANAGEMENT">Wealth Management</option>
                  <option value="ACCOUNTING">Accounting</option>
                  <option value="SUPPORT">Support</option>
                  <option value="OTHER">Other</option>
                </Input>
              </Col>
              {/* Clear All Filters Button */}
              <Col xs="12" sm="6" md="4" lg="3">
                <div>
                  <Label>Clear All Filters</Label>
                  <Button
                    outline
                    color="danger"
                    className="w-100 d-flex justify-content-center align-items-center gap-1"
                  >
                    <span>Clear</span>
                    <i className="fa-solid fa-xmark"></i>
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        )}
      </div>
      <Table hover responsive className="rounded-3 overflow-hidden">
        <thead className="text-center bg-light-primary">
          <tr>
            <th className="text-start">User</th>
            <th>Role</th>
            <th>Status</th>
            <th>Department</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.map((user, idx) => (
            <tr key={idx}>
              <td>
                <div className="d-flex align-items-center">
                  <span
                    className="badge bg-primary rounded-circle me-2"
                    style={{
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                    }}
                  >
                    {user.initials}
                  </span>
                  <div>
                    <div className="fw-bold">{user.name}</div>
                    <div className="text-muted ">
                      <i className="fa-solid fa-envelope me-1 small"></i>
                      <a
                        href={`mailto:${user.email}`}
                        className="text-dark text_decoration_hover small"
                      >
                        {user.email}
                      </a>
                    </div>
                    <div className="text-muted ">
                      <i className="fa-solid fa-phone me-1 small"></i>
                      <a
                        href={`tel:${user.phone}`}
                        className="text-dark text_decoration_hover small"
                      >
                        {user.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </td>
              <td className="text-center">
                <span
                  className={`badge bg-${
                    user.role === "Principal"
                      ? "primary"
                      : user.role === "Adviser"
                      ? "info"
                      : user.role === "Admin"
                      ? "success"
                      : "warning"
                  } text-uppercase`}
                >
                  {user.role}
                </span>
              </td>
              <td className="text-center">
                <span
                  className={`badge bg-${
                    user.status === "Active"
                      ? "success"
                      : user.status === "Inactive"
                      ? "secondary"
                      : "warning"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="text-center">{user.department}</td>
              <td className="text-center">
                <i className="fa-solid fa-calendar me-1 small"></i>
                {user.lastLogin}
              </td>
              <td>
                <div className="d-flex justify-content-center align-items-center gap-1">
                  <Button color="secondary" size="sm">
                    <i className="fa-solid fa-eye"></i>
                  </Button>
                  <Button color="success" size="sm">
                    <i className="fa-solid fa-user-pen"></i>
                  </Button>
                  <UncontrolledDropdown>
                    <DropdownToggle color="primary" size="sm" caret={false}>
                      <i className="fa-solid fa-ellipsis"></i>
                    </DropdownToggle>
                    <DropdownMenu end className="p-1 mt-1 small">
                      <DropdownItem header className="fw-bold">
                        User Actions
                      </DropdownItem>
                      <DropdownItem>
                        <i className="fa-solid fa-shield-halved me-2"></i>
                        Manage Permissions
                      </DropdownItem>
                      <DropdownItem>
                        <i className="fa-solid fa-key me-2"></i>
                        Reset Password
                      </DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem className="text-warning">
                        <i className="fa-solid fa-user-xmark me-2"></i>
                        Deactivate User
                      </DropdownItem>
                      <DropdownItem className="text-danger">
                        <i className="fa-solid fa-trash me-2"></i>
                        Delete User
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UsersTab;
