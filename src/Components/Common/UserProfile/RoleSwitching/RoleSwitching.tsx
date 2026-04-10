import {
  useGetUserRolesQuery,
  useSwitchRoleMutation,
} from "@/Redux/Reducers/UserProfileAndSettings/RoleSwitchingApi";
import { getDashboardHomeUrl } from "@/utils/RedirectPaths";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
  key: string;
  label: string;
  description: string;
  badgeColor: string;
  subtle?: boolean;
};

const RoleSwitching: React.FC = () => {
  const { data: session, update } = useSession();
  const { data: userRoles, isLoading } = useGetUserRolesQuery(undefined);
  const [switchRole, { isLoading: isSwitchingRole }] = useSwitchRoleMutation();
  // Map API roles [{ name, key }] into RoleOption models
  const roles: RoleOption[] = useMemo(() => {
    if (!userRoles || !Array.isArray(userRoles)) return [];

    return (userRoles as any[]).map((r) => {
      const key = String(r.key ?? r.role ?? "");
      const name = String(r.name ?? key);

      let badgeColor: RoleOption["badgeColor"] = "secondary";
      if (key === "DIRECTOR") badgeColor = "primary";
      else if (key === "ADMIN") badgeColor = "warning";
      else if (key === "ADVISER") badgeColor = "info" as any;
      else if (key === "COMPLIANCE") badgeColor = "success";
      else if (key === "APPLICANT") badgeColor = "secondary";

      const descriptionMap: Record<string, string> = {
        DIRECTOR:
          "Primary role with full oversight of clients, cases, and overall operations.",
        ADMIN:
          "Supports the director by managing teams, pipelines, and settings.",
        ADVISER:
          "Handles assigned cases and tasks, working directly with clients.",
        COMPLIANCE:
          "Reviews, monitors, and approves cases to ensure compliance requirements are met.",
        APPLICANT: "Accesses and manages their own cases and documents.",
      };

      return {
        key,
        label: name,
        description: descriptionMap[key] ?? "",
        badgeColor,
      };
    });
  }, [userRoles]);

  const [activeRoleKey, setActiveRoleKey] = useState<string | undefined>(
    undefined,
  );
  const [selectedRoleKey, setSelectedRoleKey] = useState<string | undefined>(
    undefined,
  );

  // Initialise active role from current session role
  useEffect(() => {
    if (!session?.user?.role) return;
    setActiveRoleKey(session.user.role);
    setSelectedRoleKey((prev) => prev ?? session.user.role);
  }, [session?.user?.role]);

  const activeRole = roles.find((role) => role.key === activeRoleKey);

  const handleSelectRole = (key: string) => {
    setSelectedRoleKey(key);
  };

  const router = useRouter();

  const handleSwitchRole = async () => {
    if (!selectedRoleKey || selectedRoleKey === activeRoleKey) return;
    try {
      const switchResult = await switchRole({ role: selectedRoleKey }).unwrap();
      const updatedAccessToken =
        (switchResult as any)?.accessToken ??
        (switchResult as any)?.access ??
        (switchResult as any)?.token ??
        (switchResult as any)?.data?.accessToken ??
        (switchResult as any)?.data?.access ??
        null;

      const updatedRefreshToken =
        (switchResult as any)?.refreshToken ??
        (switchResult as any)?.refresh ??
        (switchResult as any)?.data?.refreshToken ??
        (switchResult as any)?.data?.refresh ??
        null;

      setActiveRoleKey(selectedRoleKey);

      // Tell NextAuth to update the JWT token.role so
      // session.user.role reflects the switched role
      if (typeof update === "function") {
        await update({
          role: selectedRoleKey,
          ...(updatedAccessToken ? { accessToken: updatedAccessToken } : {}),
          ...(updatedRefreshToken ? { refreshToken: updatedRefreshToken } : {}),
        } as any);
      }

      if (typeof window !== "undefined") {
        if (updatedAccessToken) {
          localStorage.setItem("token", updatedAccessToken);
        }
        if (updatedRefreshToken) {
          localStorage.setItem("refreshToken", updatedRefreshToken);
        }
      }

      // Create updated session object with new role
      const redirectSession = session
        ? ({
            ...session,
            user: {
              ...session.user,
              role: selectedRoleKey,
            },
          } as Session)
        : null;

      const dashboardUrl = getDashboardHomeUrl(redirectSession);

      // Use a small delay and then hard refresh to ensure session is updated
      setTimeout(() => {
        window.location.href = dashboardUrl;
      }, 500);
    } catch (e) {
      // Optionally surface a toast here if you have a global toaster
      console.error("Failed to switch role", e);
    }
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
              <Badge color="primary" className="text-muted fw-normal">
                {roles.length} options
              </Badge>
            </div>

            <ListGroup flush className="role-switching-list">
              {roles.map((role) => {
                const isActive = role.key === activeRoleKey;
                const isSelected = role.key === selectedRoleKey;

                return (
                  <ListGroupItem
                    key={role.key}
                    action
                    onClick={() => handleSelectRole(role.key)}
                    style={{ cursor: "pointer" }}
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
                      </div>
                      <small className="text-muted d-block">
                        {role.description}
                      </small>
                    </div>
                    {isActive && (
                      <Badge
                        color="success"
                        pill
                        className="px-2 py-1 small"
                        style={{ fontSize: "8px" }}
                      >
                        Active
                      </Badge>
                    )}
                  </ListGroupItem>
                );
              })}
            </ListGroup>

            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
              <Button
                color="primary"
                size="sm"
                className="d-flex align-items-center gap-2"
                disabled={
                  !selectedRoleKey ||
                  selectedRoleKey === activeRoleKey ||
                  isSwitchingRole
                }
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
