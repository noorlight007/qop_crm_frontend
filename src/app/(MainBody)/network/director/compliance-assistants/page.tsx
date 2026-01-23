"use client";
import { FunctionComponent, useEffect, useState } from "react";

const NetworkComplianceAssistant = () => {
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (
          await import("@/Components/General/Dashboard/Network/Director/Users/ComplianceAssistant")
        ).default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default NetworkComplianceAssistant;
