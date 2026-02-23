"use client";
import { FunctionComponent, useEffect, useState } from "react";

const ClientSurveyResubmittedPage = () => {
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (
          await import("@/Components/Common/ClientSurvey/ClientSurveyResubmitted")
        ).default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default ClientSurveyResubmittedPage;
