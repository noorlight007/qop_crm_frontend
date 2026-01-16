import React, { useState } from "react";
import { TbFileText } from "react-icons/tb";
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

const mockReports = [
  {
    report: "Monthly Client Portfolio Report",
    id: "RPT-001",
    type: "Client Reports",
    status: "Completed",
    createdBy: "John Smith",
    createdAt: "2024-01-15 14:30",
    size: "2.4 MB",
    downloads: 23,
  },
  {
    report: "Q4 Performance Analysis",
    id: "RPT-002",
    type: "Performance Reports",
    status: "Completed",
    createdBy: "Sarah Johnson",
    createdAt: "2024-01-14 09:15",
    size: "5.1 MB",
    downloads: 45,
  },
  {
    report: "Compliance Audit Report",
    id: "RPT-003",
    type: "Compliance Reports",
    status: "Pending",
    createdBy: "Mike Wilson",
    createdAt: "2024-01-14 16:45",
    size: "1.8 MB",
    downloads: 12,
  },
  {
    report: "Risk Assessment Summary",
    id: "RPT-004",
    type: "Risk Assessment",
    status: "Completed",
    createdBy: "Emily Davis",
    createdAt: "2024-01-13 11:20",
    size: "3.2 MB",
    downloads: 31,
  },
  {
    report: "Weekly Activity Report",
    id: "RPT-005",
    type: "Audit Reports",
    status: "Failed",
    createdBy: "Alex Chen",
    createdAt: "2024-01-12 08:30",
    size: "0.9 MB",
    downloads: 8,
  },
];
const ReportsTab: React.FC = () => {
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
                <Label>Type</Label>
                <Input type="select" id="1" className="py-1">
                  <option value="">All Types</option>
                  <option value="1">Client Reports</option>
                  <option value="2">Performance Reports</option>
                  <option value="3">Compliance Reports</option>
                  <option value="4">Risk Assessment</option>
                  <option value="5">Audit Reports</option>
                </Input>
              </Col>
              <Col xs="12" sm="6" md="4" lg="3">
                <Label>Status</Label>
                <Input type="select" id="2" className="py-1">
                  <option value="">All Status</option>
                  <option value="1">Active</option>
                  <option value="2">Inactive</option>
                  <option value="3">Pending</option>
                </Input>
              </Col>
              <Col xs="12" sm="6" md="4" lg="3">
                <Label>Date Range</Label>
                <Input type="date" id="3" className="py-2" />
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
      <Card className=" p-3">
        <div className="mb-4 mt-2">
          <h3>
            <TbFileText className="me-1 fs-5" />
            Reports(5)
          </h3>
        </div>
        <Table hover responsive className="rounded-3 overflow-hidden">
          <thead className="text-center bg-light-primary">
            <tr>
              <th className="text-start">Report</th>
              <th>Type</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Created At</th>
              <th>Size</th>
              <th>Downloads</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockReports.map((report, idx) => (
              <tr key={idx}>
                <td>
                  <div className="d-flex align-items-center">
                    <div>
                      <div className="fw-bold">{report.report}</div>
                      <span className=" fa-7 text-muted">{report.id}</span>
                    </div>
                  </div>
                </td>
                <td className="text-center">{report.type}</td>
                <td className="text-center">
                  <span
                    className={`badge bg-${
                      report.status === "Active"
                        ? "success"
                        : report.status === "Inactive"
                        ? "secondary"
                        : "warning"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="text-center">{report.createdBy}</td>
                <td className="text-center">
                  <i className="fa-solid fa-calendar me-1 small"></i>
                  {report.createdAt}
                </td>
                <td className="text-center">{report.size}</td>
                <td className="text-center">{report.downloads}</td>
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

export default ReportsTab;
