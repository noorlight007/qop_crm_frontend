import { Card, CardBody } from "reactstrap";

interface LoginActivity {
  title: string;
  description: string;
  timeAgo: string;
  type: "success" | "warning" | "info";
}

const RecentLoginActivity: React.FC = () => {
  const loginActivities: LoginActivity[] = [
    {
      title: "Successful Login",
      description: "John Smith logged in from Chrome, Windows",
      timeAgo: "5 minutes ago",
      type: "success",
    },
    {
      title: "Failed Login Attempt",
      description: "3 unsuccessful login attempts detected",
      timeAgo: "1 hour ago",
      type: "warning",
    },
    {
      title: "Successful Login",
      description: "Sarah Johnson logged in from Safari, macOS",
      timeAgo: "3 hours ago",
      type: "success",
    },
    {
      title: "Session Ended",
      description: "User session expired after inactivity",
      timeAgo: "1 day ago",
      type: "info",
    },
  ];

  const getActivityStyles = (type: LoginActivity["type"]) => {
    switch (type) {
      case "success":
        return {
          barColor: "bg-success",
          bgColor: "bg-light-success bg-opacity-10",
        };
      case "warning":
        return {
          barColor: "bg-warning",
          bgColor: "bg-light-warning bg-opacity-10",
        };
      case "info":
        return {
          barColor: "bg-primary",
          bgColor: "bg-light-primary bg-opacity-10",
        };
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardBody className="p-4">
        <h4 className="mb-4">Recent Login Activity</h4>
        <div>
          {loginActivities.map((activity, index) => {
            const styles = getActivityStyles(activity.type);
            return (
              <div
                key={index}
                className={`position-relative ${styles.bgColor} rounded-end p-3 mt-2`}
              >
                <div
                  className={`position-absolute top-0 bottom-0 start-0 ${styles.barColor} rounded-start`}
                  style={{ width: "4px" }}
                />
                <h6 className="mb-2">{activity.title}</h6>
                <p className="mb-0 small fw-semibold">{activity.description}</p>
                <p className="text-muted small">{activity.timeAgo}</p>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};

export default RecentLoginActivity;
