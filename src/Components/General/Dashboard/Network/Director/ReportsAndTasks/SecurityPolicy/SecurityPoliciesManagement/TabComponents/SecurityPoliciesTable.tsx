import React from "react";
import { Button } from "reactstrap";

interface Policy {
  name: string;
  description: string;
  appliedTo: string;
  status: string;
  lastUpdated: string;
  priority: string;
}

const SecurityPoliciesTable: React.FC = () => {
  const policies: Policy[] = [
    {
      name: "Password Policy",
      description: "Defines password complexity and rotation requirements",
      appliedTo: "All Users",
      status: "Active",
      lastUpdated: "2024-01-10",
      priority: "high",
    },
    {
      name: "Session Management",
      description: "Controls user session timeouts and concurrent sessions",
      appliedTo: "All Users",
      status: "Active",
      lastUpdated: "2024-01-08",
      priority: "medium",
    },
    {
      name: "Data Retention Policy",
      description: "Specifies data retention periods for different data types",
      appliedTo: "All AR Firms",
      status: "Active",
      lastUpdated: "2024-01-05",
      priority: "high",
    },
    {
      name: "API Access Control",
      description: "Manages third-party API access permissions",
      appliedTo: "System Integrations",
      status: "Under Review",
      lastUpdated: "2024-01-15",
      priority: "medium",
    },
  ];

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="bg-light">
          <tr className="text-center">
            <th>Policy</th>
            <th>Description</th>
            <th>Applied To</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {policies.map((policy, index) => (
            <tr key={index}>
              <td className="fw-semibold">{policy.name}</td>
              <td>{policy.description}</td>
              <td>{policy.appliedTo}</td>
              <td>
                <span
                  className={`badge bg-${
                    policy.status === "Active" ? "success" : "warning"
                  } bg-opacity-10 text-${
                    policy.status === "Active" ? "success" : "warning"
                  }`}
                >
                  {policy.status}
                </span>
              </td>
              <td>{policy.lastUpdated}</td>
              <td>
                <span
                  className={`badge bg-${
                    policy.priority === "high" ? "danger" : "warning"
                  } bg-opacity-10 text-${
                    policy.priority === "high" ? "danger" : "warning"
                  }`}
                >
                  {policy.priority}
                </span>
              </td>
              <td>
                <Button color="none" className="p-0">
                  <i className="fas fa-edit text-success"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SecurityPoliciesTable;
