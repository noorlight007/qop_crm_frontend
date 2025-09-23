import React, { useState } from "react";
import { TbActivity } from "react-icons/tb";
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

const auditLogs = [
  {
    action: "User Login",
    user: "john.smith@company.com",
    resource: "Authentication System",
    timestamp: "2024-01-15 14:35:22",
    ipAddress: "192.168.1.105",
    status: "Success",
    severity: "Info",
    details: "Successful login from Chrome browser",
    auditId: "AUD-001",
  },
  {
    action: "Report Generated",
    user: "sarah.johnson@company.com",
    resource: "Client Portfolio Report",
    timestamp: "2024-01-15 14:30:15",
    ipAddress: "192.168.1.112",
    status: "Success",
    severity: "Info",
    details: "Monthly portfolio report generated for ABC-123",
    auditId: "AUD-002",
  },
  {
    action: "Permission Changed",
    user: "admin@company.com",
    resource: "User mikewilson@company.com",
    timestamp: "2024-01-15 13:45:10",
    ipAddress: "192.168.1.116",
    status: "Success",
    severity: "Warning",
    details: "Admin role assigned to user",
    auditId: "AUD-003",
  },
  {
    action: "Failed Login Attempt",
    user: "unknown@external.com",
    resource: "Authentication System",
    timestamp: "2024-01-15 13:20:33",
    ipAddress: "203.45.67.89",
    status: "Failed",
    severity: "High",
    details: "Invalid credentials provided",
    auditId: "AUD-004",
  },
  {
    action: "Data Export",
    user: "emily.davis@company.com",
    resource: "Client Database",
    timestamp: "2024-01-15 12:15:45",
    ipAddress: "192.168.1.108",
    status: "Success",
    severity: "Warning",
    details: "Client list exported to CSV format",
    auditId: "AUD-005",
  },
  {
    action: "User Created",
    user: "admin@company.com",
    resource: "User Management",
    timestamp: "2024-01-15 11:39:22",
    ipAddress: "192.168.1.116",
    status: "Success",
    severity: "Info",
    details: "New user account created: alex.chen@company.com",
    auditId: "AUD-006",
  },
  {
    action: "Document Accessed",
    user: "mike.wilson@company.com",
    resource: "Confidential Report #445",
    timestamp: "2024-01-15 10:45:18",
    ipAddress: "192.168.1.115",
    status: "Success",
    severity: "Info",
    details: "Compliance document viewed",
    auditId: "AUD-007",
  },
  {
    action: "Settings Modified",
    user: "sarah.johnson@company.com",
    resource: "System Configuration",
    timestamp: "2024-01-15 09:29:55",
    ipAddress: "192.168.1.112",
    status: "Success",
    severity: "Info",
    details: "Notification preferences updated",
    auditId: "AUD-008",
  },
];

const AuditLogsTab: React.FC = () => {
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
          <Card className="shadow-lg p-3 bg-light-success">
            <Row className="justify-content-center g-3">
              <Col xs="12" sm="6" md="4" lg="3">
                <Label>Action</Label>
                <Input type="select" id="1" className="py-1">
                  <option value="">All Actions</option>
                  <option value="1">User Login</option>
                  <option value="2">Report Generated</option>
                  <option value="3">Permission Changed</option>
                  <option value="4">Failed Login Attempt</option>
                  <option value="5">Data Export</option>
                  <option value="6">User Created</option>
                  <option value="7">Document Accessed</option>
                  <option value="8">Settings Modified</option>
                </Input>
              </Col>
              <Col xs="12" sm="6" md="4" lg="3">
                <Label>Status</Label>
                <Input type="select" id="2" className="py-1">
                  <option value="">All Status</option>
                  <option value="1">Success</option>
                  <option value="2">Failed</option>
                </Input>
              </Col>
              <Col xs="12" sm="6" md="4" lg="3">
                <Label>Date Range</Label>
                <Input type="date" id="3" className="py-2" />
              </Col>
              <Col xs="12" sm="6" md="4" lg="3">
                <div>
                  <Label>Clear All Filters</Label>
                  <Button
                    outline
                    className="btn btn-outline-danger w-100 d-flex justify-content-center align-items-center gap-1"
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
      <Card className=" p-3">
        <div className="mb-4 mt-2">
          <h3>
            <TbActivity className="me-1 fs-5" />
            Audit Logs(8)
          </h3>
        </div>
        <Table hover responsive className="rounded-3 overflow-hidden">
          <thead className="text-center bg-light-primary">
            <tr>
              <th className="text-start">Action</th>
              <th>User</th>
              <th>Resource</th>
              <th>Timestamp</th>
              <th>IP Address</th>
              <th>Status</th>
              <th>Severity</th>
              <th>Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log, idx) => (
              <tr key={idx}>
                <td>
                  <div className="d-flex align-items-center">
                    <div>
                      <div className="fw-bold">{log.action}</div>
                      <span className="text-muted fa-7">{log.auditId}</span>
                    </div>
                  </div>
                </td>
                <td className="text-center">{log.user}</td>
                <td className="text-center">{log.resource}</td>
                <td className="text-center">
                  <i className="fa-solid fa-calendar me-1 small"></i>
                  {log.timestamp}
                </td>
                <td className="text-center">{log.ipAddress}</td>
                <td className="text-center">
                  <span
                    className={`badge bg-${
                      log.status === "Success" ? "success" : "danger"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="text-center">
                  <span
                    className={`badge bg-${
                      log.severity === "Info"
                        ? "info"
                        : log.severity === "Warning"
                        ? "warning"
                        : "danger"
                    }`}
                  >
                    {log.severity}
                  </span>
                </td>
                <td className="text-center">{log.details}</td>
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
      </Card>
    </div>
  );
};

export default AuditLogsTab;
