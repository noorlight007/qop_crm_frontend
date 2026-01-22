"use client";

import { useAppSelector } from "@/Redux/Hooks";
import {
  useGetAppranceQuery,
  useGetPublicAppranceQuery,
} from "@/Redux/Reducers/Appearance/AppearanceApi";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const DynamicFavicon = () => {
  const { data: session } = useSession();

  // Get cached favicon from Redux
  const cachedFavIcon = useAppSelector((state) => state.appearance.favIcon);

  // Always fetch public appearance to ensure cache is populated
  const { data: publicAppearance } = useGetPublicAppranceQuery(undefined);

  // Authenticated appearance (only if logged in)
  const { data: privateAppearance } = useGetAppranceQuery(undefined, {
    skip: !session?.user,
  });

  const appearanceData = privateAppearance || publicAppearance;

  useEffect(() => {
    // Use cached favicon if available (from localStorage/Redux)
    // Otherwise use API data
    const favIconUrl = cachedFavIcon || appearanceData?.fav_icon;

    if (!favIconUrl) return;

    // Update all favicon link tags
    const faviconLink = document.querySelector(
      "link[rel='icon']",
    ) as HTMLLinkElement;
    const shortcutLink = document.querySelector(
      "link[rel='shortcut icon']",
    ) as HTMLLinkElement;
    const appleTouchLink = document.querySelector(
      "link[rel='apple-touch-icon']",
    ) as HTMLLinkElement;

    if (faviconLink) faviconLink.href = favIconUrl;
    if (shortcutLink) shortcutLink.href = favIconUrl;
    if (appleTouchLink) appleTouchLink.href = favIconUrl;

    // Also update any link with rel="apple-touch-icon-precomposed"
    const applePrecomposedLink = document.querySelector(
      "link[rel='apple-touch-icon-precomposed']",
    ) as HTMLLinkElement;
    if (applePrecomposedLink) applePrecomposedLink.href = favIconUrl;
  }, [cachedFavIcon, appearanceData]);

  return null; // This component doesn't render anything
};

export default DynamicFavicon;
