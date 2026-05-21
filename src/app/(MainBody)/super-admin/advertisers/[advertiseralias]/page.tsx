"use client";
import { FunctionComponent, useEffect, useState } from "react";

const AdvertiserDetailsPage = () => {
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (
          await import("@/Components/SuperAdmin/Advertisers/AdvertiserList/AdvertiserDetails")
        ).default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default AdvertiserDetailsPage;
