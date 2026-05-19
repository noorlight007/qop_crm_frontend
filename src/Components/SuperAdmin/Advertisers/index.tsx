import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container } from "reactstrap";
import AdvertiserList from "./AdvertiserList/AdvertiserList";

const AdvertisersContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Advertisers"
        subTitle="Manage your advertisers"
        items={[
          { label: "Home", href: "/" },
          { label: "Advertisers", href: "/super-admin/advertisers" },
        ]}
      />
      <Container fluid>
        <AdvertiserList />
      </Container>
    </>
  );
};

export default AdvertisersContainer;
