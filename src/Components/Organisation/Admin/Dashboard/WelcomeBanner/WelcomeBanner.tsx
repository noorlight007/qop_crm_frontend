import { AdminDashboardProps } from "@/Types/Organisation/Admin/AdminDashboardTypes";
import React from "react";
import { TbBuildingSkyscraper } from "react-icons/tb";
import { Card } from "reactstrap";

const WelcomeBanner: React.FC<AdminDashboardProps> = ({
  isLoading,
  dashboardData,
}) => {
  if (isLoading) {
    return (
      <div className="py-3">
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
          <h2 className="welcomeTitle">
            {dashboardData?.organisation || "Not Assigned"}
          </h2>
          <p className="welcomeSubtitle">Organisation Adviser Dashboard</p>
          <div className="welcomeNetworkBadge">
            <span className="welcomeNetworkLabel">Network:</span>
            <span className="welcomeNetworkValue">
              {dashboardData?.network || "Not Assigned"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeBanner;
