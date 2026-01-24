"use client";
import { FunctionComponent, useEffect, useState } from "react";

const OrganisationDirectorWorkflowsAndIntegrations = () => {
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (
          await import("@/Components/Organisation/Director/ReportsAndTasks/WorkflowsAndIntegrations")
        ).default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default OrganisationDirectorWorkflowsAndIntegrations;
