import LoadingSpinner from "@/app/loading";
import { useGetEmploymentDetailsQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/EmploymentDetails/EmploymentDetailsApi";
import { EmploymentDetailsProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/EmploymentTypes";
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
import { EmploymentTabContent } from "./EmploymentTabContent";

export const EmploymentTab = () => {
  // State for active user, active tab, and employment data
  const [activeUser, setActiveUser] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // UseParams with type assertion
  const params = useParams();
  const { casealias } = params;

  // Fetch employment details
  const { data: employmentData, isLoading: isEmploymentDetailLoading } =
    useGetEmploymentDetailsQuery({ case_alias: casealias });

  // Set the first user and their first employment record as default when data is fetched
  useEffect(() => {
    if (employmentData && employmentData.length > 0) {
      const firstUserId = employmentData[0]?.user.id;
      setActiveUser(firstUserId);
      setActiveTab(employmentData[0]?.alias || null);
    }
  }, [employmentData]);

  if (isEmploymentDetailLoading) return <LoadingSpinner />;

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
              {employmentData?.map((employment: EmploymentDetailsProps) => {
                const user = employment.user;
                return (
                  <NavItem key={user.id}>
                    <NavLink
                      className={`${activeUser === user.id ? "active" : ""}`}
                      onClick={() => {
                        setActiveUser(user.id);
                        setActiveTab(employment.alias || null);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {`${
                        user?.title
                          ? user?.title[0].toUpperCase() +
                            user?.title.slice(1).toLowerCase() +
                            ""
                          : ""
                      } ${user.first_name} ${user.middle_name} ${
                        user.last_name
                      }`}
                    </NavLink>
                  </NavItem>
                );
              })}
            </Nav>
          </CardHeader>
          {/* Inner Navigation Tabs (Employment Records) */}
          {activeUser && (
            <CardHeader className=" d-flex justify-content-center align-items-center flex-wrap gap-3 pt-3 pb-0">
              <Nav
                tabs
                className="border-tab mb-0 d-flex flex-wrap gap-2 justify-content-center"
              >
                {employmentData
                  ?.filter(
                    (emp: EmploymentDetailsProps) => emp.user.id === activeUser
                  )
                  .map((employment: EmploymentDetailsProps) => (
                    <NavItem key={employment.alias}>
                      <NavLink
                        className={`nav-border text-info tab-info ${
                          activeTab === employment.alias ? "active" : ""
                        }`}
                        onClick={() => setActiveTab(employment.alias || null)}
                        style={{ cursor: "pointer", fontSize: "0.7rem" }}
                      >
                        {employment?.employment_status
                          ? (() => {
                              const label =
                                employment.employment_status.replace(/_/g, " ");
                              return label
                                .toLowerCase()
                                .split(" ")
                                .map(
                                  (word: string) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ");
                            })()
                          : "(N/A)"}
                      </NavLink>
                    </NavItem>
                  ))}
              </Nav>
            </CardHeader>
          )}

          {/* Tab Content */}
          {activeTab && activeUser && (
            <EmploymentTabContent
              activeTab={activeTab}
              activeUser={activeUser}
              groupedData={
                employmentData?.reduce(
                  (
                    acc: Record<number, EmploymentDetailsProps[]>,
                    emp: EmploymentDetailsProps
                  ) => {
                    if (!acc[emp.user.id]) {
                      acc[emp.user.id] = [];
                    }
                    acc[emp.user.id].push(emp);
                    return acc;
                  },
                  {} as Record<number, EmploymentDetailsProps[]>
                ) || {}
              }
            />
          )}
        </CardBody>
      </Card>
    </Col>
  );
};
