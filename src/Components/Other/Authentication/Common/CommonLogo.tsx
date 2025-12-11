import { ImagePath } from "@/Constant";
import { LoginFormProp } from "@/Types/PagesType";
import { getDashboardHomeUrl } from "@/utils/RedirectPaths";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

export const CommonLogo: React.FC<LoginFormProp> = ({ logoClass }) => {
  const { data: session } = useSession();
  return (
    <a className={`logo ${logoClass}`} href={getDashboardHomeUrl(session)}>
      <Image
        width={91}
        height={27}
        className="img-fluid for-light"
        src={`${ImagePath}/logo/logo1.png`}
        alt="looginpage"
      />
      <Image
        width={91}
        height={27}
        className="img-fluid for-dark"
        src={`${ImagePath}/logo/logo-dark.png`}
        alt="looginpage"
      />
    </a>
  );
};
