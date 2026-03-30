import LoadingSpinner from "@/app/loading";
import { useGetEmploymentDetailsQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/EmploymentDetails/EmploymentDetailsApi";
import { EmploymentDetailsProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/EmploymentTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
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
import DeleteEmploymentModal from "./EmploymentModals/DeleteEmploymentModal";
import { EmploymentTabContent } from "./EmploymentTabContent";

export const EmploymentTab = () => {
  const { data: session } = useSession();
  const [activeUser, setActiveUser] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const params = useParams();
  const { casealias } = params as { casealias?: string | string[] };

  // Normalize `casealias` which can be `string | string[] | undefined` from next/navigation
  const caseAlias = Array.isArray(casealias) ? casealias[0] : casealias;

  const { data: employmentData, isLoading: isEmploymentDetailLoading } =
    useGetEmploymentDetailsQuery({ case_alias: caseAlias });

  // Delete modal state (the modal performs the mutation)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modalEmploymentAlias, setModalEmploymentAlias] = useState<
    string | undefined
  >(undefined);
  const [modalUserId, setModalUserId] = useState<number | null>(null);

  const openDeleteModal = (
    e: React.MouseEvent,
    employmentAlias: string | undefined,
    userId: number,
  ) => {
    e.stopPropagation();
    setModalEmploymentAlias(employmentAlias);
    setModalUserId(userId);
    setDeleteModalOpen(true);
  };

  const handleDeleteSuccess = () => {
    const employmentAlias = modalEmploymentAlias;
    const userId = modalUserId as number;

    const remainingForUser = (employmentData || []).filter(
      (emp: any) => emp.customer.id === userId && emp.alias !== employmentAlias,
    );

    if (remainingForUser.length > 0) {
      setActiveTab(remainingForUser[0].alias || null);
    } else {
      const remainingAny = (employmentData || []).filter(
        (emp: any) => emp.alias !== employmentAlias,
      );
      if (remainingAny.length > 0) {
        setActiveUser(remainingAny[0].customer.id);
        setActiveTab(remainingAny[0].alias || null);
      } else {
        setActiveTab(null);
        setActiveUser(null);
      }
    }

    setDeleteModalOpen(false);
    setModalEmploymentAlias(undefined);
    setModalUserId(null);
  };

  useEffect(() => {
    if (employmentData && employmentData.length > 0) {
      const firstUserId = employmentData[0]?.customer.id;
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
              className="nav-primary d-flex flex-wrap gap-2 justify-content-center"
              pills
            >
              {employmentData
                ?.reduce(
                  (
                    uniqueUsers: EmploymentDetailsProps[],
                    employment: EmploymentDetailsProps,
                  ) => {
                    const userExists = uniqueUsers.some(
                      (item) => item.customer.id === employment.customer.id,
                    );
                    if (!userExists) {
                      uniqueUsers.push(employment);
                    }
                    return uniqueUsers;
                  },
                  [],
                )
                .map((employment: EmploymentDetailsProps, idx: number) => {
                  const customer = employment.customer;
                  return [
                    idx > 0 ? (
                      <span
                        key={`sep-${customer.id}`}
                        className="align-self-center mx-1 text-muted fw-bolder"
                        style={{ cursor: "default", userSelect: "none" }}
                        aria-hidden
                      >
                        &
                      </span>
                    ) : null,
                    <NavItem key={customer.id}>
                      <NavLink
                        className={`${activeUser === customer.id ? "active" : ""}`}
                        onClick={() => {
                          setActiveUser(customer.id);
                          setActiveTab(employment.alias || null);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {`${
                          customer?.title
                            ? customer?.title[0].toUpperCase() +
                              customer?.title.slice(1).toLowerCase() +
                              ""
                            : ""
                        } ${customer.first_name} ${customer.middle_name} ${
                          customer.last_name
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
                        emp.customer.id === activeUser,
                    ) || [];

                  const selfEmps = userEmps.filter(
                    (e: any) => e.employment_status === "SELF_EMPLOYED",
                  );
                  const employedEmps = userEmps.filter(
                    (e: any) => e.employment_status === "EMPLOYED",
                  );

                  return userEmps.map((employment: EmploymentDetailsProps) => {
                    const selfIndex =
                      employment.employment_status === "SELF_EMPLOYED"
                        ? selfEmps.findIndex(
                            (e: any) => e.alias === employment.alias,
                          ) + 1
                        : null;

                    const employedIndex =
                      employment.employment_status === "EMPLOYED"
                        ? employedEmps.findIndex(
                            (e: any) => e.alias === employment.alias,
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
                              ? formatChoiceFieldValue(
                                  employment.employment_status,
                                ) +
                                (employment.employment_status ===
                                "SELF_EMPLOYED"
                                  ? ` (Business-${selfIndex})`
                                  : employment.employment_status === "EMPLOYED"
                                    ? ` (Job-${employedIndex})`
                                    : "")
                              : "(N/A)"}
                          </span>
                          {(() => {
                            const indexForUser = userEmps.findIndex(
                              (e: any) => e.alias === employment.alias,
                            );

                            if (indexForUser === 0) {
                              return null;
                            }

                            return (
                              <Button
                                type="button"
                                size="sm"
                                outline
                                color="danger"
                                className="ms-1"
                                onClick={(e) =>
                                  openDeleteModal(
                                    e,
                                    employment.alias,
                                    employment.customer.id,
                                  )
                                }
                                aria-label="Delete employment"
                                title="Delete"
                              >
                                <FaTrash />
                              </Button>
                            );
                          })()}
                        </NavLink>
                      </NavItem>
                    );
                  });
                })()}
              </Nav>
            </CardHeader>
          )}

          <DeleteEmploymentModal
            isOpen={deleteModalOpen}
            toggle={() => setDeleteModalOpen((s) => !s)}
            caseAlias={caseAlias}
            employmentAlias={modalEmploymentAlias}
            onSuccess={handleDeleteSuccess}
          />

          {/* Tab Content */}
          {activeTab && activeUser && (
            <EmploymentTabContent
              activeTab={activeTab}
              activeUser={activeUser}
              groupedData={
                employmentData?.reduce(
                  (
                    acc: Record<number, EmploymentDetailsProps[]>,
                    emp: EmploymentDetailsProps,
                  ) => {
                    if (!acc[emp.customer.id]) {
                      acc[emp.customer.id] = [];
                    }
                    acc[emp.customer.id].push(emp);
                    return acc;
                  },
                  {} as Record<number, EmploymentDetailsProps[]>,
                ) || {}
              }
            />
          )}
        </CardBody>
      </Card>
    </Col>
  );
};

export default EmploymentTab;
