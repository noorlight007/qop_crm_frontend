"use client";
import { FunctionComponent, useEffect, useState } from "react";

const SuperAdminOrganisationCaseDetailsPage = () => {
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (
          await import("@/Components/SuperAdmin/Organisations/[OrganisationSlug]/Tabs/Cases/[CaseAlias]")
        ).default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default SuperAdminOrganisationCaseDetailsPage;
