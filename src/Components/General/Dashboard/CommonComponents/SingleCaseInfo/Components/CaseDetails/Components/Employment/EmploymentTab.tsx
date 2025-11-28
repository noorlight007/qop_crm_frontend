import LoadingSpinner from "@/app/loading";
import {
  useDeleteEmploymentDetailsMutation,
  useGetEmploymentDetailsQuery,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/EmploymentDetails/EmploymentDetailsApi";
import { EmploymentDetailsProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/EmploymentTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  Button,
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

  // Delete mutation hook
  const [deleteEmployment, { isLoading: isDeleting }] =
    useDeleteEmploymentDetailsMutation();

  const handleDelete = async (
    e: React.MouseEvent,
    employmentAlias: string | undefined,
    userId: number
  ) => {
    e.stopPropagation();
    if (!employmentAlias) return;
    const ok = window.confirm(
      "Are you sure you want to delete this employment record?"
    );
    if (!ok) return;

    try {
      await deleteEmployment({
        case_alias: casealias,
        employmentDetails_alias: employmentAlias,
      }).unwrap?.();
      toast.success("Deleted successfully.");
      // Optimistically pick a new active tab for this user if possible
      const remainingForUser = (employmentData || []).filter(
        (emp: any) => emp.user.id === userId && emp.alias !== employmentAlias
      );

      if (remainingForUser.length > 0) {
        setActiveTab(remainingForUser[0].alias || null);
      } else {
        // If no remaining for this user, pick any other employment record if available
        const remainingAny = (employmentData || []).filter(
          (emp: any) => emp.alias !== employmentAlias
        );
        if (remainingAny.length > 0) {
          setActiveUser(remainingAny[0].user.id);
          setActiveTab(remainingAny[0].alias || null);
        } else {
          setActiveTab(null);
          setActiveUser(null);
        }
      }
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete employment record.");
    }
  };

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
              {employmentData
                ?.reduce(
                  (
                    uniqueUsers: EmploymentDetailsProps[],
                    employment: EmploymentDetailsProps
                  ) => {
                    const userExists = uniqueUsers.some(
                      (item) => item.user.id === employment.user.id
                    );
                    if (!userExists) {
                      uniqueUsers.push(employment);
                    }
                    return uniqueUsers;
                  },
                  []
                )
                .map((employment: EmploymentDetailsProps, idx: number) => {
                  const user = employment.user;
                  // Render an ampersand separator before each user tab except the first
                  return [
                    idx > 0 ? (
                      <span
                        key={`sep-${user.id}`}
                        className="align-self-center mx-1 text-muted fw-bolder"
                        style={{ cursor: "default", userSelect: "none" }}
                        aria-hidden
                      >
                        &
                      </span>
                    ) : null,
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
                    </NavItem>,
                  ];
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
                {(() => {
                  const userEmps =
                    employmentData?.filter(
                      (emp: EmploymentDetailsProps) =>
                        emp.user.id === activeUser
                    ) || [];

                  // Precompute SELF_EMPLOYED and EMPLOYED entries so numbering is contiguous per type
                  const selfEmps = userEmps.filter(
                    (e: any) => e.employment_status === "SELF_EMPLOYED"
                  );
                  const employedEmps = userEmps.filter(
                    (e: any) => e.employment_status === "EMPLOYED"
                  );

                  return userEmps.map((employment: EmploymentDetailsProps) => {
                    const selfIndex =
                      employment.employment_status === "SELF_EMPLOYED"
                        ? selfEmps.findIndex(
                            (e: any) => e.alias === employment.alias
                          ) + 1
                        : null;

                    const employedIndex =
                      employment.employment_status === "EMPLOYED"
                        ? employedEmps.findIndex(
                            (e: any) => e.alias === employment.alias
                          ) + 1
                        : null;

                    return (
                      <NavItem key={employment.alias}>
                        <NavLink
                          className={`nav-border text-info tab-info ${
                            activeTab === employment.alias ? "active" : ""
                          }`}
                          onClick={() => setActiveTab(employment.alias || null)}
                          style={{ cursor: "pointer", fontSize: "0.7rem" }}
                        >
                          <span>
                            {employment?.employment_status
                              ? // Base label from choice formatter
                                formatChoiceFieldValue(
                                  employment.employment_status
                                ) +
                                (employment.employment_status ===
                                "SELF_EMPLOYED"
                                  ? ` (Business-${selfIndex})`
                                  : employment.employment_status === "EMPLOYED"
                                  ? ` (Job-${employedIndex})`
                                  : "")
                              : "(N/A)"}
                          </span>

                          {/* Delete button next to the tab label */}
                          <Button
                            type="button"
                            size="sm"
                            outline
                            color="danger"
                            className="ms-1"
                            onClick={(e) =>
                              handleDelete(
                                e,
                                employment.alias,
                                employment.user.id
                              )
                            }
                            aria-label="Delete employment"
                            title="Delete"
                          >
                            <FaTrash />
                          </Button>
                        </NavLink>
                      </NavItem>
                    );
                  });
                })()}
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
