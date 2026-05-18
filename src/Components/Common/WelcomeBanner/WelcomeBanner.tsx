import { useGetPublicAppranceQuery } from "@/Redux/Reducers/Appearance/AppearanceApi";
import { useGetWelcomeBannerAdsQuery } from "@/Redux/Reducers/Common/WelcomeBanner/WelcomeBannerAdsApi";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { FaNetworkWired } from "react-icons/fa";
import { TbBuildingSkyscraper } from "react-icons/tb";
import { Card } from "reactstrap";

const WelcomeBanner: React.FC = () => {
  const { data: session } = useSession();
  const { data: appearanceData, isLoading } =
    useGetPublicAppranceQuery(undefined);
  const { data: adsData, isLoading: isAdsLoading } =
    useGetWelcomeBannerAdsQuery(undefined);

  const isNetwork = Boolean(appearanceData?.is_network);
  const heading = isNetwork
    ? appearanceData?.network
    : appearanceData?.organisation;

  const adsResults = (adsData as any)?.results as
    | Array<{
        title?: string;
        image?: string;
        redirect_url?: string;
        placement?: string;
      }>
    | undefined;

  const dashboardTopAd =
    adsResults?.find((ad) => ad?.placement === "DASHBOARD_TOP") ||
    adsResults?.[0];

  const rightImageSrc =
    dashboardTopAd?.image || "/assets/images/dashboard-1/welcome-bg.png";
  const rightHref = dashboardTopAd?.redirect_url;
  const rightAlt = dashboardTopAd?.title || "";

  if (isLoading || isAdsLoading) {
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
        <div className="welcomeCardLeft">
          <div className="welcomeIconWrapper">
            {isNetwork ? (
              <FaNetworkWired className="welcomeIcon" />
            ) : (
              <TbBuildingSkyscraper className="welcomeIcon" />
            )}
          </div>

          <div className="welcomeTextContent">
            <div className="welcomeGreeting">Welcome back</div>
            <h2 className="welcomeTitle">{heading || "Not Assigned"}</h2>
            <p className="welcomeSubtitle">
              {formatChoiceFieldValue(session?.user?.role)} Dashboard
            </p>

            {!isNetwork ? (
              <div className="welcomeNetworkBadge">
                <span className="welcomeNetworkLabel">Network:</span>
                <span className="welcomeNetworkValue">
                  {appearanceData?.network || "Not Assigned"}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {rightHref ? (
          <a
            className="welcomeCardRight welcomeCardRightLink"
            href={rightHref}
            target="_blank"
            rel="noopener noreferrer"
            title={rightAlt || "Advertisement"}
          >
            <Image
              src={rightImageSrc}
              alt={rightAlt}
              fill
              sizes="(max-width: 768px) 100vw, 240px"
              className="welcomeRightImage"
              priority
            />
          </a>
        ) : (
          <div className="welcomeCardRight" aria-hidden="true">
            <Image
              src={rightImageSrc}
              alt={rightAlt}
              fill
              sizes="(max-width: 768px) 100vw, 240px"
              className="welcomeRightImage"
              priority
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default WelcomeBanner;
