import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import OrganisationList from "@/Components/Common/Organisations/OrganisationList/OrganisationList";
import WelcomeBanner from "@/Components/Common/WelcomeBanner/WelcomeBanner";
import { useGetNetworkDirectorDashboardQuery } from "@/Redux/Reducers/Organisation/Director/Dashboard/DashdoardApi";
import { Container } from "reactstrap";
import AdviserStatus from "./AdviserStatus/AdviserStatus";
import Charts from "./Charts/Charts";
import PerformanceOverview from "./PerformanceOverview/PerformanceOverview";

const ContainerNetworkDirector = () => {
  //RTK hooks
  const { data: networkDirectorDashboardData, isLoading } =
    useGetNetworkDirectorDashboardQuery(undefined);

  return (
    <>
      <Breadcrumbs
        title="Dashboard"
        subTitle="Welcome to the Network Dashboard"
        items={[{ label: "Dashboard", active: true }]}
      />
      <Container fluid>
        <WelcomeBanner />
        <PerformanceOverview
          isLoading={isLoading}
          networkDirectorDashboardData={networkDirectorDashboardData}
        />
        <Charts
          isLoading={isLoading}
          networkDirectorDashboardData={networkDirectorDashboardData}
        />
        <OrganisationList maxItems={8} />
        <AdviserStatus
          isLoading={isLoading}
          networkDirectorDashboardData={networkDirectorDashboardData}
        />
      </Container>
    </>
  );
};

export default ContainerNetworkDirector;
