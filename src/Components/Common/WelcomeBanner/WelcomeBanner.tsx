import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import { useGetPublicAppranceQuery } from "@/Redux/Reducers/Appearance/AppearanceApi";
import {
  useGetAdsQuery,
  useLazyGetAdClickCountQuery,
  useLazyGetAdImpressionCountQuery,
} from "@/Redux/Reducers/Common/Ads/AdsApi";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import { FaNetworkWired } from "react-icons/fa";
import { TbBuildingSkyscraper } from "react-icons/tb";
import { Card } from "reactstrap";

type AdItem = {
  alias?: string;
  title?: string;
  image?: string;
  redirect_url?: string;
  placement?: string;
};

const WelcomeBanner: React.FC = () => {
  const { data: session } = useSession();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [isSliding, setIsSliding] = useState(false);
  const [slideOffsetPct, setSlideOffsetPct] = useState(0);
  const [slideTransitionEnabled, setSlideTransitionEnabled] = useState(false);
  const [slidePair, setSlidePair] = useState<[number, number]>([0, 0]);
  const slideTimeoutRef = useRef<number | null>(null);
  const [trackAdClick] = useLazyGetAdClickCountQuery();
  const [trackAdImpression] = useLazyGetAdImpressionCountQuery();
  const hasTrackedImpressionRef = useRef(false);
  const { data: appearanceData, isLoading } =
    useGetPublicAppranceQuery(undefined);
  const { data: adsData, isLoading: isAdsLoading } = useGetAdsQuery(undefined);

  const adsList: AdItem[] = useMemo(() => {
    const raw = adsData as any;
    if (Array.isArray(raw)) return raw as AdItem[];
    if (Array.isArray(raw?.results)) return raw.results as AdItem[];
    return [];
  }, [adsData]);

  // Filter ads by placement position
  const dashboardAds = useMemo(() => {
    return adsList.filter(
      (ad) => ad?.placement === "DASHBOARD_TOP" && Boolean(ad?.image),
    );
  }, [adsList]);

  const FALLBACK_IMAGE_SRC = "/assets/images/dashboard-1/welcome-bg.png";
  const SLIDE_DURATION_MS = 360;
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});

  const getAdImageSrc = (index: number) => {
    return dashboardAds[index]?.image || FALLBACK_IMAGE_SRC;
  };

  const isSlideItemLoaded = (index: number) => !!imageLoaded[index];
  const markImageLoaded = (index: number) => {
    setImageLoaded((prev) => ({ ...prev, [index]: true }));
  };

  const getAdAlt = (index: number) => {
    return dashboardAds[index]?.title || "";
  };

  const startSlideToIndex = (toIndex: number, direction: "next" | "prev") => {
    if (dashboardAds.length === 0) return;
    if (isSliding || toIndex === currentAdIndex) return;

    if (slideTimeoutRef.current) {
      window.clearTimeout(slideTimeoutRef.current);
      slideTimeoutRef.current = null;
    }

    setIsSliding(true);

    if (direction === "next") {
      setSlidePair([currentAdIndex, toIndex]);
      setSlideTransitionEnabled(false);
      setSlideOffsetPct(0);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setSlideTransitionEnabled(true);
          setSlideOffsetPct(-50);
        });
      });
    } else {
      setSlidePair([toIndex, currentAdIndex]);
      setSlideTransitionEnabled(false);
      setSlideOffsetPct(-50);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setSlideTransitionEnabled(true);
          setSlideOffsetPct(0);
        });
      });
    }

    slideTimeoutRef.current = window.setTimeout(() => {
      setCurrentAdIndex(toIndex);
      setSlideTransitionEnabled(false);
      setSlideOffsetPct(0);
      setSlidePair([toIndex, toIndex]);
      setIsSliding(false);
      slideTimeoutRef.current = null;
    }, SLIDE_DURATION_MS);
  };

  useEffect(() => {
    if (!isSliding) {
      setSlidePair([currentAdIndex, currentAdIndex]);
      setSlideTransitionEnabled(false);
      setSlideOffsetPct(0);
    }
  }, [currentAdIndex, isSliding]);

  useEffect(() => {
    return () => {
      if (slideTimeoutRef.current) {
        window.clearTimeout(slideTimeoutRef.current);
      }
    };
  }, []);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (!autoPlayEnabled || dashboardAds.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (currentAdIndex + 1) % dashboardAds.length;
      startSlideToIndex(nextIndex, "next");
    }, 5000);

    return () => clearInterval(interval);
  }, [dashboardAds.length, autoPlayEnabled, currentAdIndex, isSliding]);

  const currentAd = dashboardAds[currentAdIndex] || dashboardAds[0];

  const goToPrevious = () => {
    const nextIndex =
      (currentAdIndex - 1 + dashboardAds.length) % dashboardAds.length;
    startSlideToIndex(nextIndex, "prev");
    setAutoPlayEnabled(false);
  };

  const goToNext = () => {
    const nextIndex = (currentAdIndex + 1) % dashboardAds.length;
    startSlideToIndex(nextIndex, "next");
    setAutoPlayEnabled(false);
  };

  const goToSlide = (index: number) => {
    const direction = index > currentAdIndex ? "next" : "prev";
    startSlideToIndex(index, direction);
    setAutoPlayEnabled(false);
  };

  const isNetwork = Boolean(appearanceData?.is_network);
  const heading = isNetwork
    ? appearanceData?.network
    : appearanceData?.organisation;

  const rightHref = currentAd?.redirect_url;
  const rightAlt = currentAd?.title || "";
  const rightAlias = currentAd?.alias;

  // Track an impression once when the banner loads with a valid ad.
  useEffect(() => {
    if (hasTrackedImpressionRef.current) return;
    if (isLoading || isAdsLoading) return;
    if (!rightAlias) return;

    hasTrackedImpressionRef.current = true;
    void trackAdImpression(rightAlias);
  }, [isLoading, isAdsLoading, rightAlias, trackAdImpression]);

  if (isLoading || isAdsLoading) {
    return (
      <div className="py-3">
        <div className="placeholder-glow">
          <span
            className="placeholder col-12 rounded"
            style={{ height: 160 }}
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
            onMouseEnter={() => setAutoPlayEnabled(false)}
            onMouseLeave={() => setAutoPlayEnabled(true)}
            onClick={(e) => {
              // Don't count carousel controls/dots as an ad click
              const target = e.target as HTMLElement | null;
              if (target?.closest("button")) return;

              if (rightAlias) {
                // fire-and-forget; navigation continues in a new tab
                void trackAdClick(rightAlias);
              }
            }}
          >
            <div className="welcomeSlideViewport" aria-hidden="true">
              <div
                className={`welcomeSlideTrack ${
                  slideTransitionEnabled ? "" : "noTransition"
                }`}
                style={{ transform: `translateX(${slideOffsetPct}%)` }}
              >
                {slidePair.map((adIndex, i) => {
                  const isLoaded = isSlideItemLoaded(adIndex);
                  return (
                    <div
                      className="welcomeSlideItem"
                      key={`${adIndex}-${i}`}
                      style={{
                        position: "relative",
                        width: "100%",
                        minHeight: "100%",
                      }}
                    >
                      {!isLoaded && (
                        <div
                          className="welcomeImageLoader"
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(255,255,255,0.85)",
                            zIndex: 1,
                          }}
                        >
                          <LoadingGrow />
                        </div>
                      )}
                      <img
                        src={getAdImageSrc(adIndex)}
                        alt={getAdAlt(adIndex)}
                        className="welcomeRightImage"
                        onLoad={() => markImageLoaded(adIndex)}
                        onError={(e) => {
                          const image = e.currentTarget;
                          image.onerror = null;
                          image.src = FALLBACK_IMAGE_SRC;
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          opacity: isLoaded ? 1 : 0,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            {dashboardAds.length > 1 && (
              <>
                <button
                  className="welcomeCarouselBtn welcomeCarouselBtnPrev"
                  onClick={(e) => {
                    e.preventDefault();
                    goToPrevious();
                  }}
                  aria-label="Previous ad"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className="welcomeCarouselBtn welcomeCarouselBtnNext"
                  onClick={(e) => {
                    e.preventDefault();
                    goToNext();
                  }}
                  aria-label="Next ad"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="welcomeCarouselDots">
                  {dashboardAds.map((_, index) => (
                    <button
                      key={index}
                      className={`welcomeDot ${
                        index === currentAdIndex ? "active" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        goToSlide(index);
                      }}
                      aria-label={`Go to ad ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </a>
        ) : (
          <div
            className="welcomeCardRight"
            aria-hidden="true"
            onMouseEnter={() => setAutoPlayEnabled(false)}
            onMouseLeave={() => setAutoPlayEnabled(true)}
          >
            <div className="welcomeSlideViewport" aria-hidden="true">
              <div
                className={`welcomeSlideTrack ${
                  slideTransitionEnabled ? "" : "noTransition"
                }`}
                style={{ transform: `translateX(${slideOffsetPct}%)` }}
              >
                {slidePair.map((adIndex, i) => {
                  const isLoaded = isSlideItemLoaded(adIndex);
                  return (
                    <div
                      className="welcomeSlideItem"
                      key={`${adIndex}-${i}`}
                      style={{
                        position: "relative",
                        width: "100%",
                        minHeight: "100%",
                      }}
                    >
                      {!isLoaded && (
                        <div
                          className="welcomeImageLoader"
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(255,255,255,0.85)",
                            zIndex: 1,
                          }}
                        >
                          <LoadingGrow />
                        </div>
                      )}
                      <img
                        src={getAdImageSrc(adIndex)}
                        alt={getAdAlt(adIndex)}
                        className="welcomeRightImage"
                        onLoad={() => markImageLoaded(adIndex)}
                        onError={(e) => {
                          const image = e.currentTarget;
                          image.onerror = null;
                          image.src = FALLBACK_IMAGE_SRC;
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          opacity: isLoaded ? 1 : 0,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            {dashboardAds.length > 1 && (
              <>
                <button
                  className="welcomeCarouselBtn welcomeCarouselBtnPrev"
                  onClick={() => goToPrevious()}
                  aria-label="Previous ad"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className="welcomeCarouselBtn welcomeCarouselBtnNext"
                  onClick={() => goToNext()}
                  aria-label="Next ad"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="welcomeCarouselDots">
                  {dashboardAds.map((_, index) => (
                    <button
                      key={index}
                      className={`welcomeDot ${
                        index === currentAdIndex ? "active" : ""
                      }`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to ad ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default WelcomeBanner;
