import { CommonNetworkAdviserSummaryProps } from "@/Types/Network/Adviser/DashboardTypes";
import React from "react";
import { TbNetwork } from "react-icons/tb";
import { Card } from "reactstrap";

const WelcomeBanner: React.FC<CommonNetworkAdviserSummaryProps> = ({
  isLoading,
  netAdviserSummaryData,
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
          <TbNetwork className="welcomeIcon" />
        </div>
        <div className="welcomeTextContent">
          <div className="welcomeGreeting">Welcome back</div>
          <h2 className="welcomeTitle">{netAdviserSummaryData.network}</h2>
          <p className="welcomeSubtitle">Network Adviser Dashboard</p>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeBanner;
