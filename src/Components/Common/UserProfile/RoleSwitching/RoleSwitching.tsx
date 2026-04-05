import { useState } from "react";
import { FaSyncAlt, FaUserShield, FaUsersCog } from "react-icons/fa";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
} from "reactstrap";

type RoleOption = {
  id: string;
  label: string;
  description: string;
  badgeColor: string;
  subtle?: boolean;
};

const RoleSwitching: React.FC = () => {
  const roles: RoleOption[] = [
    {
      id: "director",
      label: "Director",
      description: "Default workspace for day-to-day client and case work.",
      badgeColor: "primary",
    },
    {
      id: "admin",
      label: "Organisation Admin",
      description:
        "Manage teams, permissions, pipelines and organisation level settings.",
      badgeColor: "warning",
    },
    {
      id: "read_only",
      label: "Read-only",
      description: "View data without the ability to edit, ideal for auditors.",
      badgeColor: "secondary",
      subtle: true,
    },
  ];

  const [activeRoleId] = useState<string>("director");
  const [selectedRoleId, setSelectedRoleId] = useState<string>(activeRoleId);

  const activeRole = roles.find((role) => role.id === activeRoleId);

  const handleSelectRole = (id: string) => {
    setSelectedRoleId(id);
  };

  const handleSwitchRole = () => {
    // Intentionally left as a no-op for now.
    // Integrate with your auth/session logic when available.
  };

  return (
    <Card className="border-0 shadow-sm h-100">
      <CardBody className="p-4">
        <Row className="align-items-start g-3">
          <Col lg="7" className="border-end-lg pe-lg-4 mb-3 mb-lg-0">
            <div className="d-flex align-items-center mb-2">
              <div
                className="me-2 rounded-circle bg-light-primary d-flex align-items-center justify-content-center"
                style={{ width: 36, height: 36 }}
              >
                <FaUserShield className="text-primary" size={18} />
              </div>
              <div>
                <h5 className="mb-0 fw-bold">Role & Workspace</h5>
                <small className="text-muted">
                  Switch between roles to access the right workspace, tools and
                  permissions.
                </small>
              </div>
            </div>

            <div className="mt-3">
              <small className="text-muted text-uppercase fw-semibold">
                Current active role
              </small>
              <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
                <Badge
                  color="primary"
                  pill
                  className="px-3 py-2 d-flex align-items-center gap-1"
                >
                  <FaUsersCog size={14} />
                  <span>{activeRole?.label ?? "Not assigned"}</span>
                </Badge>
                <span className="text-muted small">
                  This controls what you can see and do across QOP CRM.
                </span>
              </div>
            </div>
          </Col>

          <Col lg="5">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted text-uppercase fw-semibold">
                Available roles
              </small>
              <Badge color="light" className="text-muted fw-normal">
                {roles.length} options
              </Badge>
            </div>

            <ListGroup flush className="role-switching-list">
              {roles.map((role) => {
                const isActive = role.id === activeRoleId;
                const isSelected = role.id === selectedRoleId;

                return (
                  <ListGroupItem
                    key={role.id}
                    action
                    onClick={() => handleSelectRole(role.id)}
                    className={`d-flex align-items-start justify-content-between gap-2 rounded-3 mb-2 ${
                      isSelected
                        ? "border-primary bg-light-primary"
                        : "border-light bg-light-subtle"
                    } ${isActive ? "position-relative" : ""}`}
                  >
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span
                          className={`rounded-circle border d-inline-flex align-items-center justify-content-center ${
                            isSelected ? "border-primary" : "border-300"
                          }`}
                          style={{ width: 18, height: 18 }}
                        >
                          {isSelected && (
                            <span
                              className="rounded-circle bg-primary d-block"
                              style={{ width: 10, height: 10 }}
                            />
                          )}
                        </span>
                        <span className="fw-semibold text-dark">
                          {role.label}
                        </span>
                        {isActive && (
                          <Badge
                            color="success"
                            pill
                            className="px-2 py-1 small"
                          >
                            Active
                          </Badge>
                        )}
                      </div>
                      <small className="text-muted d-block">
                        {role.description}
                      </small>
                    </div>

                    <div className="ms-2 mt-1">
                      <Badge
                        color={role.badgeColor as any}
                        pill
                        className={`px-2 py-1 small ${role.subtle ? "opacity-75" : ""}`}
                      >
                        {role.badgeColor === "primary" && "Core"}
                        {role.badgeColor === "warning" && "Admin"}
                        {role.badgeColor === "secondary" && "Limited"}
                      </Badge>
                    </div>
                  </ListGroupItem>
                );
              })}
            </ListGroup>

            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
              <Button
                color="primary"
                size="sm"
                className="d-flex align-items-center gap-2"
                disabled={selectedRoleId === activeRoleId}
                onClick={handleSwitchRole}
              >
                <FaSyncAlt size={14} />
                <span>Switch to selected role</span>
              </Button>

              <small className="text-muted fst-italic">
                Changes may refresh your dashboard and navigation.
              </small>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default RoleSwitching;
