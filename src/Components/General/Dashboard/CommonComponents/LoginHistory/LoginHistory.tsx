import { useGetLoginHistoryQuery } from "@/Redux/Reducers/CommonComponents/LoginHistory/LoginHistoryApi";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { Card, CardBody } from "reactstrap";

interface LoginHistoryItem {
  id?: number;
  user: {
    id: number;
    alias: string;
    name: string;
    email: string;
    phone: string;
    profile_image: string;
  };
  ip_address: string;
  user_agent: string;
  device_name: string;
  device_type: string;
  browser_name: string;
  os: string;
  status: "SUCCESS" | "FAILED" | string;
  logged_in_at: string;
}

const LoginHistory: React.FC = () => {
  const { data: loginHistoryData, isLoading } =
    useGetLoginHistoryQuery(undefined);

  const getStatusBadge = (status: string) => {
    if (status === "SUCCESS") {
      return {
        className: "badge bg-success-light text-success fs-5",
        icon: "✓",
      };
    } else if (status === "FAILED") {
      return {
        className: "badge bg-danger-light text-danger fs-5",
        icon: "✕",
      };
    }
    return {
      className: "badge bg-secondary-light text-secondary fs-5",
      icon: "?",
    };
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toUpperCase()) {
      case "MOBILE":
        return "📱";
      case "TABLET":
        return "📱";
      case "PC":
        return "🖥️";
      default:
        return "💻";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardBody className="p-4">
          <h4 className="mb-4">Login History</h4>
          <p>Loading...</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardBody className="p-4">
        <h4 className="mb-4 fw-bold">Login History</h4>
        <div
          className="login-history-container"
          style={{
            maxHeight: "500px",
            overflowY: "auto",
            paddingRight: "8px",
          }}
        >
          {loginHistoryData && loginHistoryData.length > 0 ? (
            loginHistoryData?.map(
              (history: LoginHistoryItem, index: number) => {
                const badge = getStatusBadge(history.status);
                const icon = getDeviceIcon(history.device_type);

                return (
                  <div
                    key={index}
                    className={`login-history-item mb-3 p-3 border rounded-3 ${
                      history.status === "SUCCESS"
                        ? "bg-light-success border-success"
                        : "bg-light-danger border-danger"
                    }`}
                  >
                    {/* User Info Section */}
                    <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
                      <Image
                        src={history.user.profile_image}
                        alt={history.user.name}
                        width={40}
                        height={40}
                        className="object-fit-cover rounded-circle me-2"
                      />
                      <div style={{ flex: 1 }}>
                        <h6 className="mb-0 fw-bold">{history.user.name}</h6>
                        <small className="text-muted">
                          {history.user.email}
                        </small>
                      </div>
                      <span className={badge.className}>{badge.icon}</span>
                    </div>

                    {/* Device Info Section */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: "24px" }}>{icon}</span>
                        <div>
                          <h6 className="mb-1 fw-bold">
                            {history.device_type}
                          </h6>
                          <small className="text-muted">
                            {history.browser_name} • {history.os}
                          </small>
                        </div>
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="row mt-3 small">
                      <div className="col-md-6 text-end">
                        <p className="mb-0 text-muted">
                          Login At: {formatDate(history.logged_in_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
            )
          ) : (
            <p className="text-muted">No login history available</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default LoginHistory;
