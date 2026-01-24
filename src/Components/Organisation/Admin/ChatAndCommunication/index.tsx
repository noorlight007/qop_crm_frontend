import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container } from "reactstrap";
import ChatBoard from "./ChatBoard/ChatBoard";

const OrganisationAdminChatAndCommunicationContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Chat & Communication"
        subTitle="Welcome back to your Chat & Communication dashboard"
        child="Chat & Communication"
      />
      <Container fluid>
        <ChatBoard />
      </Container>
    </>
  );
};

export default OrganisationAdminChatAndCommunicationContainer;
