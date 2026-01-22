"use client";

import { useAppSelector } from "@/Redux/Hooks";
import {
  useGetAppranceQuery,
  useGetPublicAppranceQuery,
} from "@/Redux/Reducers/Appearance/AppearanceApi";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

type DynamicTitleProps = {
  pageTitle?: string;
};

const DynamicTitle = ({ pageTitle }: DynamicTitleProps) => {
  const { data: session } = useSession();

  // Get cached site title from Redux
  const cachedSiteTitle = useAppSelector((state) => state.appearance.siteTitle);

  // Always fetch public appearance to ensure cache is populated
  const { data: publicAppearance } = useGetPublicAppranceQuery(undefined);

  // Authenticated appearance (only if logged in)
  const { data: privateAppearance } = useGetAppranceQuery(undefined, {
    skip: !session?.user,
  });

  const appearanceData = privateAppearance || publicAppearance;

  useEffect(() => {
    // Use cached site title if available (from localStorage/Redux)
    // Otherwise use API data
    const baseTitle =
      cachedSiteTitle ||
      (appearanceData as any)?.site_title ||
      (appearanceData as any)?.app_name;

    if (!baseTitle) return;

    if (pageTitle) {
      document.title = `${pageTitle} | ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
  }, [cachedSiteTitle, appearanceData, pageTitle]);

  return null;
};

export default DynamicTitle;
