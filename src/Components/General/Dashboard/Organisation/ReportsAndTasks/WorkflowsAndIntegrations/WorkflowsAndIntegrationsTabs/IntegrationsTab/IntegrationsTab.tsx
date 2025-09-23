import { useState } from "react";
import { Button, Card, Col, Input, Label, Row } from "reactstrap";

const IntegrationsTab: React.FC = () => {
  const [filterIcon, setFilterIcon] = useState(false);
  const toggleFilterIcon = () => setFilterIcon(!filterIcon);

  // Sample integration data (replace with dynamic data if available)
  const integrations = [
    {
      name: "Salesforce CRM",
      icon: "fa-solid fa-building",
      description: "Sync client data and opportunities with Salesforce",
      category: "Data Sync",
      lastSync: "2 minutes ago",
      dataPoints: 1247,
      connected: true,
    },
    {
      name: "DocuSign",
      icon: "fa-solid fa-file-signature",
      description: "Electronic signature integration for document workflows",
      category: "Document Processing",
      lastSync: "1 hour ago",
      dataPoints: 89,
      connected: true,
    },
    {
      name: "Microsoft Outlook",
      icon: "fa-solid fa-at",
      description: "Email integration for automated communications",
      category: "Communication",
      lastSync: "5 minutes ago",
      dataPoints: 342,
      connected: true,
    },
    {
      name: "Slack",
      icon: "fa-brands fa-slack",
      description: "Team notifications and workflow updates",
      category: "Communication",
      lastSync: "10 minutes ago",
      dataPoints: 156,
      connected: true,
    },
    {
      name: "Zapier",
      icon: "fa-solid fa-zap",
      description: "Connect with 5000+ apps through Zapier webhooks",
      category: "Data Sync",
      lastSync: "30 minutes ago",
      dataPoints: 567,
      connected: true,
    },
    {
      name: "Google Drive",
      icon: "fa-brands fa-google-drive",
      description: "Document storage and sharing integration",
      category: "Document Processing",
      lastSync: "3 days ago",
      dataPoints: 0,
      connected: false,
    },
    {
      name: "QuickBooks",
      icon: "fa-solid fa-coins",
      description: "Accounting and financial management",
      category: "Data Sync",
      lastSync: "2 hours ago",
      dataPoints: 789,
      connected: true,
    },
    {
      name: "Calender",
      icon: "fa-solid fa-calendar-days",
      description: "Calendar integration for scheduling meetings",
      category: "Data Sync",
      lastSync: "1 hour ago",
      dataPoints: 34,
      connected: true,
    },
  ];

  return (
    <Row>
      <Col>
        <Card className="px-2 pt-4 pb-2 ">
          <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
            <Input
              className="w-100"
              placeholder="Search Integrations..."
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
              <Card className="shadow-lg p-3 mb-3  bg-light-success">
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
            {/* Integration Cards */}
            <Row className="g-3">
              {integrations.map((integration, index) => (
                <Col key={index} xs="12" sm="6" md="4">
                  <Card className="p-3 mb-3 rounded-3 shadow bg-light-dark">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="rounded-3 bg-light-primary p-3 d-flex justify-content-center">
                          <i className={`${integration.icon}`}></i>
                        </span>
                        <span
                          className={`badge ${
                            integration.connected
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {integration.connected ? "Connected" : "Disconnected"}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <div>
                          <h5 className="mb-0">{integration.name}</h5>
                          <p className="text-muted mb-0 small">
                            {integration.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <p className="mb-1 d-flex justify-content-between small">
                        Category: <strong>{integration.category}</strong>
                      </p>
                      <p className="mb-1 d-flex justify-content-between small">
                        Last Sync: <strong>{integration.lastSync}</strong>
                      </p>
                      <p className="mb-1 d-flex justify-content-between small">
                        Data Points: <strong>{integration.dataPoints}</strong>
                      </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <Button
                        color="danger"
                        outline
                        disabled={!integration.connected}
                        onClick={() =>
                          console.log("Disconnect", integration.name)
                        }
                      >
                        <i className="fa-solid fa-power-off"></i> Disconnect
                      </Button>
                      <div>
                        <Button
                          outline
                          color="secondary"
                          size="sm"
                          className="me-2"
                          onClick={() =>
                            console.log("Settings", integration.name)
                          }
                        >
                          <i className="fa-solid fa-gear"></i>
                        </Button>
                        <Button
                          color="secondary"
                          size="sm"
                          onClick={() => console.log("More", integration.name)}
                        >
                          <i className="fa-solid fa-ellipsis-v p-1"></i>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default IntegrationsTab;
