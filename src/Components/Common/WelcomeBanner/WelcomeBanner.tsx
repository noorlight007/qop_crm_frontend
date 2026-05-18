import { useGetPublicAppranceQuery } from "@/Redux/Reducers/Appearance/AppearanceApi";
import { useGetAdsQuery } from "@/Redux/Reducers/Common/Ads/AdsApi";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaNetworkWired } from "react-icons/fa";
import { TbBuildingSkyscraper } from "react-icons/tb";
import { Card, Carousel, CarouselItem } from "reactstrap";

type AdItem = {
  alias?: string;
  title?: string;
  image?: string;
  redirect_url?: string;
  placement?: string;
};

const WelcomeBanner: React.FC = () => {
  const { data: session } = useSession();
  const { data: appearanceData, isLoading } =
    useGetPublicAppranceQuery(undefined);
  const { data: adsData, isLoading: isAdsLoading } = useGetAdsQuery(undefined);

  const adsList: AdItem[] = useMemo(() => {
    const raw = adsData as any;
    if (Array.isArray(raw)) return raw as AdItem[];
    if (Array.isArray(raw?.results)) return raw.results as AdItem[];
    return [];
  }, [adsData]);

  const isNetwork = Boolean(appearanceData?.is_network);
  const heading = isNetwork
    ? appearanceData?.network
    : appearanceData?.organisation;

  const dashboardTopAds = useMemo(
    () =>
      adsList.filter(
        (ad) => ad?.placement === "DASHBOARD_TOP" && Boolean(ad?.image),
      ),
    [adsList],
  );

  const selectedAds = dashboardTopAds.length
    ? dashboardTopAds
    : adsList.filter((ad) => Boolean(ad?.image));

  const hasCarousel = selectedAds.length > 1;
  const dashboardTopAd = selectedAds[0];

  const rightImageSrc =
    dashboardTopAd?.image || "/assets/images/dashboard-1/welcome-bg.png";
  const rightHref = dashboardTopAd?.redirect_url;
  const rightAlt = dashboardTopAd?.title || "";

  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
  }, [selectedAds.length]);

  const next = useCallback(() => {
    if (animating) return;
    setActiveIndex((prev) => (prev === selectedAds.length - 1 ? 0 : prev + 1));
  }, [animating, selectedAds.length]);

  const previous = useCallback(() => {
    if (animating) return;
    setActiveIndex((prev) => (prev === 0 ? selectedAds.length - 1 : prev - 1));
  }, [animating, selectedAds.length]);

  useEffect(() => {
    if (!hasCarousel) return;
    const id = window.setInterval(() => {
      next();
    }, 5000);
    return () => window.clearInterval(id);
  }, [hasCarousel, next]);

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

        {hasCarousel ? (
          <div
            className="welcomeCardRight welcomeAdCarousel"
            aria-label="Advertisements"
          >
            <Carousel
              activeIndex={activeIndex}
              next={next}
              previous={previous}
              interval={false}
            >
              {selectedAds.map((ad, idx) => {
                const slideAlt = ad?.title || "";
                const slideSrc = ad?.image || rightImageSrc;
                const slideHref = ad?.redirect_url;
                const key = ad?.alias || ad?.image || String(idx);

                const slideContent = (
                  <div className="welcomeAdSlide">
                    <Image
                      src={slideSrc}
                      alt={slideAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 240px"
                      className="welcomeRightImage"
                      priority={idx === 0}
                    />
                  </div>
                );

                return (
                  <CarouselItem
                    key={key}
                    onExiting={() => setAnimating(true)}
                    onExited={() => setAnimating(false)}
                  >
                    {slideHref ? (
                      <a
                        className="welcomeAdSlideLink"
                        href={slideHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={slideAlt || "Advertisement"}
                      >
                        {slideContent}
                      </a>
                    ) : (
                      slideContent
                    )}
                  </CarouselItem>
                );
              })}
            </Carousel>
          </div>
        ) : rightHref ? (
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
