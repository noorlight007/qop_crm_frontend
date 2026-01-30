import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container } from "reactstrap";
import AddNewComment from "./AddNewComment/AddNewComment";
import CommentCards from "./CommentCards/CommentCards";
import InternalComments from "./InternalComments/InternalComments";
import SearchAndFilters from "./SearchAndFilters/SearchAndFilters";

const OrganisationAdminCommentsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Comments"
        subTitle="Welcome back to your Comments dashboard"
        child="Comments"
      />
      <Container fluid>
        <InternalComments />
        <AddNewComment />
        <SearchAndFilters />
        <CommentCards />
      </Container>
    </>
  );
};

export default OrganisationAdminCommentsContainer;
