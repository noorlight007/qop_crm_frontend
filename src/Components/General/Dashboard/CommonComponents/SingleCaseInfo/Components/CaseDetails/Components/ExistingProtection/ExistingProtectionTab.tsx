import LoadingSpinner from "@/app/loading";
import { useGetExistingProtectionDetailsQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/ExistingProtection/ExistingProtectionDetailsApi";
import { ExistingProtectionDetailsProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/ExistingProtectionTypes";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import ExistingProtectionContent from "./ExistingProtectionContent";

const ExistingProtectionTab: React.FC = () => {
  const [activeUser, setActiveUser] = useState<number | null>(null); // State for active user
  const [activeTab, setActiveTab] = useState<string | null>(null); // State for active existingProtection tab

  // Get case alias from URL params
  const params = useParams();
  const { casealias } = params;

  // Fetch data
  const { data: existingProtectionDetails, isLoading } =
    useGetExistingProtectionDetailsQuery({
      case_alias: casealias,
    });

  // Add this function after groupByUserId
  // Calculate sum assured for each user
  const calculateUserSumAssured = (
    existingProtections: ExistingProtectionDetailsProps[]
  ) => {
    const userSums = existingProtections.reduce((acc, existingProtection) => {
      const userId = existingProtection.user.id;
      // Convert to number and handle null/undefined
      const sumAssured = Number(existingProtection.sum_assured) || 0;

      if (!acc[userId]) {
        acc[userId] = {
          total: 0,
          name: `${existingProtection.user.first_name} ${existingProtection.user.last_name}`,
        };
      }
      // Add the current existingProtection's sum_assured to the user's total
      acc[userId].total = acc[userId].total + sumAssured;
      return acc;
    }, {} as Record<number, { total: number; name: string }>);

    return userSums;
  };

  // Get all user sums
  const userSumAssured = calculateUserSumAssured(
    existingProtectionDetails || []
  );

  // Set the first user and their first existingProtection as default when data is fetched
  useEffect(() => {
    if (existingProtectionDetails && existingProtectionDetails.length > 0) {
      const firstUserId = existingProtectionDetails[0]?.user.id;
      setActiveUser(firstUserId);
      setActiveTab(existingProtectionDetails[0]?.alias || null);
    }
  }, [existingProtectionDetails]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Col xxl="12" className="px-5">
      <Card>
        <CardBody>
          {/* Outer Navigation Tabs (Users) */}
          <CardHeader className="d-flex justify-content-center align-items-center flex-wrap gap-2 pb-2 p-0">
            <Nav
              className="nav-warning d-flex flex-wrap gap-2 justify-content-center"
              pills
            >
              {existingProtectionDetails?.map(
                (existingProtection: ExistingProtectionDetailsProps) => {
                  const user = existingProtection.user;
                  return (
                    <NavItem key={user.id}>
                      <NavLink
                        className={`${activeUser === user.id ? "active" : ""}`}
                        onClick={() => {
                          setActiveUser(user.id);
                          setActiveTab(existingProtection.alias || null);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {`${
                          user.title
                            ? user?.title[0].toUpperCase() +
                              user?.title.slice(1).toLowerCase() +
                              ""
                            : ""
                        } ${user.first_name} ${user.middle_name} ${
                          user.last_name
                        } (£${
                          userSumAssured[user.id]?.total
                            ? parseFloat(
                                userSumAssured[user.id].total.toString()
                              ).toLocaleString("en-GB", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                                useGrouping: true,
                              })
                            : "0.00"
                        })`}
                      </NavLink>
                    </NavItem>
                  );
                }
              )}
            </Nav>
          </CardHeader>

          {/* Inner Navigation Tabs (Properties for the selected user) */}
          {activeUser && (
            <CardHeader className="d-flex justify-content-center align-items-center flex-wrap gap-3 pt-3 pb-0">
              <Nav
                tabs
                className="border-tab mb-0 d-flex flex-wrap gap-2 justify-content-center"
              >
                {existingProtectionDetails
                  ?.filter(
                    (ep: ExistingProtectionDetailsProps) =>
                      ep.user.id === activeUser
                  )
                  .map(
                    (
                      existingProtection: ExistingProtectionDetailsProps,
                      index: number
                    ) => (
                      <NavItem key={existingProtection.alias}>
                        <NavLink
                          className={`nav-border text-info tab-info ${
                            activeTab === existingProtection.alias
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setActiveTab(existingProtection.alias || null)
                          }
                          style={{ cursor: "pointer", fontSize: "0.7rem" }}
                        >
                          Security {index + 1}
                        </NavLink>
                      </NavItem>
                    )
                  )}
              </Nav>
            </CardHeader>
          )}

          {/* Tab Content */}
          {activeTab && activeUser && (
            <ExistingProtectionContent
              activeTab={activeTab}
              activeUser={activeUser}
              groupedData={
                existingProtectionDetails?.reduce(
                  (
                    acc: Record<number, ExistingProtectionDetailsProps[]>,
                    ep: ExistingProtectionDetailsProps
                  ) => {
                    if (!acc[ep.user.id]) {
                      acc[ep.user.id] = [];
                    }
                    acc[ep.user.id].push(ep);
                    return acc;
                  },
                  {} as Record<number, ExistingProtectionDetailsProps[]>
                ) || {}
              }
            />
          )}
        </CardBody>
      </Card>
    </Col>
  );
};

export default ExistingProtectionTab;
