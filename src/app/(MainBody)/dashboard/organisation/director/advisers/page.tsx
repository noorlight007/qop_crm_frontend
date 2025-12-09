"use client";
import { FunctionComponent, useEffect, useState } from "react";

const OrganisationDirectorAdvisers = () => {
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (
          await import(
            "@/Components/General/Dashboard/Organisation/Director/Users/Advisers"
          )
        ).default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default OrganisationDirectorAdvisers;
