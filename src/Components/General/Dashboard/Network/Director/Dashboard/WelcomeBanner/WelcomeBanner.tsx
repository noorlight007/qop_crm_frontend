import { NetworkDirectorDashboardProps } from "@/Types/Network/Director/DashboardTypes";
import React from "react";
import { TbNetwork } from "react-icons/tb";
import { Card } from "reactstrap";

const WelcomeBanner: React.FC<NetworkDirectorDashboardProps> = ({
  isLoading,
  networkDashboardData: networkDashboardData,
}) => {
  const networkName = networkDashboardData?.meta?.name || "Not Assigned";
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
          <TbNetwork className="welcomeIcon" />
        </div>
        <div className="welcomeTextContent">
          <div className="welcomeGreeting">Welcome back</div>
          <h2 className="welcomeTitle">{networkName}</h2>
          <p className="welcomeSubtitle">Network Dashboard</p>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeBanner;
