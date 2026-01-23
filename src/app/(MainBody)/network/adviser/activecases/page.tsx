"use client";
import { FunctionComponent, useEffect, useState } from "react";

const NetworkAdviserActiveCases = () => {
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (
          await import(
            "@/Components/General/Dashboard/Network/Adviser/Cases/ActiveCases"
          )
        ).default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default NetworkAdviserActiveCases;
