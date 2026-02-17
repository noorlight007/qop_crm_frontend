"use client";
import { FunctionComponent, useEffect, useState } from "react";

const ClientSurveySubmittedPage = () => {
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (
          await import("@/Components/Common/ClientSurvey/ClientSurveySubmitted")
        ).default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default ClientSurveySubmittedPage;
