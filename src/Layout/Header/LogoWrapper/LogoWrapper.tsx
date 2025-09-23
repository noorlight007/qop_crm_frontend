import SVG from "@/CommonComponent/SVG";
import { ImagePath } from "@/Constant";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { setSideBarToggle } from "@/Redux/Reducers/ThemeCustomizerReducer";
import Image from "next/image";

const LogoWrapper = () => {
  const { sideBarToggle } = useAppSelector((state) => state.themeCustomizer);
  const dispatch = useAppDispatch();
  return (
    <div className="logo-wrapper d-flex align-items-center col-auto">
      <Image
        width={120}
        height={60}
        priority
        className="light-logo img-fluid"
        src={`${ImagePath}/logo/logo1.png`}
        alt="logo"
      />
      <Image
        width={90}
        height={30}
        priority
        className="dark-logo img-fluid"
        src={`${ImagePath}/logo/logo-dark.png`}
        alt="logo"
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
