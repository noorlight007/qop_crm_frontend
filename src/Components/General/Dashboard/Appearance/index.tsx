import { Col, Row } from "reactstrap";
import Breadcrumbs from "../CommonComponents/Breadcrumbs/Breadcrumbs";
import LogoChanger from "./Components/LogoChanger";
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
        <Col lg="6" md="6">
          <ThemeColorSwitcher />
        </Col>
        <Col lg="6" md="6">
          <LogoChanger />
        </Col>
      </Row>
    </>
  );
};

export default AppearanceContainer;
