import SVG from "@/CommonComponent/SVG";
import { ImagePath } from "@/Constant";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useGetAppranceQuery } from "@/Redux/Reducers/Appearance/AppearanceApi";
import { setSideBarToggle } from "@/Redux/Reducers/ThemeCustomizerReducer";
import Image from "next/image";

const LogoWrapper = () => {
  const { sideBarToggle } = useAppSelector((state) => state.themeCustomizer);
  const dispatch = useAppDispatch();
  const { data: appearanceData } = useGetAppranceQuery(undefined);
  const logoSrc = appearanceData?.logo || `${ImagePath}/logo/logo1.png`;
  return (
    <div className="logo-wrapper d-flex align-items-center col-auto">
      <Image
        width={120}
        height={60}
        priority
        className="light-logo img-fluid"
        src={logoSrc}
        alt="logo"
        style={{ width: "120px", height: "50px" }}
      />
      <Image
        width={90}
        height={30}
        priority
        className="dark-logo img-fluid"
        src={logoSrc}
        alt="logo"
        style={{ width: "120px", height: "50px" }}
      />
      <a
        className="close-btn toggle-sidebar"
        onClick={() => dispatch(setSideBarToggle(!sideBarToggle))}
      >
        <SVG className="svg-color" iconId="Category" />
      </a>
    </div>
  );
};

export default LogoWrapper;
