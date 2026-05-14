import { Col, Row } from "reactstrap";
import Breadcrumbs from "../Common/Breadcrumbs/Breadcrumbs";
import ThemeColorSwitcher from "./Components/ColorSwitcher/ThemeColorSwitcher";
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
      </Row>
    </>
  );
};

export default AppearanceContainer;
