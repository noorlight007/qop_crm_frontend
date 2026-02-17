import ClientInvitationModal from "@/Components/Common/CommonUsers/Clients/Modals/ClientInvitationModal";
import UpdateClientModal from "@/Components/Common/CommonUsers/Clients/Modals/UpdateClientModal";
import { useDownloadApplicantInfoQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/DownloadApplicantInfo/DownloadApplicantInfo";
import { useUpdateCaseMutation } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { CaseInfoPrpos, SingleCaseProps } from "@/Types/Common/Cases/CaseTypes";
import { ClientInfoProps } from "@/Types/Common/CommonUsers/ClientTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useState } from "react";
import { FaArrowRight, FaTrash } from "react-icons/fa";
import {
  TbCircleArrowUp,
  TbCopy,
  TbDownload,
  TbEdit,
  TbMailShare,
  TbSettings,
  TbUserPlus,
} from "react-icons/tb";
import { toast } from "react-toastify";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Row,
  Spinner,
} from "reactstrap";
import DeleteCaseModal from "../../../Modals/DeleteCaseModal";
import UpdateCaseModal from "../../../Modals/UpdateCaseModal";
import AddJointApplicantModal from "./Modals/AddJointApplicantModal";
import CopyCaseModal from "./Modals/CopyCaseModal";
import ViewJointApplicantModal from "./Modals/ViewJointApplicantModal";

const CaseInfo: React.FC<SingleCaseProps> = ({
  caseInfo,
  isLoading,
  jointApplicantInfo,
}) => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isUpdateCaseModalOpen, setIsUpdateCaseModalOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState<CaseInfoPrpos | null>(null);
  const [isUpdateClientModalOpen, setIsUpdateClientModalOpen] = useState(false);
  const [isCopyCaseModalOpen, setIsCopyCaseModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] =
    useState<Partial<ClientInfoProps> | null>(null);
  const [displayLeadUser, setDisplayLeadUser] = useState(caseInfo?.lead_user);
  const [isDeleteCaseModalOpen, setIsDeleteCaseModalOpen] = useState(false);
  const [isClientInvitationModalOpen, setIsClientInvitationModalOpen] =
    useState(false);
  const [isViewJointApplicantModalOpen, setIsViewJointApplicantModalOpen] =
    useState(false);
  const [selectedJointApplicant, setSelectedJointApplicant] =
    useState<any>(null);
  const [isAddJointApplicantModalOpen, setIsAddJointApplicantModalOpen] =
    useState(false);
  const [shouldDownload, setShouldDownload] = useState(false);

  // Inline notes editing state
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState<string>("");
  const [localNotes, setLocalNotes] = useState<string | null>(
    caseInfo?.notes || null,
  );

  const [updateCaseDetails, { isLoading: isUpdatingNotes }] =
    useUpdateCaseMutation();

  useEffect(() => {
    setDisplayLeadUser(caseInfo?.lead_user);
  }, [caseInfo?.lead_user]);

  useEffect(() => {
    setLocalNotes(caseInfo?.notes || null);
  }, [caseInfo?.notes]);

  const toggleUpdateCaseModal = () =>
    setIsUpdateCaseModalOpen(!isUpdateCaseModalOpen);

  const toggleUpdateClientModal = () =>
    setIsUpdateClientModalOpen((prev) => !prev);

  const toggleCopyCaseModal = () => setIsCopyCaseModalOpen((prev) => !prev);

  const openUpdateCaseModal = (caseInfo: CaseInfoPrpos) => {
    setCurrentCase(caseInfo);
    toggleUpdateCaseModal();
  };
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const openDeleteCaseModal = (caseItem: CaseInfoPrpos) => {
    setCurrentCase(caseItem);
    toggleDeleteCaseModal();
  };
  const toggleDeleteCaseModal = () =>
    setIsDeleteCaseModalOpen(!isDeleteCaseModalOpen);

  const toggleClientInvitationModal = () =>
    setIsClientInvitationModalOpen(!isClientInvitationModalOpen);

  const toggleViewJointApplicantModal = () =>
    setIsViewJointApplicantModalOpen(!isViewJointApplicantModalOpen);

  const toggleAddJointApplicantModal = () =>
    setIsAddJointApplicantModalOpen(!isAddJointApplicantModalOpen);

  const openViewJointApplicantModal = (jointApplicant: any) => {
    setSelectedJointApplicant(jointApplicant);
    toggleViewJointApplicantModal();
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
          }) as any,
      );
    }
  };

  // Notes editing handlers
  const handleEditNotes = () => {
    setNotesDraft(caseInfo?.notes || "");
    setIsEditingNotes(true);
  };

  const handleCancelEditNotes = () => {
    setIsEditingNotes(false);
    setNotesDraft(caseInfo?.notes || "");
  };

  const handleSaveNotes = async () => {
    if (!caseInfo) {
      toast.error("Case information is not available.");
      return;
    }
    try {
      const payload = { ...caseInfo, notes: notesDraft };
      const res = await updateCaseDetails({
        caseAlias: caseInfo.alias,
        payload,
      });
      if ((res as any).data) {
        toast.success("Notes updated successfully.");
        setIsEditingNotes(false);
        setLocalNotes(notesDraft);
      } else {
        const errorMessage =
          (res as any)?.error?.data?.detail || "Failed to update notes.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating notes:", error);
      toast.error("Failed to update notes. Please try again.");
    }
  };

  const {
    data: blob,
    isLoading: isDownloading,
    isSuccess,
    isError,
  } = useDownloadApplicantInfoQuery(
    { case_alias: caseInfo?.alias },
    { skip: !shouldDownload || !caseInfo },
  );

  // Handle download when data is ready
  useEffect(() => {
    if (isSuccess && blob && shouldDownload) {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `applicants-info(${caseInfo?.name}).pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setShouldDownload(false);
    }
  }, [isSuccess, blob, shouldDownload, caseInfo]);

  // Handle errors
  useEffect(() => {
    if (isError && shouldDownload) {
      toast.error("Failed to download applicant info. Please try again.");
      setShouldDownload(false); // Reset
    }
  }, [isError, shouldDownload]);

  const handleDownloadApplicantInfo = () => {
    if (!caseInfo) {
      toast.error("Case information is not available for download.");
      return;
    }
    setShouldDownload(true);
  };

  return (
    <Col sm="12">
      <Card>
        <CardHeader className="d-flex justify-content-between">
          <h3 className="mb-2">
            <span className="text-primary">{caseInfo?.name}</span>
          </h3>
          <ButtonGroup>
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle color="primary" caret className="me-1">
                <TbSettings className="me-1" />
                Actions
              </DropdownToggle>
              <DropdownMenu
                style={{
                  width: "200px",
                }}
              >
                <DropdownItem
                  onClick={() => openUpdateCaseModal(caseInfo!)}
                  disabled={!caseInfo}
                  className="opacity-100 py-3"
                >
                  <TbCircleArrowUp size="16" className="me-1" />
                  <span>Update Case</span>
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    if (!caseInfo?.lead_user) {
                      toast.error("No lead user found for this case.");
                      return;
                    }

                    if (!caseInfo.lead_user.alias) {
                      toast.error(
                        "Client alias not found. This may be an Organization Client.",
                      );
                      return;
                    }

                    setSelectedClient({
                      alias: caseInfo.lead_user.alias,
                      user: {
                        email: caseInfo.lead_user.email,
                        first_name: caseInfo.lead_user.first_name,
                        last_name: caseInfo.lead_user.last_name,
                      },
                    } as Partial<ClientInfoProps>);
                    toggleClientInvitationModal();
                  }}
                  disabled={!caseInfo}
                  className="opacity-100 py-3"
                >
                  <TbMailShare size="16" className="me-1" />
                  Client Invitation
                </DropdownItem>
                <DropdownItem
                  className="opacity-100 py-3"
                  onClick={toggleCopyCaseModal}
                >
                  <TbCopy size="16" className="me-1" />
                  Copy Case
                </DropdownItem>
                <DropdownItem
                  className="opacity-100 py-3"
                  onClick={handleDownloadApplicantInfo}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <Spinner size="sm" className="me-1" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <TbDownload size="16" className="me-1" />
                      Download Applicants Info
                    </>
                  )}
                </DropdownItem>
                {(session?.user?.user_type === "NETWORK_DIRECTOR" ||
                  session?.user?.user_type === "NETWORK_COMPLIANCE" ||
                  session?.user?.user_type === "ORGANISATION_DIRECTOR") && (
                  <>
                    <DropdownItem divider />
                    <DropdownItem
                      onClick={() => openDeleteCaseModal(caseInfo!)}
                      disabled={!caseInfo}
                      className="text-danger opacity-100 py-3"
                    >
                      <FaTrash size="16" className="me-1" />
                      Delete Case
                    </DropdownItem>
                  </>
                )}
              </DropdownMenu>
            </Dropdown>
          </ButtonGroup>
        </CardHeader>

        <Row className="px-3 mt-3">
          {/* Client User Card */}
          <Col sm={12} md={4}>
            <Card className="shadow">
              <CardBody className="pt-2 border-3 rounded-3 border-b-primary">
                <CardHeader className="pt-0 pb-1 m-0 text-center">
                  <h6 className="fw-bold">Client User</h6>
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
          {/* Joint Applicants Card */}
          <Col sm={12} md={4}>
            <Card className="shadow">
              <CardBody className="pt-2 border-3 rounded-3 border-b-primary">
                <CardHeader className="pt-0 pb-1 m-0 text-center position-relative">
                  <h6 className="fw-bold">Joint Applicants</h6>
                  <Button
                    color="primary"
                    size="xs"
                    className="position-absolute"
                    onClick={toggleAddJointApplicantModal}
                    style={{
                      top: "30%",
                      right: "0px",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <TbUserPlus size="16" />
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
                      {jointApplicantInfo && jointApplicantInfo.length > 0 ? (
                        <ul
                          style={{
                            listStyleType: "disc",
                            paddingLeft: "20px",
                            height: "55px",
                            overflowY: "auto",
                          }}
                          className="text-primary"
                        >
                          {jointApplicantInfo.map((jointApplicant, index) => (
                            <li key={index}>
                              <strong
                                className="small text_decoration_hover"
                                onClick={() =>
                                  openViewJointApplicantModal(jointApplicant)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                {jointApplicant?.joint_user_details?.title
                                  ? formatChoiceFieldValue(
                                      jointApplicant.joint_user_details.title,
                                    ) + " "
                                  : " "}
                                {jointApplicant?.joint_user_details?.first_name}{" "}
                                {jointApplicant?.joint_user_details
                                  ?.middle_name && (
                                  <>
                                    {
                                      jointApplicant.joint_user_details
                                        .middle_name
                                    }{" "}
                                  </>
                                )}
                                {jointApplicant?.joint_user_details?.last_name}
                              </strong>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-3 mt-2">
                          <h6 className="text-muted">
                            <em>No Joint Applicants</em>
                          </h6>
                        </div>
                      )}
                    </Col>
                  </Row>
                )}
              </CardBody>
            </Card>
          </Col>

          {/* Case Info Card */}
          <Col sm={12} md={4}>
            <Card className="shadow">
              <CardBody className="pt-2 border-3 rounded-3 border-b-primary ">
                <CardHeader className="pt-0 pb-1 m-0 text-center">
                  <h6 className="fw-bold">Case Info</h6>
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
                    <Col
                      xs="12"
                      style={{
                        height: "55px",
                        overflowY: "auto",
                      }}
                    >
                      <h6 className="pt-1">
                        <span className="small">Case Category:</span>{" "}
                        <strong className="small">
                          {caseInfo?.case_category
                            ? formatChoiceFieldValue(caseInfo.case_category)
                            : "N/A"}
                          {caseInfo?.case_category === "MORTGAGE" &&
                            ((caseInfo?.application_type &&
                              String(caseInfo.application_type).trim() !==
                                "") ||
                              (caseInfo?.mortgage_type &&
                                String(caseInfo.mortgage_type).trim() !==
                                  "")) && (
                              <small>
                                (
                                {caseInfo?.application_type
                                  ? formatChoiceFieldValue(
                                      caseInfo.application_type,
                                    )
                                  : null}
                                {caseInfo?.mortgage_type ? (
                                  <>
                                    {" "}
                                    <FaArrowRight />{" "}
                                    {formatChoiceFieldValue(
                                      caseInfo.mortgage_type,
                                    )}
                                  </>
                                ) : null}
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
        </Row>

        <Row className="px-3 mt-3">
          {/* Assigned Advisor Card */}
          <Col sm={12} md={caseInfo?.organization === null ? 6 : 4}>
            <Card className="shadow">
              <CardBody className="pt-2 border-3 rounded-3 border-b-secondary">
                <CardHeader className="pt-0 pb-1 m-0 text-center">
                  <h6 className="fw-bold">Assigned Adviser</h6>
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
                                    caseInfo.assigned_user.title,
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
                                    caseInfo.assigned_user?.user_type,
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
          {/* Assigned Admin Card */}
          {caseInfo?.organization === null ? null : (
            <Col sm={12} md={4}>
              <Card className="shadow">
                <CardBody className="pt-2 border-3 rounded-3 border-b-secondary">
                  <CardHeader className="pt-0 pb-1 m-0 text-center">
                    <h6 className="fw-bold">Assigned Admin</h6>
                  </CardHeader>
                  {isLoading ? (
                    <Row className="pt-2">
                      <Col xs="12" className="text-center">
                        <Spinner
                          animation="border"
                          role="status"
                          color="info"
                        />
                      </Col>
                    </Row>
                  ) : (
                    <Row className="pt-2">
                      <Col xs="12">
                        {caseInfo?.assigned_admin ? (
                          <>
                            <h6 className="pt-1">
                              <span className="small">Name:</span>{" "}
                              <strong className="small">
                                {caseInfo?.assigned_admin?.title
                                  ? formatChoiceFieldValue(
                                      caseInfo.assigned_admin.title,
                                    )
                                  : ""}{" "}
                                {caseInfo?.assigned_admin?.first_name}{" "}
                                {caseInfo?.assigned_admin?.middle_name}{" "}
                                {caseInfo?.assigned_admin?.last_name}
                              </strong>
                            </h6>
                            <h6 className="pt-1">
                              <span className="small">Email:</span>{" "}
                              <strong>
                                <small>{caseInfo?.assigned_admin?.email}</small>
                              </strong>
                            </h6>
                            <h6 className="pt-1">
                              <span className="small">User Type:</span>{" "}
                              <strong className="small">
                                {caseInfo?.assigned_admin?.user_type
                                  ? formatChoiceFieldValue(
                                      caseInfo.assigned_admin?.user_type,
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
          )}

          {/* Created By Card */}
          <Col sm={12} md={caseInfo?.organization === null ? 6 : 4}>
            <Card className="shadow">
              <CardBody className="pt-2 border-3 rounded-3 border-b-secondary">
                <CardHeader className="pt-0 pb-1 m-0 text-center">
                  <h6 className="fw-bold">Created By</h6>
                </CardHeader>
                {isLoading ? (
                  <Row className="pt-2">
                    <Col xs="12" className="text-center">
                      <Spinner
                        animation="border"
                        role="status"
                        color="secondary"
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
                                caseInfo.created_by?.user_type,
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
        <Row className="px-3 mt-3">
          <Col sm="12">
            <Card className="shadow">
              <CardBody className="pt-2">
                {/* Property Details Section */}
                <div className="mb-4">
                  <h6
                    className="text-uppercase fw-bold text-primary mb-3"
                    style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                  >
                    Property Details
                  </h6>
                  <Row>
                    <Col md="6">
                      <div className="p-3 bg-light rounded mb-3">
                        <small className="text-muted d-block fw-500 mb-2">
                          Property Address
                        </small>
                        <p className="m-0 text-dark fw-500">
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
                                v !== null &&
                                v !== undefined &&
                                String(v).trim() !== "",
                            );
                            return parts.length ? (
                              parts.join(", ")
                            ) : (
                              <span className="text-muted">Not available</span>
                            );
                          })()}
                        </p>
                      </div>

                      <Row>
                        <Col md="6" className="mb-3">
                          <div className="p-3 bg-light rounded">
                            <small className="text-muted d-block fw-500 mb-2">
                              Property Value
                            </small>
                            <p className="m-0 text-dark fw-500">
                              {caseInfo?.property_valuation ? (
                                `£${caseInfo.property_valuation}`
                              ) : (
                                <span className="text-muted">
                                  Not available
                                </span>
                              )}
                            </p>
                          </div>
                        </Col>
                        <Col md="6" className="mb-3">
                          <div className="p-3 bg-light rounded">
                            <small className="text-muted d-block fw-500 mb-2">
                              Purchase Price
                            </small>
                            <p className="m-0 text-dark fw-500">
                              {caseInfo?.purchase_price ? (
                                `£${caseInfo.purchase_price}`
                              ) : (
                                <span className="text-muted">
                                  Not available
                                </span>
                              )}
                            </p>
                          </div>
                        </Col>
                        <Col md="6" className="mb-3">
                          <div className="p-3 bg-light rounded">
                            <small className="text-muted d-block fw-500 mb-2">
                              Loan Amount
                            </small>
                            <p className="m-0 text-dark fw-500">
                              {caseInfo?.loan_amount ? (
                                `£${caseInfo.loan_amount}`
                              ) : (
                                <span className="text-muted">
                                  Not available
                                </span>
                              )}
                            </p>
                          </div>
                        </Col>
                        <Col md="6" className="mb-3">
                          <div className="p-3 bg-light rounded">
                            <small className="text-muted d-block fw-500 mb-2">
                              Lender
                            </small>
                            <p className="m-0 text-dark fw-500">
                              {caseInfo?.lender ? (
                                formatChoiceFieldValue(caseInfo.lender)
                              ) : (
                                <span className="text-muted">
                                  Not available
                                </span>
                              )}
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </Col>

                    {/* Notes Section on the right */}
                    <Col md="6" className="ps-3">
                      <h6
                        className="text-uppercase fw-bold text-primary mb-3 position-relative"
                        style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                      >
                        Notes
                        <Button
                          color="primary"
                          size="sm"
                          className="position-absolute"
                          onClick={handleEditNotes}
                          style={{
                            top: "30%",
                            right: "0px",
                            transform: "translateY(-50%)",
                          }}
                          disabled={isLoading}
                        >
                          <TbEdit size="14" /> Edit
                        </Button>
                      </h6>
                      <div className="p-3 bg-light rounded h-75 overflow-auto border-l-primary border-2">
                        {isEditingNotes ? (
                          <>
                            <Input
                              type="textarea"
                              value={notesDraft}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setNotesDraft(e.target.value)
                              }
                              rows={6}
                            />
                            <div className="mt-2 text-end">
                              <Button
                                color="primary"
                                size="sm"
                                onClick={handleSaveNotes}
                                disabled={isUpdatingNotes}
                              >
                                {isUpdatingNotes ? (
                                  <Spinner size="sm" />
                                ) : (
                                  "Save"
                                )}
                              </Button>{" "}
                              <Button
                                color="secondary"
                                size="sm"
                                onClick={handleCancelEditNotes}
                                disabled={isUpdatingNotes}
                              >
                                Cancel
                              </Button>
                            </div>
                          </>
                        ) : (
                          <p
                            className="m-0 text-dark"
                            style={{ whiteSpace: "pre-wrap" }}
                          >
                            {localNotes ? (
                              localNotes
                            ) : (
                              <span className="text-muted">
                                No notes available
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>

                <hr className="my-3" />

                {/* Application & Mortgage Type Section */}
                <div>
                  <h6
                    className="text-uppercase fw-bold text-primary mb-3"
                    style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                  >
                    Application & Mortgage Details
                  </h6>
                  <Row>
                    <Col md="6" className="mb-3">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted d-block fw-500 mb-2">
                          Application Type
                        </small>
                        <p className="m-0 text-dark fw-500">
                          {caseInfo?.application_type ? (
                            formatChoiceFieldValue(caseInfo.application_type)
                          ) : (
                            <span className="text-muted">Not available</span>
                          )}
                        </p>
                      </div>
                    </Col>
                    <Col md="6" className="mb-3">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted d-block fw-500 mb-2">
                          Mortgage Type
                        </small>
                        <p className="m-0 text-dark fw-500">
                          {caseInfo?.mortgage_type ? (
                            formatChoiceFieldValue(caseInfo.mortgage_type)
                          ) : (
                            <span className="text-muted">Not available</span>
                          )}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
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
      {selectedClient && (
        <ClientInvitationModal
          isOpen={isClientInvitationModalOpen}
          toggle={toggleClientInvitationModal}
          selectedClient={selectedClient}
        />
      )}
      <UpdateCaseModal
        isOpen={isUpdateCaseModalOpen}
        toggle={toggleUpdateCaseModal}
        caseData={currentCase as CaseInfoPrpos}
      />
      <DeleteCaseModal
        isOpen={isDeleteCaseModalOpen}
        toggle={toggleDeleteCaseModal}
        caseData={currentCase}
        onDelete={toggleDeleteCaseModal}
      />
      {/* Copy Case Modal - To be implemented */}
      <CopyCaseModal
        isOpen={isCopyCaseModalOpen}
        toggle={toggleCopyCaseModal}
        caseData={caseInfo as CaseInfoPrpos}
      />
      {selectedJointApplicant && (
        <ViewJointApplicantModal
          isOpen={isViewJointApplicantModalOpen}
          toggle={toggleViewJointApplicantModal}
          selectedApplicant={selectedJointApplicant}
        />
      )}
      <AddJointApplicantModal
        isOpen={isAddJointApplicantModalOpen}
        toggle={toggleAddJointApplicantModal}
      />
    </Col>
  );
};

export default CaseInfo;
