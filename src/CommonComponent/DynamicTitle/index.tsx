"use client";

import { useGetAppranceQuery } from "@/Redux/Reducers/Appearance/AppearanceApi";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

type DynamicTitleProps = {
  pageTitle?: string;
};

const DynamicTitle = ({ pageTitle }: DynamicTitleProps) => {
  const { data: session } = useSession();
  const { data: appearanceData } = useGetAppranceQuery(undefined, {
    skip: !session?.user,
  });

  useEffect(() => {
    const baseTitle =
      (appearanceData as any)?.site_title ||
      (appearanceData as any)?.app_name ||
      "QOP CRM";

    if (!baseTitle && !pageTitle) return;

    if (pageTitle) {
      document.title = `${pageTitle} | ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
  }, [appearanceData, pageTitle]);

  return null;
};

export default DynamicTitle;
