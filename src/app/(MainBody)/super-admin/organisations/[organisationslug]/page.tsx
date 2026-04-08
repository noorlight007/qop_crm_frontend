"use client";
import { FunctionComponent, useEffect, useState } from "react";

const SuperAdminOrganisationDetailsPage = () => {
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (
          await import("@/Components/SuperAdmin/Organisations/[OrganisationSlug]")
        ).default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default SuperAdminOrganisationDetailsPage;
