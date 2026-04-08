"use client";
import { FunctionComponent, useEffect, useState } from "react";

const AdminNetworkDetailsPage = () => {
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (await import("@/Components/Admin/Networks/[NetworkSlug]"))
          .default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default AdminNetworkDetailsPage;
