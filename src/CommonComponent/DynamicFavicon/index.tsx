"use client";

import {
  useGetAppranceQuery,
  useGetPublicAppranceQuery,
} from "@/Redux/Reducers/Appearance/AppearanceApi";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const DynamicFavicon = () => {
  const { data: session } = useSession();

  // Fetch appearance for authenticated users
  const { data: privateAppearance } = useGetAppranceQuery(undefined, {
    skip: !session?.user,
  });

  // Fetch public appearance for unauthenticated (e.g., login) pages
  const { data: publicAppearance } = useGetPublicAppranceQuery(undefined, {
    skip: !!session?.user,
  });

  const appearanceData = privateAppearance || publicAppearance;

  useEffect(() => {
    if (appearanceData?.fav_icon) {
      // Update all favicon link tags
      const faviconLink = document.querySelector(
        "link[rel='icon']"
      ) as HTMLLinkElement;
      const shortcutLink = document.querySelector(
        "link[rel='shortcut icon']"
      ) as HTMLLinkElement;
      const appleTouchLink = document.querySelector(
        "link[rel='apple-touch-icon']"
      ) as HTMLLinkElement;

      if (faviconLink) faviconLink.href = appearanceData.fav_icon;
      if (shortcutLink) shortcutLink.href = appearanceData.fav_icon;
      if (appleTouchLink) appleTouchLink.href = appearanceData.fav_icon;

      // Also update any link with rel="apple-touch-icon-precomposed"
      const applePrecomposedLink = document.querySelector(
        "link[rel='apple-touch-icon-precomposed']"
      ) as HTMLLinkElement;
      if (applePrecomposedLink)
        applePrecomposedLink.href = appearanceData.fav_icon;
    }
  }, [appearanceData]);

  return null; // This component doesn't render anything
};

export default DynamicFavicon;
