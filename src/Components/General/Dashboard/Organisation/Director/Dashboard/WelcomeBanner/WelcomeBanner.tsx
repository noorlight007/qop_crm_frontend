import { CommonDashboardProps } from "@/Types/CommonComponents/CommonDashboard/CommonDashboardType";
import React from "react";
import { TbBuildingSkyscraper } from "react-icons/tb";
import { Card } from "reactstrap";

const WelcomeBanner: React.FC<CommonDashboardProps> = ({
  isLoading,
  commonDashboardData,
}) => {
  const orgName = commonDashboardData?.meta?.name || "Not Assigned";
  const networkName = commonDashboardData?.meta?.network || "Not Assigned";

  if (isLoading) {
    return (
      <div className="p-3">
        <div className="placeholder-glow">
          <span
            className="placeholder col-12 rounded"
            style={{ height: 120 }}
          />
        </div>
      </div>
    );
  }

  return (
    <Card className="welcomeCard">
      <div className="welcomeCardContent">
        <div className="welcomeIconWrapper">
          <TbBuildingSkyscraper className="welcomeIcon" />
        </div>
        <div className="welcomeTextContent">
          <div className="welcomeGreeting">Welcome back</div>
          <h2 className="welcomeTitle">{orgName}</h2>
          <p className="welcomeSubtitle">Organisation Dashboard</p>
          <div className="welcomeNetworkBadge">
            <span className="welcomeNetworkLabel">Network:</span>
            <span className="welcomeNetworkValue">{networkName}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeBanner;
