import { Card, CardBody } from "reactstrap";

interface AuditLog {
  title: string;
  description: string;
  timeAgo: string;
  type: "compliance" | "adviser" | "policy";
}

const RecentAuditLogs: React.FC = () => {
  const auditLogs: AuditLog[] = [
    {
      title: "Compliance Review Completed",
      description: "All Q2 documents reviewed",
      timeAgo: "2 hours ago",
      type: "compliance",
    },
    {
      title: "New Adviser Onboarded",
      description: "James Wilson added to system",
      timeAgo: "1 day ago",
      type: "adviser",
    },
    {
      title: "Policy Update",
      description: "Data retention policy revised",
      timeAgo: "3 days ago",
      type: "policy",
    },
  ];

  const getLogStyles = (type: AuditLog["type"]) => {
    switch (type) {
      case "compliance":
        return {
          barColor: "bg-success",
          bgColor: "bg-light-success bg-opacity-10",
        };
      case "adviser":
        return {
          barColor: "bg-warning",
          bgColor: "bg-light-warning bg-opacity-10",
        };
      case "policy":
        return {
          barColor: "bg-primary",
          bgColor: "bg-light-primary bg-opacity-10",
        };
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardBody className="p-4">
        <h4 className="mb-4">Recent Audit Logs</h4>
        <div>
          {auditLogs.map((log, index) => {
            const styles = getLogStyles(log.type);
            return (
              <div
                key={index}
                className={`position-relative ${styles.bgColor} rounded-end p-3 mt-2`}
              >
                <div
                  className={`position-absolute top-0 bottom-0 start-0 ${styles.barColor} rounded-start`}
                  style={{ width: "4px" }}
                />
                <h6 className="mb-2">{log.title}</h6>
                <p className="mb-0 small fw-semibold">{log.description}</p>
                <p className="text-muted small">{log.timeAgo}</p>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};

export default RecentAuditLogs;
