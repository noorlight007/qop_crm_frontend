"use client";
import { FunctionComponent, useEffect, useState } from "react";

const OrganisationDirectorSingleCaseAlias = () => {
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (
          await import("@/Components/Organisation/Director/Cases/Cases/[CaseAlias]")
        ).default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default OrganisationDirectorSingleCaseAlias;
