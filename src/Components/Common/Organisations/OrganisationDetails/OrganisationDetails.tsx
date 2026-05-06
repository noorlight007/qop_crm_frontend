import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  useGetSingleOrganisationDashboardDataQuery,
  useGetSingleOrganisationQuery,
} from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/SingleOrganisationApi";
import {
  restoreCustomTab,
  setCustomTab,
} from "@/Redux/Reducers/CustomTabSlice";
import { SingleOrganisationProps } from "@/Types/Common/Organisations/OrganisationsTypes";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import OrgAdminsTab from "./Tabs/Admins/OrgAdminsTab";
import OrgAdvisersTab from "./Tabs/Advisers/OrgAdvisersTab";
import OrgApplicantsTab from "./Tabs/Applicants/OrgApplicantsTab";
import OrgCases from "./Tabs/Cases/OrgCases";
import OrgLendersChart from "./Tabs/Dashboard/Charts/LendersChart/LendersChart";
import OrgMortgagesChart from "./Tabs/Dashboard/Charts/MortgagesChart/MortgagesChart";
import DangerZone from "./Tabs/Dashboard/DangerZone/DangerZone";
import OrganisationDirectorInfo from "./Tabs/Dashboard/OrganisationDirectorInfo/OrganisationDirectorInfo";
import OrganisationProfile from "./Tabs/Dashboard/OrganisationProfile/OrganisationProfile";
import Overview from "./Tabs/Dashboard/Overview/Overview";
import OrgIntroducersTab from "./Tabs/Introducers/OrgIntroducersTab";
import OrgLeadsTab from "./Tabs/Leads/OrgLeadsTab";

const OrganisationDetails: React.FC = () => {
  const [singleOrgInfo, setSingleOrgInfo] = useState<SingleOrganisationProps>();
  const dispatch = useAppDispatch();
  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "cases", label: "Cases" },
    { id: "leads", label: "Leads" },
    { id: "applicants", label: "Applicants" },
    { id: "advisers", label: "Advisers" },
    { id: "admins", label: "Admins" },
    { id: "introducers", label: "Introducers" },
  ];
  const currentTheme = useAppSelector(
    (state) => state.themeCustomizer.mix_background_layout,
  );
  const { organisationslug } = useParams();
  const orgSlug = Array.isArray(organisationslug)
    ? organisationslug[0]
    : organisationslug;
  const router = useRouter();
  const activeTab = useAppSelector((state) => state.customTabs.activeTab);

  // rtk hooks
  const {
    data: singleOrgData,
    isLoading,
    isError,
  } = useGetSingleOrganisationQuery(
    { organisationslug },
    {
      skip: !organisationslug,
    },
  );

  const { data: singleOrgDashboardData, isLoading: isDashboardLoading } =
    useGetSingleOrganisationDashboardDataQuery(
      { organisationslug },
      {
        skip: !organisationslug,
      },
    );

  useEffect(() => {
    if (!isLoading) {
      if (isError || !singleOrgData) {
        router.push("/network/director/organisations");
        toast.error("Find Wrong URL! Redirecting...");
        return;
      }

      if (singleOrgData?.organization?.slug !== organisationslug) {
        router.push("/network/director/organisations");
        toast.error("Find Wrong URL! Redirecting...");
        return;
      }

      setSingleOrgInfo(singleOrgData);
    }
  }, [singleOrgData, organisationslug, router, isLoading, isError]);

  useEffect(() => {
    if (typeof window === "undefined" || !orgSlug) return;
    const savedTab = localStorage.getItem(`customTabActive:${orgSlug}`);
    dispatch(restoreCustomTab(savedTab || "dashboard"));
  }, [dispatch, orgSlug]);

  if (isLoading) {
    return (
      <div className="p-4">
        <LoadingGrow />
      </div>
    );
  }

  if (isError || !singleOrgInfo) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12" className="position-relative">
            <Nav
              pills
              className={`custom-tabs d-flex justify-content-center flex-wrap gap-2 mb-3 position-sticky ${currentTheme === "light" ? "bg-white" : "bg-dark"} rounded-3 p-4 shadow-md`}
              style={{ top: "4rem", zIndex: 20 }}
            >
              {navItems.map((item) => (
                <NavItem key={item.id}>
                  <NavLink
                    active={activeTab === item.id}
                    onClick={() =>
                      dispatch(
                        setCustomTab({
                          tabId: item.id,
                          organisationslug: orgSlug,
                        }),
                      )
                    }
                    className={`${activeTab === item.id ? "bg-primary" : "text-primary border-primary"} px-3 py-2 fs-6`}
                  >
                    {item.label}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>

            <TabContent activeTab={activeTab}>
              <TabPane tabId="dashboard">
                {activeTab === "dashboard" && (
                  <>
                    <Row>
                      <Col lg="6" md="12">
                        <OrganisationProfile
                          singleOrgInfo={singleOrgInfo}
                          singleOrgDashboardData={singleOrgDashboardData}
                          isLoading={isLoading}
                          isDashboardLoading={isDashboardLoading}
                        />
                      </Col>
                      <Col lg="6" md="12">
                        <OrganisationDirectorInfo
                          singleOrgInfo={singleOrgInfo}
                          isLoading={isLoading}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6" md="12">
                        <OrgMortgagesChart
                          singleOrgInfo={singleOrgInfo}
                          singleOrgDashboardData={singleOrgDashboardData}
                          isLoading={isLoading}
                          isDashboardLoading={isDashboardLoading}
                        />
                      </Col>
                      <Col lg="6" md="12">
                        <OrgLendersChart
                          singleOrgInfo={singleOrgInfo}
                          singleOrgDashboardData={singleOrgDashboardData}
                          isLoading={isLoading}
                          isDashboardLoading={isDashboardLoading}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <Overview
                          singleOrgInfo={singleOrgInfo}
                          singleOrgDashboardData={singleOrgDashboardData}
                          isLoading={isLoading}
                          isDashboardLoading={isDashboardLoading}
                        />
                      </Col>
                      <Col md="12">
                        <DangerZone singleOrgInfo={singleOrgInfo} />
                      </Col>
                    </Row>
                  </>
                )}
              </TabPane>

              <TabPane tabId="cases">
                {activeTab === "cases" && <OrgCases />}
              </TabPane>
              <TabPane tabId="leads">
                {activeTab === "leads" && <OrgLeadsTab />}
              </TabPane>
              <TabPane tabId="applicants">
                {activeTab === "applicants" && <OrgApplicantsTab />}
              </TabPane>
              <TabPane tabId="advisers">
                {activeTab === "advisers" && <OrgAdvisersTab />}
              </TabPane>
              <TabPane tabId="admins">
                {activeTab === "admins" && <OrgAdminsTab />}
              </TabPane>
              <TabPane tabId="introducers">
                {activeTab === "introducers" && <OrgIntroducersTab />}
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default OrganisationDetails;
