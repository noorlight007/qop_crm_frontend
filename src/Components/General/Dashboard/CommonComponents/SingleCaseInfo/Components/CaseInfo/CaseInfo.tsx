import UpdateCaseModal from "@/Components/General/Dashboard/CommonComponents/Cases/Modals/UpdateCaseModal";
import UpdateClientModal from "@/Components/General/Dashboard/CommonComponents/Directors/Clients/Modals/UpdateClientModal";
import { useGetClientDetailsQuery } from "@/Redux/Reducers/CommonComponents/Directors/ClientDetailsApi";
import {
  CaseInfoPrpos,
  SingleCaseProps,
} from "@/Types/CommonComponents/Cases/CaseTypes";
import { ClientInfoProps } from "@/Types/CommonComponents/Directors/ClientTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import { useEffect, useState } from "react";
import { FaArrowRight, FaUserEdit } from "react-icons/fa";
import { TbCircleArrowUp } from "react-icons/tb";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Spinner,
} from "reactstrap";

const CaseInfo: React.FC<SingleCaseProps> = ({ caseInfo, isLoading }) => {
  const [isUpdateCaseModalOpen, setIsUpdateCaseModalOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState<CaseInfoPrpos | null>(null);
  const [isUpdateClientModalOpen, setIsUpdateClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] =
    useState<Partial<ClientInfoProps> | null>(null);
  const [displayLeadUser, setDisplayLeadUser] = useState(caseInfo?.lead_user);

  useEffect(() => {
    setDisplayLeadUser(caseInfo?.lead_user);
  }, [caseInfo?.lead_user]);

  const toggleUpdateCaseModal = () =>
    setIsUpdateCaseModalOpen(!isUpdateCaseModalOpen);

  const toggleUpdateClientModal = () =>
    setIsUpdateClientModalOpen((prev) => !prev);

  const { data: dirClientsData } = useGetClientDetailsQuery(undefined);

  const openUpdateCaseModal = (caseInfo: CaseInfoPrpos) => {
    setCurrentCase(caseInfo);
    toggleUpdateCaseModal();
  };

  const handleClientSave = (clientData: Partial<ClientInfoProps>) => {
    if (clientData?.user) {
      setDisplayLeadUser(
        (prev) =>
          ({
            ...(prev || ({} as any)),
            title: clientData.user!.title ?? prev?.title,
            first_name: clientData.user!.first_name ?? prev?.first_name,
            middle_name: clientData.user!.middle_name ?? prev?.middle_name,
            last_name: clientData.user!.last_name ?? prev?.last_name,
            email: clientData.user!.email ?? prev?.email,
            phone: clientData.user!.phone ?? prev?.phone,
            user_type: prev?.user_type || "",
            profile_image: prev?.profile_image || "",
          } as any)
      );
    }
  };

  return (
    <Col sm="12">
      <Card>
        <CardHeader className="d-flex justify-content-between">
          <h3 className="mb-2">
            Case Info
            <span className="small text-muted opacity-75">
              ({caseInfo?.name})
            </span>
          </h3>
          <Button
            color="primary"
            onClick={() => openUpdateCaseModal(caseInfo!)}
            disabled={!caseInfo} // Disable if caseInfo is null
            className="d-flex justify-content-center align-items-center gap-1"
          >
            <TbCircleArrowUp size={18} />
            <span>Update Info</span>
          </Button>
        </CardHeader>

        <Row className="px-3 mt-3">
          {/* Client User Card */}
          <Col sm={12} md={6}>
            <Card className="shadow">
              <CardBody className="support-ticket-font pt-2 border-3 rounded-3 border-b-primary">
                <CardHeader className="pt-0 pb-1 m-0 text-center position-relative">
                  <h6 className="fw-bold">Client User</h6>
                  <Button
                    size="xs"
                    color="primary"
                    outline
                    style={{ position: "absolute", top: "-5px", right: "0px" }}
                    onClick={() => {
                      if (!caseInfo?.lead_user) return;
                      // Try to find the client's alias using the lead user's email
                      const clientsList: ClientInfoProps[] | undefined =
                        Array.isArray(dirClientsData)
                          ? (dirClientsData as ClientInfoProps[])
                          : (dirClientsData as any)?.clients;

                      const leadEmail = caseInfo.lead_user.email?.toLowerCase();
                      const matchedClient:
                        | Partial<ClientInfoProps>
                        | undefined = clientsList?.find(
                        (c: ClientInfoProps) =>
                          c?.user?.email?.toLowerCase() === leadEmail
                      );

                      if (!matchedClient?.alias) {
                        toast.error(
                          "Client record not found for this lead user. Or this is Organisation Client."
                        );
                        return;
                      }

                      // Prefill from matched client (ensures alias is present for update API)
                      const prefill: Partial<ClientInfoProps> = {
                        alias: matchedClient.alias,
                        user: {
                          title: caseInfo.lead_user.title,
                          first_name: caseInfo.lead_user.first_name,
                          middle_name: caseInfo.lead_user.middle_name,
                          last_name: caseInfo.lead_user.last_name,
                          email: caseInfo.lead_user.email,
                          phone: caseInfo.lead_user.phone,
                          user_type: caseInfo.lead_user.user_type,
                        },
                        // Carry over optional fields if present
                        role: (matchedClient as any)?.role,
                        gender: (matchedClient as any)?.gender,
                        reason_for_enquiry: (matchedClient as any)
                          ?.reason_for_enquiry,
                      } as Partial<ClientInfoProps>;

                      setSelectedClient(prefill);
                      setIsUpdateClientModalOpen(true);
                    }}
                    disabled={!caseInfo?.lead_user}
                  >
                    <FaUserEdit />
                  </Button>
                </CardHeader>
                {isLoading ? (
                  <Row className="pt-2">
                    <Col xs="12" className="text-center">
                      <Spinner
                        animation="border"
                        role="status"
                        color="primary"
                      />
                    </Col>
                  </Row>
                ) : (
                  <Row className="pt-2">
                    <Col xs="12">
                      <h6 className="pt-1">
                        <span className="small">Name:</span>{" "}
                        <strong className="small">
                          {displayLeadUser?.title
                            ? formatChoiceFieldValue(displayLeadUser.title)
                            : ""}{" "}
                          {displayLeadUser?.first_name}{" "}
                          {displayLeadUser?.middle_name}{" "}
                          {displayLeadUser?.last_name}
                          {caseInfo?.joint_users &&
                          caseInfo.joint_users.length > 0 ? (
                            <>
                              <small className="fw-lighter">
                                {" "}
                                (Joint Applicant)
                              </small>
                            </>
                          ) : (
                            ""
                          )}
                        </strong>
                      </h6>
                      <h6 className="pt-1">
                        <span className="small">Email:</span>{" "}
                        <strong>
                          <small>{displayLeadUser?.email}</small>
                        </strong>
                      </h6>
                      <h6 className="pt-1">
                        {displayLeadUser?.phone ? (
                          <>
                            <span className="small">Phone:</span>{" "}
                            <strong>
                              <a
                                className="text-dark text_decoration_hover small"
                                href={`tel:${displayLeadUser?.phone}`}
                              >
                                {displayLeadUser?.phone}
                              </a>
                            </strong>
                          </>
                        ) : (
                          <>
                            <span className="small">Phone:</span>{" "}
                            <strong className="text-muted opacity-50 small">
                              Not Found
                            </strong>
                          </>
                        )}
                      </h6>
                    </Col>
                  </Row>
                )}
              </CardBody>
            </Card>
          </Col>

          {/* Case Info Card */}
          <Col sm={12} md={6}>
            <Card className="shadow">
              <CardBody className="support-ticket-font pt-2 border-3 rounded-3 border-b-warning">
                <CardHeader className="pt-0 pb-1 m-0 text-center">
                  <h6 className="fw-bold">Case Info</h6>
                </CardHeader>
                {isLoading ? (
                  <Row className="pt-2">
                    <Col xs="12" className="text-center">
                      <Spinner
                        animation="border"
                        role="status"
                        color="warning"
                      />
                    </Col>
                  </Row>
                ) : (
                  <Row className="pt-2">
                    <Col xs="12">
                      <h6 className="pt-1">
                        <span className="small">Case Category:</span>{" "}
                        <strong className="small">
                          {caseInfo?.case_category
                            ? formatChoiceFieldValue(caseInfo.case_category)
                            : "N/A"}
                          {caseInfo?.case_category === "MORTGAGE" && (
                            <small>
                              (
                              {formatChoiceFieldValue(
                                caseInfo?.application_type || ""
                              )}
                              {caseInfo?.mortgage_type ? (
                                <>
                                  {" "}
                                  <FaArrowRight />{" "}
                                  {formatChoiceFieldValue(
                                    caseInfo?.mortgage_type || ""
                                  )}
                                </>
                              ) : (
                                ""
                              )}
                              )
                            </small>
                          )}
                        </strong>
                      </h6>
                      <h6 className="pt-1">
                        <span className="small">Case Status:</span>{" "}
                        <strong
                          className={`rounded-1 px-1 small ${
                            caseInfo?.is_removed ? "bg-danger" : "bg-success"
                          }`}
                        >
                          {caseInfo?.is_removed ? "Removed" : "Active"}
                        </strong>
                      </h6>
                      <h6 className="pt-1">
                        <span className="small">Case Stage:</span>{" "}
                        <strong className="small">
                          {caseInfo?.case_stage
                            ? formatChoiceFieldValue(caseInfo.case_stage)
                            : "N/A"}
                        </strong>
                      </h6>
                    </Col>
                  </Row>
                )}
              </CardBody>
            </Card>
          </Col>

          {/* Assigned Advisor Card */}
          <Col sm={12} md={6}>
            <Card className="shadow">
              <CardBody className="support-ticket-font pt-2 border-3 rounded-3 border-b-info">
                <CardHeader className="pt-0 pb-1 m-0 text-center">
                  <h6 className="fw-bold">Assigned Advisor</h6>
                </CardHeader>
                {isLoading ? (
                  <Row className="pt-2">
                    <Col xs="12" className="text-center">
                      <Spinner animation="border" role="status" color="info" />
                    </Col>
                  </Row>
                ) : (
                  <Row className="pt-2">
                    <Col xs="12">
                      {caseInfo?.assigned_user ? (
                        <>
                          <h6 className="pt-1">
                            <span className="small">Name:</span>{" "}
                            <strong className="small">
                              {caseInfo?.assigned_user?.title
                                ? formatChoiceFieldValue(
                                    caseInfo.assigned_user.title
                                  )
                                : ""}{" "}
                              {caseInfo?.assigned_user?.first_name}{" "}
                              {caseInfo?.assigned_user?.middle_name}{" "}
                              {caseInfo?.assigned_user?.last_name}
                            </strong>
                          </h6>
                          <h6 className="pt-1">
                            <span className="small">Email:</span>{" "}
                            <strong>
                              <small>{caseInfo?.assigned_user?.email}</small>
                            </strong>
                          </h6>
                          <h6 className="pt-1">
                            <span className="small">User Type:</span>{" "}
                            <strong className="small">
                              {caseInfo?.assigned_user?.user_type
                                ? formatChoiceFieldValue(
                                    caseInfo.assigned_user?.user_type
                                  )
                                : "N/A"}
                            </strong>
                          </h6>
                        </>
                      ) : (
                        <div className="text-center py-3 mt-2">
                          <h6 className="text-muted">
                            <em>Not Assigned Yet</em>
                          </h6>
                        </div>
                      )}
                    </Col>
                  </Row>
                )}
              </CardBody>
            </Card>
          </Col>

          {/* Created By Card */}
          <Col sm={12} md={6}>
            <Card className="shadow">
              <CardBody className="support-ticket-font pt-2 border-3 rounded-3 border-b-success">
                <CardHeader className="pt-0 pb-1 m-0 text-center">
                  <h6 className="fw-bold">Created By</h6>
                </CardHeader>
                {isLoading ? (
                  <Row className="pt-2">
                    <Col xs="12" className="text-center">
                      <Spinner
                        animation="border"
                        role="status"
                        color="success"
                      />
                    </Col>
                  </Row>
                ) : (
                  <Row className="pt-2">
                    <Col xs="12">
                      <h6 className="pt-1">
                        <span className="small">Name:</span>{" "}
                        <strong className="small">
                          {caseInfo?.created_by?.title
                            ? formatChoiceFieldValue(caseInfo.created_by.title)
                            : ""}{" "}
                          {caseInfo?.created_by?.first_name}{" "}
                          {caseInfo?.created_by?.middle_name}{" "}
                          {caseInfo?.created_by?.last_name}
                        </strong>
                      </h6>
                      <h6 className="pt-1">
                        <span className="small">Email:</span>{" "}
                        <strong>
                          <small>{caseInfo?.created_by?.email}</small>
                        </strong>
                      </h6>
                      <h6 className="pt-1">
                        <span className="small">User Type:</span>{" "}
                        <strong className="small">
                          {caseInfo?.created_by?.user_type
                            ? formatChoiceFieldValue(
                                caseInfo.created_by?.user_type
                              )
                            : "N/A"}
                        </strong>
                      </h6>
                    </Col>
                  </Row>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="px-3">
          <Col className="border-2 border-r-light">
            <div>
              <h5>Property Address:</h5>
              <p>
                {(() => {
                  const pd = caseInfo?.property_details;
                  if (!pd) return "N/A";
                  const countryFormatted = pd.country
                    ? formatChoiceFieldValue(pd.country)
                    : pd.country;
                  const parts = [
                    pd.house_name_or_number,
                    pd.address_line_1,
                    pd.address_line_2,
                    pd.city,
                    pd.county,
                    pd.postcode,
                    countryFormatted,
                  ].filter(
                    (v) =>
                      v !== null && v !== undefined && String(v).trim() !== ""
                  );
                  return parts.length ? parts.join(", ") : "N/A";
                })()}
              </p>
            </div>
            <div className="d-flex justify-content-between gap-2">
              <div>
                <h5>Property Value:</h5>
                <p>
                  {caseInfo?.property_valuation ? (
                    caseInfo.property_valuation
                  ) : (
                    <span className="text-muted">Not available</span>
                  )}
                </p>
              </div>
              <div>
                <h5>Loan Amount :</h5>
                <p>
                  {caseInfo?.loan_amount ? (
                    `£${caseInfo.loan_amount}`
                  ) : (
                    <span className="text-muted">Not available</span>
                  )}
                </p>
              </div>
              <div>
                <h5>Lender:</h5>
                <p>
                  {caseInfo?.lender ? (
                    caseInfo.lender
                  ) : (
                    <span className="text-muted">No lender available.</span>
                  )}
                </p>
              </div>
            </div>
          </Col>
          <Col>
            <h5>Notes:</h5>
            <p className="p-1">
              {caseInfo?.notes ? (
                formatChoiceFieldValue(caseInfo.notes)
              ) : (
                <span className="text-muted">No notes available.</span>
              )}
            </p>
          </Col>
        </Row>
      </Card>
      {selectedClient && (
        <UpdateClientModal
          isOpen={isUpdateClientModalOpen}
          toggle={toggleUpdateClientModal}
          onSave={handleClientSave}
          selectedClient={selectedClient}
        />
      )}
      <UpdateCaseModal
        isOpen={isUpdateCaseModalOpen}
        toggle={toggleUpdateCaseModal}
        caseData={currentCase as CaseInfoPrpos}
      />
    </Col>
  );
};

export default CaseInfo;
