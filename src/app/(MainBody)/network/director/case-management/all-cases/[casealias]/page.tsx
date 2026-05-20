"use client";
import { FunctionComponent, useEffect, useState } from "react";

const NetworkDirectorSingleCaseAlias = () => {
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (
          await import("@/Components/Network/Director/CaseManagement/AllCases/[CaseAlias]")
        ).default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default NetworkDirectorSingleCaseAlias;
