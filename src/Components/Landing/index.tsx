import { Container } from "reactstrap";
import UnderDevelopment from "../Other/UnderDevelopment/UnderDevelopment";
import LandingFooter from "./Components/Footer/LandingFooter";
import NavBar from "./Components/NavBar/NavBar";
import "./LandingPageStyle.css";
import TapTop from "@/Layout/TapTop";

const LandingContainer: React.FC = () => {
  return (
    <>
      <NavBar />
      <main>
        <Container fluid>
          <UnderDevelopment />
        </Container>
      </main>
      <LandingFooter />
      <TapTop/>
    </>
  );
};

export default LandingContainer;
