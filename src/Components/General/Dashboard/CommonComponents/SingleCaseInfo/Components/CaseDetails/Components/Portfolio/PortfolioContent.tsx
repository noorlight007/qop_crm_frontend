import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { basicTabIndicator } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/CaseDetailsTabIndicatorSlice";
import {
  useExportPropertiesCSVMutation,
  useGetPortfolioDetailsQuery,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Portfolio/PortfolioApi";
import LoadingSpinner from "@/app/loading";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { formatDateToDMY } from "@/utils/dateAndTimeFormatter";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FaFileExport } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Table,
} from "reactstrap";
import AddPropertyModal from "./Modals/AddPropertyModal";
import DeletePropertyModal from "./Modals/DeletePropertyModal";
import PortfolioSummary from "./PortfolioSummary";

const PortfolioContent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Delete modal state (moved up to avoid conditional hook rendering)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const prams = useParams();
  const { casealias } = prams;
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  // RTK Hooks for API calls
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias }
  );
  const { data, isLoading } = useGetPortfolioDetailsQuery({
    case_alias: casealias,
  });
  const [exportPropertiesCSV, { isLoading: isExporting }] =
    useExportPropertiesCSVMutation();

  const currentTab: string | null = useAppSelector(
    (state) => state.caseDetails.basicTabId
  );
  const handleNextTab = () => {
    const nextTabNav = getNextTabNav(caseData?.case_stage, currentTab!);
    if (nextTabNav) {
      dispatch(basicTabIndicator(nextTabNav));
    } else {
      toast.warning("This is the last tab.");
    }
  };

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const toggleDeleteModal = () => setDeleteModalOpen((s) => !s);

  const handleDeleteClick = (property: any) => {
    setSelectedProperty(property);
    setDeleteModalOpen(true);
  };

  const handleExportToCSV = async () => {
    try {
      const blob = await exportPropertiesCSV({
        case_alias: casealias,
      }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "properties-report.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to export properties to CSV.");
      console.error("Export error:", error);
    }
  };

  return (
    <>
      <Container fluid className="p-4">
        <Row>
          <Card>
            <CardHeader className="bg-primary">
              <span className="fs-5">Summary of client declared values</span>
            </CardHeader>
            <CardBody className="p-0 mt-5">
              <PortfolioSummary data={data} />
            </CardBody>
          </Card>
        </Row>
        <hr />
        <Row className="mb-4">
          <Col md={12}>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between mb-2">
                  <h5 className="mb-0 fs-3 text-primary">
                    Additional Properties
                  </h5>
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      outline
                      color="primary"
                      className="d-flex gap-1"
                      onClick={handleExportToCSV}
                      disabled={isExporting || data.length === 0}
                    >
                      <FaFileExport />
                      {isExporting ? "Exporting..." : " Export to CSV"}
                    </Button>
                    <Button
                      color="success"
                      className="border-success"
                      onClick={toggleModal}
                      disabled={
                        session?.user?.user_type === "CLIENT" &&
                        data.map((item: any) => item?.alias).length > 0
                      }
                    >
                      Add Portfolio
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="mt-3">
                  {data && data.length === 0 ? (
                    <div className="p-4 text-center text-muted">
                      <i className="fa-solid fa-inbox fs-3 mb-2 d-block"></i>
                      <div className="fw-semibold">
                        No additional properties found.
                      </div>
                      <div className="small">
                        You can add a portfolio using the button above.
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <Table
                          className="table table-bordered table-hover"
                          style={{ fontSize: "0.9rem" }}
                        >
                          <thead className="table-light">
                            <tr>
                              <th className="text-center">Action</th>
                              <th>Applicant/s</th>
                              <th>Full Address</th>
                              <th>Property Value</th>
                              <th>Monthly Rental</th>
                              <th>Lender</th>
                              <th>Balance</th>
                              <th>Value At Purchase</th>
                              <th>Date Purchased</th>
                              <th>Monthly Payment</th>
                              <th>Loan To Value</th>
                              <th>ICR</th>
                              <th>Is HMO</th>
                              <th>Is MUFB</th>
                              <th>EPC Rating</th>
                              <th>Repayment Type</th>
                              <th>To Be Repaid</th>
                              <th>Current Rate</th>
                              <th>Rate Type</th>
                              <th>Current Rate End Date</th>
                              <th>ERC End Date</th>
                              <th>Account Number</th>
                              <th>Ownership</th>
                              <th>Is Ltd Co</th>
                              <th>Remaining Mortgage Term</th>
                              <th>Bedrooms</th>
                              <th>Year Built</th>
                              <th>Leasehold</th>
                              <th>Property Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data?.map((item: any) => (
                              <tr key={item?.alias}>
                                <td>
                                  <div className="text-center d-flex justify-content-center align-items-center">
                                    <Button
                                      color="danger"
                                      size="sm"
                                      outline
                                      onClick={() => handleDeleteClick(item)}
                                      className="text-truncate d-flex gap-1"
                                    >
                                      <i className="fa-solid fa-trash"></i>
                                      Delete
                                    </Button>
                                  </div>
                                </td>
                                <td>
                                  {item?.applicant &&
                                  item.applicant.length > 0 ? (
                                    <ul
                                      className="mb-0 text-truncate"
                                      style={{
                                        listStyleType: "disc",
                                        paddingLeft: "40px",
                                      }}
                                    >
                                      {item.applicant.map(
                                        (app: any, idx: number) => (
                                          <li key={app?.id ?? idx}>
                                            {`${app?.first_name || ""} ${
                                              app?.last_name || ""
                                            }`.trim() || "-"}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  ) : (
                                    "-"
                                  )}
                                </td>
                                <td>{`${item?.house_name_or_number}, ${item?.address_1}, ${item?.city}, ${item?.postcode}`}</td>
                                <td>
                                  £
                                  {Number(
                                    item?.property_value
                                  ).toLocaleString()}
                                </td>
                                <td>
                                  £
                                  {Number(
                                    item?.monthly_rental_income
                                  ).toLocaleString()}
                                </td>
                                <td>{item?.mortgage_lender || "-"}</td>
                                <td>
                                  £
                                  {Number(
                                    item?.current_mortgage_balance
                                  ).toLocaleString()}
                                </td>
                                <td>
                                  £
                                  {Number(
                                    item?.value_at_purchase
                                  ).toLocaleString()}
                                </td>
                                <td>
                                  {item?.date_purchased
                                    ? formatDateToDMY(item.date_purchased)
                                    : "-"}
                                </td>
                                <td>
                                  £
                                  {Number(
                                    item?.monthly_mortgage_payment
                                  ).toLocaleString()}
                                </td>
                                <td>
                                  {(
                                    (Number(item?.current_mortgage_balance) /
                                      Number(item?.property_value)) *
                                    100
                                  ).toFixed(2)}
                                  %
                                </td>
                                <td>
                                  {(
                                    Number(item?.monthly_rental_income) /
                                    Number(item?.monthly_mortgage_payment)
                                  ).toFixed(2)}
                                </td>
                                <td>
                                  <div className="d-flex justify-content-center fs-4">
                                    {item?.is_hmo ? (
                                      <i className="fa-solid fa-circle-check text-success"></i>
                                    ) : (
                                      <i className="fa-solid fa-circle-xmark text-danger"></i>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-center fs-4">
                                    {item?.is_mufb ? (
                                      <i className="fa-solid fa-circle-check text-success"></i>
                                    ) : (
                                      <i className="fa-solid fa-circle-xmark text-danger"></i>
                                    )}
                                  </div>
                                </td>
                                <td>{item?.epc_rating || "-"}</td>
                                <td>{item?.repayment_type || "-"}</td>
                                <td>{item?.to_be_repaid || "-"}</td>
                                <td>{item?.current_rate || "-"}</td>
                                <td>{item?.rate_type || "-"}</td>
                                <td>
                                  {item?.current_rate_end_date
                                    ? formatDateToDMY(
                                        item.current_rate_end_date
                                      )
                                    : "-"}
                                </td>
                                <td>
                                  {item?.erc_end_date
                                    ? formatDateToDMY(item.erc_end_date)
                                    : "-"}
                                </td>
                                <td>{item?.account_number || "-"}</td>
                                <td>{item?.ownership || "-"}</td>
                                <td>
                                  <div className="d-flex justify-content-center fs-4">
                                    {item?.is_limited_company ? (
                                      <i className="fa-solid fa-circle-check text-success"></i>
                                    ) : (
                                      <i className="fa-solid fa-circle-xmark text-danger"></i>
                                    )}
                                  </div>
                                </td>
                                <td>{item?.remaining_mortgage_term || "-"}</td>
                                <td>{item?.number_of_bedrooms || "-"}</td>
                                <td>{item?.year_built || "-"}</td>
                                <td>{item?.leasehold || "-"}</td>
                                <td>{item?.property_type || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                      <div className="mt-4 border-1 border-dark p-3 rounded">
                        <span className="fw-semibold fs-5">Notes:</span>
                        <ul>
                          {data.map((item: any, index: number) =>
                            item?.note ? (
                              <li
                                key={item.id}
                                className="fw-medium mb-4 border-b-primary"
                              >
                                <span className="text-decoration-underline fs-6">{`Property ${
                                  index + 1
                                } note:`}</span>
                                <br />
                                <span>{item.note}</span>
                              </li>
                            ) : (
                              <li
                                key={item.id}
                                className="text-muted fw-medium fs-6 mb-4 border-b-primary"
                              >
                                {`Property ${index + 1} has no note.`}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div className="d-flex justify-content-end">
          <Button
            type="submit"
            color="secondary"
            onClick={() => {
              handleNextTab();
            }}
          >
            {session?.user?.user_type === "CLIENT" &&
            data.map((item: any) => item?.alias).length > 0
              ? "Go to Next"
              : "Save & Next"}
          </Button>
        </div>
      </Container>

      <AddPropertyModal isOpen={isModalOpen} toggle={toggleModal} />
      <DeletePropertyModal
        isOpen={deleteModalOpen}
        toggle={toggleDeleteModal}
        propertyAlias={selectedProperty?.alias}
        propertyLabel={
          selectedProperty
            ? `${selectedProperty?.house_name_or_number || ""} ${
                selectedProperty?.address_1 || ""
              }`
            : undefined
        }
        onDeleteComplete={() => {
          // close modal handled in modal, but also clear selected
          setSelectedProperty(null);
        }}
      />
    </>
  );
};

export default PortfolioContent;
