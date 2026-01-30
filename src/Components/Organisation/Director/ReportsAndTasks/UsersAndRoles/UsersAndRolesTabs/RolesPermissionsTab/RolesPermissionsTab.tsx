import React, { useState } from "react";
import { TbCrown, TbSettingsQuestion, TbShield, TbUsers } from "react-icons/tb";
import { Card, CardBody, Input } from "reactstrap";

// Define types for type safety
interface Role {
  name: string;
  color: string;
  users: number;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
}

interface PermissionCategory {
  category: string;
  permissions: string[];
}

// Define mockRoles with icon components
const mockRoles: Role[] = [
  { name: "Principal", color: "primary", users: 2, icon: TbCrown },
  { name: "Adviser", color: "secondary", users: 8, icon: TbUsers },
  { name: "Admin", color: "success", users: 3, icon: TbShield },
  { name: "Support", color: "warning", users: 2, icon: TbSettingsQuestion },
];

// Define mockPermissions (summarized for brevity)
const mockPermissions: Record<string, PermissionCategory[]> = {
  Principal: [
    {
      category: "Dashboard Access",
      permissions: ["View dashboard", "Access analytics", "Export reports"],
    },
    {
      category: "Client Management",
      permissions: [
        "View all clients",
        "Edit client info",
        "Add new clients",
        "Delete clients",
      ],
    },
    {
      category: "Case Management",
      permissions: [
        "View all cases",
        "Update case status",
        "Create new cases",
        "Assign cases",
      ],
    },
    {
      category: "Document Management",
      permissions: [
        "View documents",
        "Share documents",
        "Upload documents",
        "Delete documents",
      ],
    },
    {
      category: "User Management",
      permissions: [
        "View users",
        "Edit user roles",
        "Add users",
        "Deactivate users",
      ],
    },
    {
      category: "System Settings",
      permissions: [
        "View settings",
        "Manage integrations",
        "Modify workflows",
        "System configuration",
      ],
    },
    { category: "Reports", permissions: ["Export reports"] },
  ],
  Adviser: [
    {
      category: "Dashboard Access",
      permissions: ["View dashboard", "Access analytics", "Export reports"],
    },
    {
      category: "Client Management",
      permissions: [
        "View all clients",
        "Edit client info",
        "Add new clients",
        "Delete clients",
      ],
    },
    {
      category: "Case Management",
      permissions: [
        "View all cases",
        "Update case status",
        "Create new cases",
        "Assign cases",
      ],
    },
    {
      category: "Document Management",
      permissions: [
        "View documents",
        "Share documents",
        "Upload documents",
        "Delete documents",
      ],
    },
    {
      category: "User Management",
      permissions: [
        "View users",
        "Edit user roles",
        "Add users",
        "Deactivate users",
      ],
    },
    {
      category: "System Settings",
      permissions: [
        "View settings",
        "Manage integrations",
        "Modify workflows",
        "System configuration",
      ],
    },
    { category: "Reports", permissions: ["Export reports"] },
  ],
  Admin: [
    {
      category: "Dashboard Access",
      permissions: ["View dashboard", "Access analytics", "Export reports"],
    },
    {
      category: "Client Management",
      permissions: [
        "View all clients",
        "Edit client info",
        "Add new clients",
        "Delete clients",
      ],
    },
    {
      category: "Case Management",
      permissions: [
        "View all cases",
        "Update case status",
        "Create new cases",
        "Delete cases",
      ],
    },
    {
      category: "Document Management",
      permissions: [
        "View documents",
        "Share documents",
        "Upload documents",
        "Delete documents",
      ],
    },
    {
      category: "User Management",
      permissions: [
        "View users",
        "Edit user roles",
        "Add users",
        "Deactivate users",
      ],
    },
    {
      category: "System Settings",
      permissions: [
        "View settings",
        "Manage integrations",
        "Modify workflows",
        "System configuration",
      ],
    },
    { category: "Reports", permissions: ["Export reports"] },
  ],
  Support: [
    {
      category: "Dashboard Access",
      permissions: ["View dashboard", "Access analytics", "Export reports"],
    },
    {
      category: "Client Management",
      permissions: [
        "View all clients",
        "Edit client info",
        "Add new clients",
        "Delete clients",
      ],
    },
    {
      category: "Case Management",
      permissions: [
        "View all cases",
        "Update case status",
        "Create new cases",
        "Delete cases",
      ],
    },
    {
      category: "Document Management",
      permissions: [
        "View documents",
        "Share documents",
        "Upload documents",
        "Delete documents",
      ],
    },
    {
      category: "User Management",
      permissions: [
        "View users",
        "Edit user roles",
        "Add users",
        "Deactivate users",
      ],
    },
    {
      category: "System Settings",
      permissions: [
        "View settings",
        "Manage integrations",
        "Modify workflows",
        "System configuration",
      ],
    },
    { category: "Reports", permissions: ["Export reports"] },
  ],
  // ... other roles ...
};

const RolesPermissionsTab: React.FC = () => {
  // Initialize selectedPermissions with default permissions for the initial role
  const [selectedRole, setSelectedRole] = useState<string>("Principal");
  const [selectedPermissions, setSelectedPermissions] = useState<{
    [category: string]: string[];
  }>(() => {
    const initialPermissions: { [category: string]: string[] } = {};
    mockPermissions["Principal"].forEach((cat) => {
      initialPermissions[cat.category] = cat.permissions;
    });
    return initialPermissions;
  });

  // Handle Reset button
  const handleReset = () => {
    const resetPermissions: { [category: string]: string[] } = {};
    mockPermissions[selectedRole].forEach((cat) => {
      resetPermissions[cat.category] = cat.permissions;
    });
    setSelectedPermissions(resetPermissions);
  };

  // Handle Save Changes button
  const handleSave = () => {
    console.log("Saved permissions:", selectedPermissions);
    // Add logic to save to a backend or update state as needed
  };

  return (
    <div className="mt-3">
      <div className="d-flex gap-3">
        {mockRoles.map((role) => {
          const IconComponent = role.icon;
          return (
            <Card
              key={role.name}
              className={`mb-3 flex-fill text-center rounded-3 ${
                selectedRole === role.name ? `border-${role.color}` : ""
              }`}
              style={{ cursor: "pointer", minWidth: 180 }}
              onClick={() => {
                setSelectedRole(role.name);
                // Update permissions when role changes
                const newPermissions: { [category: string]: string[] } = {};
                mockPermissions[role.name].forEach((cat) => {
                  newPermissions[cat.category] = cat.permissions;
                });
                setSelectedPermissions(newPermissions);
              }}
            >
              <CardBody className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-3">
                  <div
                    className={`d-flex align-items-center justify-content-center p-2 rounded-3 bg-${role.color}`}
                  >
                    <IconComponent
                      className="text-white"
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                  <div className="text-start flex-grow-1">
                    <div className="fw-bold">{role.name}</div>
                    <div className="text-muted small mb-1">
                      {role.users} users
                    </div>
                  </div>
                </div>
                <div>
                  <span
                    className={`badge fw-normal mt-1 ${
                      selectedRole === role.name
                        ? `bg-light-${role.color} text-${role.color}`
                        : ""
                    }`}
                    style={{
                      visibility:
                        selectedRole === role.name ? "visible" : "hidden",
                    }}
                  >
                    Selected
                  </span>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Card className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
          <div>
            <h4 className="fw-bold d-flex align-items-center gap-2">
              {(() => {
                const selected = mockRoles.find(
                  (role) => role.name === selectedRole
                );
                if (!selected) return null;
                const IconComponent = selected.icon;
                return (
                  <span
                    className={`d-flex align-items-center justify-content-center p-2 rounded-3 bg-${selected.color}`}
                  >
                    <IconComponent
                      className="text-white"
                      style={{ fontSize: "12px" }}
                    />
                  </span>
                );
              })()}
              <span>{selectedRole} Permissions</span>
            </h4>
          </div>
          <div className="d-flex justify-content-end gap-1">
            <button
              className="btn btn-outline-danger me-2"
              type="button"
              onClick={handleReset}
            >
              <i className="fa-solid fa-rotate-left me-1"></i> Reset
            </button>
            <button
              className="btn btn-primary d-flex align-items-center"
              type="button"
              onClick={handleSave}
            >
              <i className="fa-regular fa-floppy-disk me-1"></i> Save Changes
            </button>
          </div>
        </div>
        <div className="row">
          {(mockPermissions[selectedRole] || []).map((cat, idx) => (
            <div className="col-md-6 mb-2" key={idx}>
              <div className="fw-bold mb-2">{cat.category}</div>
              <div className="row">
                {(() => {
                  const half = Math.ceil(cat.permissions.length / 2);
                  const left = cat.permissions.slice(0, half);
                  const right = cat.permissions.slice(half);
                  return (
                    <>
                      <div className="col-6">
                        <ul className="list-unstyled">
                          {left.map((perm, i) => (
                            <li
                              key={i}
                              className="mb-2 d-flex align-items-center"
                            >
                              <label
                                className="d-flex align-items-center w-100"
                                style={{ cursor: "pointer" }}
                              >
                                <Input
                                  type="checkbox"
                                  name={`permission-${cat.category}-${selectedRole}`}
                                  value={perm}
                                  style={{ cursor: "pointer" }}
                                  checked={
                                    Array.isArray(
                                      selectedPermissions[cat.category]
                                    ) &&
                                    selectedPermissions[cat.category].includes(
                                      perm
                                    )
                                  }
                                  onChange={() => {
                                    setSelectedPermissions((prev) => {
                                      const prevSelected = Array.isArray(
                                        prev[cat.category]
                                      )
                                        ? prev[cat.category]
                                        : [];
                                      if (prevSelected.includes(perm)) {
                                        return {
                                          ...prev,
                                          [cat.category]: prevSelected.filter(
                                            (p) => p !== perm
                                          ),
                                        };
                                      } else {
                                        return {
                                          ...prev,
                                          [cat.category]: [
                                            ...prevSelected,
                                            perm,
                                          ],
                                        };
                                      }
                                    });
                                  }}
                                  className="me-2"
                                />
                                {perm}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="col-6">
                        <ul className="list-unstyled">
                          {right.map((perm, i) => (
                            <li
                              key={i}
                              className="mb-2 d-flex align-items-center"
                            >
                              <label
                                className="d-flex align-items-center w-100"
                                style={{ cursor: "pointer" }}
                              >
                                <Input
                                  type="checkbox"
                                  name={`permission-${cat.category}-${selectedRole}`}
                                  value={perm}
                                  style={{ cursor: "pointer" }}
                                  checked={
                                    Array.isArray(
                                      selectedPermissions[cat.category]
                                    ) &&
                                    selectedPermissions[cat.category].includes(
                                      perm
                                    )
                                  }
                                  onChange={() => {
                                    setSelectedPermissions((prev) => {
                                      const prevSelected = Array.isArray(
                                        prev[cat.category]
                                      )
                                        ? prev[cat.category]
                                        : [];
                                      if (prevSelected.includes(perm)) {
                                        return {
                                          ...prev,
                                          [cat.category]: prevSelected.filter(
                                            (p) => p !== perm
                                          ),
                                        };
                                      } else {
                                        return {
                                          ...prev,
                                          [cat.category]: [
                                            ...prevSelected,
                                            perm,
                                          ],
                                        };
                                      }
                                    });
                                  }}
                                  className="me-2"
                                />
                                {perm}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default RolesPermissionsTab;
