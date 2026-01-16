import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Label,
  Row,
  UncontrolledDropdown,
} from "reactstrap";

const WorkflowsTab: React.FC = () => {
  const [filterIcon, setFilterIcon] = useState(false);
  const toggleFilterIcon = () => setFilterIcon(!filterIcon);

  // Combined workflow data from both images
  const workflows = [
    {
      title: "New Client Onboarding",
      status: "Active",
      description:
        "Automated workflow for onboarding new clients with document collection and approval",
      category: "Client Onboarding",
      triggers: 24,
      lastRun: "2 hours ago",
      successRate: "99%",
      createdBy: "Sarah Johnson",
    },
    {
      title: "Document Processing",
      status: "Active",
      description: "Automatically process and categorize uploaded documents",
      category: "Document Processing",
      triggers: 156,
      lastRun: "15 minutes ago",
      successRate: "95%",
      createdBy: "Michael Chen",
    },
    {
      title: "Compliance Check",
      status: "Active",
      description: "Daily compliance verification and reporting workflow",
      category: "Compliance",
      triggers: 8,
      lastRun: "1 day ago",
      successRate: "100%",
      createdBy: "Emma Williams",
    },
    {
      title: "Client Communication",
      status: "Inactive",
      description: "Automated email sequences for client updates and reminders",
      category: "Communication",
      triggers: 42,
      lastRun: "3 days ago",
      successRate: "92%",
      createdBy: "David Brown",
    },
    {
      title: "Monthly Reports",
      status: "Draft",
      description: "Generate and distribute monthly performance reports",
      category: "Reporting",
      triggers: 0,
      lastRun: "Never",
      successRate: "0%",
      createdBy: "Sarah Johnson",
    },
  ];

  return (
    <Row>
      <Col>
        <Card className="px-2 pt-4 pb-2 ">
          <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
            <Input
              className="w-100"
              placeholder="Search Workflows..."
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
              <Card className="shadow-lg p-3 mb-3 bg-light-success">
                <Row className="justify-content-center g-3">
                  <Col xs="12" sm="6" md="4">
                    <Label>Status</Label>
                    <Input type="select" id="1" className="py-1">
                      <option value="">All Status</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="DRAFT">Draft</option>
                      <option value="ERROR">Error</option>
                    </Input>
                  </Col>
                  <Col xs="12" sm="6" md="4">
                    <Label>Category</Label>
                    <Input type="select" id="2" className="py-1">
                      <option value="">All Category</option>
                      <option value="CLIENT_ONBOARDING">
                        Client Onboarding
                      </option>
                      <option value="DOCUMENT_PROCESSING">
                        Document Processing
                      </option>
                      <option value="COMPLIANCE">Compliance</option>
                      <option value="COMMUNICATION">Communication</option>
                      <option value="REPORTING">Reporting</option>
                      <option value="DATA_SYNC">Data Sync</option>
                      <option value="NOTIFICATIONS">Notifications</option>
                    </Input>
                  </Col>
                  <Col xs="12" sm="6" md="4">
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
            {/* Workflow Cards */}
            {workflows.map((workflow, index) => (
              <Card
                key={index}
                className="mb-3 p-3 rounded-3 shadow bg-light-dark"
              >
                <Row>
                  <Col md="10">
                    <h5 className="d-flex align-items-center gap-2">
                      {workflow.title}
                      {workflow.status === "Active" && (
                        <Badge pill color="success" className="px-2 py-1">
                          <i className="fa-solid fa-play"></i> Active
                        </Badge>
                      )}
                      {workflow.status === "Inactive" && (
                        <Badge pill color="secondary" className="px-2 py-1">
                          <i className="fa-solid fa-pause"></i> Inactive
                        </Badge>
                      )}
                      {workflow.status === "Draft" && (
                        <Badge pill color="warning" className="px-2 py-1">
                          <i className="fa-solid fa-pen"></i> Draft
                        </Badge>
                      )}
                    </h5>
                    <p className="text-muted small">{workflow.description}</p>
                    <div className="d-flex justify-content-between gap-3">
                      <div>
                        <p className="fw-bold mb-0">Category:</p>
                        <p className="mb-1">{workflow.category}</p>
                      </div>
                      <div>
                        <p className="fw-bold mb-0">Triggers:</p>
                        <p className="mb-1">{workflow.triggers}</p>
                      </div>
                      <div>
                        <p className="fw-bold mb-0">Last Run:</p>
                        <p className="mb-1">{workflow.lastRun}</p>
                      </div>
                      <div>
                        <p className="fw-bold mb-0">Success Rate:</p>
                        <p className="mb-1">{workflow.successRate}</p>
                      </div>
                    </div>
                    <small className="text-muted">
                      Created by {workflow.createdBy}
                    </small>
                  </Col>
                  <Col
                    md="2"
                    className="text-end d-flex justify-content-end"
                    style={{ position: "absolute", top: 10, right: 0 }}
                  >
                    <Button
                      outline
                      color={
                        workflow.status === "Inactive" ||
                        workflow.status === "Draft"
                          ? "success"
                          : "warning"
                      }
                      size="sm"
                      className="me-2"
                    >
                      {workflow.status === "Inactive" ||
                      workflow.status === "Draft"
                        ? "Start"
                        : "Pause"}
                    </Button>
                    <UncontrolledDropdown>
                      <DropdownToggle
                        outline
                        color="dark"
                        size="sm"
                        caret={false}
                      >
                        <i className="fa-solid fa-ellipsis-v px-2"></i>
                      </DropdownToggle>
                      <DropdownMenu end className="p-1 mt-1 small">
                        <DropdownItem header className="fw-bold">
                          User Actions
                        </DropdownItem>
                        <DropdownItem>
                          <i className="fa-solid fa-pen-to-square me-2"></i>
                          Edit Workflow
                        </DropdownItem>
                        <DropdownItem>
                          <i className="fa-solid fa-gear me-2"></i>
                          Configure Workflow
                        </DropdownItem>
                        <DropdownItem className="text-warning">
                          <i className="fa-solid fa-clone me-2"></i>
                          Duplicate Workflow
                        </DropdownItem>
                        <DropdownItem className="text-danger">
                          <i className="fa-solid fa-trash me-2"></i>
                          Delete Workflow
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default WorkflowsTab;
