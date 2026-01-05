import { Col, Row } from "reactstrap";
import Breadcrumbs from "../CommonComponents/Breadcrumbs/Breadcrumbs";
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
        <Col xl="4" lg="6" md="6">
          <ThemeColorSwitcher />
        </Col>
      </Row>
    </>
  );
};

export default AppearanceContainer;
