import { Col, Row } from "reactstrap";
import Breadcrumbs from "../Common/Breadcrumbs/Breadcrumbs";
import About from "./Components/About/About";
import Address from "./Components/Address/Address";
import ThemeColorSwitcher from "./Components/ColorSwitcher/ThemeColorSwitcher";
import ContactInfo from "./Components/ContactInfo/ContactInfo";
import LogoAndFavIconChanger from "./Components/LogoFavIconAndFont/LogoAndFavIconAndFontChanger";

const AppearanceContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Appearance"
        subTitle="Appearance settings"
        items={[{ label: "Appearance", active: true }]}
      />
      <Row>
        <Col xxl="6" xl="12">
          <ThemeColorSwitcher />
        </Col>
        <Col xxl="6" xl="12">
          <LogoAndFavIconChanger />
        </Col>
        <Col md="12">
          <About />
        </Col>
        <Col md="12">
          <ContactInfo />
        </Col>
        <Col md="12">
          <Address />
        </Col>
      </Row>
    </>
  );
};

export default AppearanceContainer;
