import { Col } from "reactstrap";
import HeaderRight from "./HeaderRight/HeaderRight";
import LogoWrapper from "./LogoWrapper/LogoWrapper";

const Header = () => {
  return (
    <header className="page-header row">
      <LogoWrapper />
      <Col className="page-main-header">
        <HeaderRight />
      </Col>
    </header>
  );
};

export default Header;
