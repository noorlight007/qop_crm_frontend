import { useGetPublicAppranceQuery } from "@/Redux/Reducers/Appearance/AppearanceApi";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import React from "react";
import { FaNetworkWired } from "react-icons/fa";
import { TbBuildingSkyscraper } from "react-icons/tb";
import { Card } from "reactstrap";

const WelcomeBanner: React.FC = () => {
  const { data: session } = useSession();
  const { data: appearanceData, isLoading } =
    useGetPublicAppranceQuery(undefined);

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
    <>
      {appearanceData?.is_network ? (
        <Card className="welcomeCard">
          <div className="welcomeCardContent">
            <div className="welcomeIconWrapper">
              <FaNetworkWired className="welcomeIcon" />
            </div>
            <div className="welcomeTextContent">
              <div className="welcomeGreeting">Welcome back</div>
              <h2 className="welcomeTitle">
                {appearanceData?.network || "Not Assigned"}
              </h2>
              <p className="welcomeSubtitle">
                {formatChoiceFieldValue(session?.user?.role)} Dashboard
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="welcomeCard">
          <div className="welcomeCardContent">
            <div className="welcomeIconWrapper">
              <TbBuildingSkyscraper className="welcomeIcon" />
            </div>
            <div className="welcomeTextContent">
              <div className="welcomeGreeting">Welcome back</div>
              <h2 className="welcomeTitle">
                {appearanceData?.organisation || "Not Assigned"}
              </h2>
              <p className="welcomeSubtitle">
                {formatChoiceFieldValue(session?.user?.role)} Dashboard
              </p>
              <div className="welcomeNetworkBadge">
                <span className="welcomeNetworkLabel">Network:</span>
                <span className="welcomeNetworkValue">
                  {appearanceData?.network || "Not Assigned"}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default WelcomeBanner;
