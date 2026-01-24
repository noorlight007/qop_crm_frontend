import React, { useState } from "react";
import { FaUser } from "react-icons/fa"; // Icons
import { Button, Card, CardBody, Col, Row, Table } from "reactstrap";
import CreateRoleModal from "./Modals/CreateRoleModal";

// Sample data for roles
const roles = [
  {
    id: 1,
    name: "Executive",
    description: "Full system access with administrative privileges",
    usersCount: 3,
    permissions: [
      "user management",
      "system settings",
      "reports",
      "audit logs",
    ],
  },
  {
    id: 2,
    name: "Senior Adviser",
    description: "Senior mortgage adviser with case management access",
    usersCount: 45,
    permissions: [
      "case management",
      "client access",
      "reports",
      "document upload",
    ],
  },
  {
    id: 3,
    name: "Junior Adviser",
    description: "Junior adviser with limited case access",
    usersCount: 112,
    permissions: ["case management", "client access"],
  },
  {
    id: 4,
    name: "Compliance Officer",
    description: "Compliance monitoring and audit access",
    usersCount: 8,
    permissions: [
      "audit logs",
      "compliance reports",
      "user monitoring",
      "compliance reports",
      "compliance reports",
    ],
  },
];

// Component to render permissions as tags
const Permissions = ({ permissions }: { permissions: string[] }) => {
  return (
    <div className="permissions">
      {permissions.slice(0, 3).map((perm, index) => (
        <span key={index} className="badge bg-primary text-dark me-1">
          {perm}
        </span>
      ))}
      {permissions.length > 3 && (
        <span className="badge bg-primary text-dark">
          +{permissions.length - 3} more
        </span>
      )}
    </div>
  );
};

// Main component
const ManageRole: React.FC = () => {
  // State for modal visibility
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);

  // Toggle modal
  const toggleCreateRoleModal = () => {
    setIsCreateRoleOpen(!isCreateRoleOpen);
  };
  return (
    <Row>
      <Col>
        <Card className="shadow-sm mb-4">
          <CardBody>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center">
                <span className="me-1">
                  <i className="fa-solid fa-shield fs-5 text-primary"></i>
                </span>
                <h3 className="mb-0">Manage Role</h3>
              </div>
              <Button
                color="primary"
                className="px-5 py-2"
                onClick={toggleCreateRoleModal}
              >
                Create Role
                <i className="fa-solid fa-circle-plus ms-1"></i>
              </Button>
            </div>

            {/* Table */}
            <Table bordered hover responsive>
              <thead className="text-center">
                <tr>
                  <th>Role Name</th>
                  <th>Description</th>
                  <th>Users</th>
                  <th>Permissions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td>{role.name}</td>
                    <td>{role.description}</td>
                    <td>
                      <span className="me-1">
                        <FaUser />
                      </span>
                      {role.usersCount}
                    </td>
                    <td>
                      <Permissions permissions={role.permissions} />
                    </td>
                    <td>
                      <Button color="success" size="sm" title="Update User">
                        <i className="icon-pencil-alt"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>
      {/*Modal Component */}
      <CreateRoleModal
        isOpen={isCreateRoleOpen}
        toggle={toggleCreateRoleModal}
      />
      {/*Modal Component end */}
    </Row>
  );
};

export default ManageRole;
