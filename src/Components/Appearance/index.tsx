import { Col, Row } from "reactstrap";
import Breadcrumbs from "../Common/Breadcrumbs/Breadcrumbs";
import About from "./Components/About";
import LogoAndFavIconChanger from "./Components/LogoAndFavIconAndFontChanger";
import ThemeColorSwitcher from "./Components/ThemeColorSwitcher";

const AppearanceContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Appearance"
        subTitle="Appearance settings"
        parent="Dashboard"
        child="Appearance"
      />
      <Row>
        <Col xxl="6" xl="12">
          <ThemeColorSwitcher />
        </Col>
        <Col xxl="6" xl="12">
          <LogoAndFavIconChanger />
        </Col>
        <Col>
          <About />
        </Col>
      </Row>
    </>
  );
};

export default AppearanceContainer;
