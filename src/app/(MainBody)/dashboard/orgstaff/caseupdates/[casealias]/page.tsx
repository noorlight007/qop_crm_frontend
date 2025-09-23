"use client";
import { FunctionComponent, useEffect, useState } from "react";

const OrgStaffSingleCaseAlias = () => {
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (
          await import(
            "@/Components/General/Dashboard/OrganisationStaff/Caseupdates/[CaseAlias]"
          )
        ).default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default OrgStaffSingleCaseAlias;
