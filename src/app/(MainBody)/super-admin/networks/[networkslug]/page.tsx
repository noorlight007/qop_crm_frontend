"use client";
import { FunctionComponent, useEffect, useState } from "react";

const SuperAdminNetworkDetailsPage = () => {
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (await import("@/Components/SuperAdmin/Networks/[NetworkSlug]"))
          .default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default SuperAdminNetworkDetailsPage;
