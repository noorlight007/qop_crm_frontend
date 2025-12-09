import React from "react";
import { FaFileExport, FaSearch } from "react-icons/fa";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Input,
  Row,
  Table,
} from "reactstrap";

interface SummaryCardProps {
  count: string;
  label: string;
  bgColor: string;
  textColor: string;
}

const AuditLogsAndActivityTracking: React.FC = () => {
  const auditData = [
    {
      timestamp: "2024-01-15 14:23:45",
      user: "john.smith@firmA.com",
      action: "User Login",
      details: "Successful login from IP 192.168.1.100",
      firm: "ABC Mortgages Ltd",
      module: "Authentication",
      severity: "Info",
    },
    {
      timestamp: "2024-01-15 14:20:12",
      user: "sarah.admin@executive.com",
      action: "User Role Updated",
      details: "Changed user role from Junior to Senior Adviser",
      firm: "System Administration",
      module: "User Management",
      severity: "Medium",
    },
    {
      timestamp: "2024-01-15 14:18:33",
      user: "system@mortgage-crm.com",
      action: "Security Policy Modified",
      details: "Updated password complexity requirements",
      firm: "System Administration",
      module: "Security",
      severity: "High",
    },
    {
      timestamp: "2024-01-15 14:15:27",
      user: "mike.wilson@gamma.co.uk",
      action: "Document Access",
      details: "Accessed client file: CL-2024-0156",
      firm: "Gamma Mortgage Solutions",
      module: "Case Management",
      severity: "Info",
    },
    {
      timestamp: "2024-01-15 14:12:41",
      user: "compliance@beta.com",
      action: "Compliance Report Generated",
      details: "Monthly compliance report for December 2023",
      firm: "Beta Financial Services",
      module: "Reporting",
      severity: "Info",
    },
  ];

  return (
    <Card className="shadow-sm">
      <CardBody className="p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-2">
            <i className="far fa-clipboard text-primary fs-4"></i>
            <h3 className="mb-0">Audit Logs & Activity Tracking</h3>
          </div>
          <Button
            color="primary"
            outline
            className="d-flex align-items-center gap-2 px-3"
          >
            <FaFileExport />
            Export CSV
          </Button>
        </div>

        {/* Search and Filters */}
        <Row className="d-flex justify-content-between mb-4">
          <Col sm="6" md="2" className="position-relative">
            <FaSearch
              className="position-absolute text-muted"
              style={{
                left: "20px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <Input
              type="text"
              placeholder="Search logs..."
              className="py-2 px-4"
            />
          </Col>

          <Col sm="6" md="2" className="position-relative">
            <Input type="select" className="form-select">
              <option>All Severities</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </Input>
          </Col>
          <Col sm="6" md="2" className="position-relative">
            <Input type="select" className="form-select">
              <option>All Modules</option>
              <option>Authentication</option>
              <option>User Management</option>
              <option>Security</option>
              <option>Case Management</option>
              <option>Reporting</option>
            </Input>
          </Col>
          <Col sm="6" md="2" className="position-relative">
            <Input type="select" className="form-select">
              <option>All Firms</option>
              <option>ABC Mortgages Ltd</option>
              <option>Beta Financial Services</option>
              <option>Gamma Mortgage Solutions</option>
              <option>System Administration</option>
            </Input>
          </Col>

          <Col sm="6" md="2" className="position-relative">
            <Input
              type="date"
              placeholder="From"
              className="form-control p-2"
            />
          </Col>

          <Col sm="6" md="2" className="position-relative">
            <Input type="date" placeholder="To" className="form-control p-2" />
          </Col>
        </Row>
        {/* Search and Filters End*/}

        {/* Summary Cards */}
        <Row>
          <Col sm="6" md="3">
            <Card className="bg-light-primary text-center p-2">
              <h2 className="fw-bold mb-1">2,847</h2>
              <p className="text-muted fw-medium">Total Events Today</p>
            </Card>
          </Col>
          <Col sm="6" md="3">
            <Card className="bg-light-success text-center p-2">
              <h2 className="fw-bold mb-1">156</h2>
              <p className="text-muted fw-medium">User Actions</p>
            </Card>
          </Col>
          <Col sm="6" md="3">
            <Card className="bg-light-warning text-center p-2">
              <h2 className="fw-bold mb-1">23</h2>
              <p className="text-muted fw-medium">Security Events</p>
            </Card>
          </Col>
          <Col sm="6" md="3">
            <Card className="bg-light-info text-center p-2">
              <h2 className="fw-bold mb-1">89</h2>
              <p className="text-muted fw-medium">System Events</p>
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <Table hover responsive className="align-middle">
          <thead className="bg-light">
            <tr className="text-center">
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Details</th>
              <th>Firm</th>
              <th>Module</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody>
            {auditData.map((log, index) => (
              <tr key={index} className="text-center">
                <td>{log.timestamp}</td>
                <td>{log.user}</td>
                <td>{log.action}</td>
                <td>{log.details}</td>
                <td>{log.firm}</td>
                <td>{log.module}</td>
                <td>
                  <Badge
                    pill
                    className={`bg-${log.severity.toLowerCase()} bg-opacity-10 text-${log.severity.toLowerCase()} border border-${log.severity.toLowerCase()} px-2`}
                  >
                    {log.severity}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default AuditLogsAndActivityTracking;
