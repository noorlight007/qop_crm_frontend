import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

// Sample data for permissions
const permissions = [
  {
    id: 1,
    name: "User Management",
    description: "Create, edit, and delete users",
  },
  {
    id: 2,
    name: "System Settings",
    description: "Configure system-wide settings",
  },
  {
    id: 3,
    name: "Reports Access",
    description: "Generate and view system reports",
  },
  {
    id: 4,
    name: "Audit Logs",
    description: "View system activity logs",
  },
  {
    id: 5,
    name: "Security Policies",
    description: "Manage security configurations",
  },
  {
    id: 6,
    name: "Case Management",
    description: "Manage mortgage cases",
  },
  {
    id: 7,
    name: "Client Access",
    description: "Access client information",
  },
  {
    id: 8,
    name: "Compliance Reports",
    description: "View compliance-specific reports",
  },
  {
    id: 9,
    name: "User Monitoring",
    description: "Monitor user activities",
  },
];

interface CreateModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const CreateRoleModal: React.FC<CreateModalProps> = ({ isOpen, toggle }) => {
  // State for modal visibility

  // State for form inputs
  const [roleName, setRoleName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Role Details:", {
      roleName,
      description,
      selectedPermissions,
    });
    // Add logic to send data to backend or handle it as needed
    toggle(); // Close the modal after submission
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className="create-role-modal"
      size="lg"
    >
      <ModalHeader toggle={toggle}>
        <h3 className="text-primary">Create New Role</h3>
        <small className="text-dark opacity-50">
          Define a new role with specific permissions and access levels.
        </small>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          {/* Role Name */}
          <FormGroup>
            <Label for="roleName">Role Name</Label>
            <Input
              type="text"
              id="roleName"
              placeholder="e.g., Manager"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
            />
          </FormGroup>

          {/* Description */}
          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="textarea"
              id="description"
              placeholder="Brief description of the role"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </FormGroup>

          {/* Permissions */}
          <FormGroup className="px-2">
            <Label for="permissions">Permissions</Label>
            <Row>
              <Col md="6">
                <div className="form-check mb-2">
                  <Input
                    type="checkbox"
                    id="UserManagement"
                    name="UserManagement"
                  />
                  <Label check htmlFor="UserManagement">
                    User Management
                    <small className="text-muted d-block mt-1">
                      Create, edit, and delete users
                    </small>
                  </Label>
                </div>
                {/* System Settings */}
                <div className="form-check mb-2">
                  <Input
                    type="checkbox"
                    id="SystemSettings"
                    name="SystemSettings"
                    value={2}
                    checked={selectedPermissions.includes(2)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPermissions([...selectedPermissions, 2]);
                      } else {
                        setSelectedPermissions(
                          selectedPermissions.filter((id) => id !== 2)
                        );
                      }
                    }}
                  />
                  <Label check htmlFor="SystemSettings">
                    System Settings
                    <small className="text-muted d-block mt-1">
                      Configure system-wide settings
                    </small>
                  </Label>
                </div>
                {/* Reports Access */}
                <div className="form-check mb-2">
                  <Input
                    type="checkbox"
                    id="ReportsAccess"
                    name="ReportsAccess"
                  />
                  <Label check htmlFor="ReportsAccess">
                    Reports Access
                    <small className="text-muted d-block mt-1">
                      Generate and view system reports
                    </small>
                  </Label>
                </div>
                {/* Audit Logs */}
                <div className="form-check mb-2">
                  <Input type="checkbox" id="AuditLogs" name="AuditLogs" />
                  <Label check htmlFor="AuditLogs">
                    Audit Logs
                    <small className="text-muted d-block mt-1">
                      View system activity logs
                    </small>
                  </Label>
                </div>
                {/* Security Policies */}
                <div className="form-check mb-2">
                  <Input
                    type="checkbox"
                    id="SecurityPolicies"
                    name="SecurityPolicies"
                  />
                  <Label check htmlFor="SecurityPolicies">
                    Security Policies
                    <small className="text-muted d-block mt-1">
                      Manage security configurations
                    </small>
                  </Label>
                </div>
              </Col>
              <Col md="6">
                {/* Case Management */}
                <div className="form-check mb-2">
                  <Input
                    type="checkbox"
                    id="CaseManagement"
                    name="CaseManagement"
                  />
                  <Label check htmlFor="CaseManagement">
                    Case Management
                    <small className="text-muted d-block mt-1">
                      Manage mortgage cases
                    </small>
                  </Label>
                </div>
                {/* Client Access */}
                <div className="form-check mb-2">
                  <Input
                    type="checkbox"
                    id="ClientAccess"
                    name="ClientAccess"
                  />
                  <Label check htmlFor="ClientAccess">
                    Client Access
                    <small className="text-muted d-block mt-1">
                      Access client information
                    </small>
                  </Label>
                </div>
                {/* Compliance Reports */}
                <div className="form-check mb-2">
                  <Input
                    type="checkbox"
                    id="ComplianceReports"
                    name="ComplianceReports"
                  />
                  <Label check htmlFor="ComplianceReports">
                    Compliance Reports
                    <small className="text-muted d-block mt-1">
                      View compliance-specific reports
                    </small>
                  </Label>
                </div>
                {/* User Monitoring */}
                <div className="form-check mb-2">
                  <Input
                    type="checkbox"
                    id="UserMonitoring"
                    name="UserMonitoring"
                  />
                  <Label check htmlFor="UserMonitoring">
                    User Monitoring
                    <small className="text-muted d-block mt-1">
                      Monitor user activities
                    </small>
                  </Label>
                </div>
              </Col>
              {/* User Management  */}
            </Row>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <div className="d-flex gap-2">
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary">Create User</Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default CreateRoleModal;
