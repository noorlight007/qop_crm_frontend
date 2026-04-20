import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import { useGetCreditCommitmentsDetailsQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CreditCommitmentsDetails/CreditCommitmentsDetailsApi";
import { useExportCreditCommitmentsMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CreditCommitmentsDetails/ExportCreditCommitmentsApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import LoadingSpinner from "@/app/loading";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import getCurrencySign from "@/utils/currency";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FaFileExport } from "react-icons/fa";
import { TbCircleCheck, TbCirclePlus } from "react-icons/tb";
import { toast } from "react-toastify";
import { Button, Col, Row, Table } from "reactstrap";
import AddCreditCommitmentModal from "./CreditCommitmentsModals/AddCreditCommitmentModal";
import DeleteCreditCommitmentModal from "./CreditCommitmentsModals/DeleteCreditCommitmentModal";
import UpdateCreditCommitmentModal from "./CreditCommitmentsModals/UpdateCreditCommitmentModal";
import CreditCommitmentsSummary from "./CreditCommitmentsSummary";

const CreditCommitmentsContent: React.FC = () => {
  const { casealias } = useParams();
  const { data: session } = useSession();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  // Add these states at the top with other state declarations
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [selectedCreditData, setSelectedCreditData] = useState<any>(null);
  // Add this state to track which item is being deleted
  const [selectedItemAlias, setSelectedItemAlias] = useState<string>("");
  const [selectedItemName, setSelectedItemName] = useState<string>("");
  // rtk hooks
  const { data: creditCommitments, isLoading } =
    useGetCreditCommitmentsDetailsQuery({ case_alias: casealias });

  // Filter credit commitments based on user role
  const getFilteredCreditCommitments = (data: any[] | undefined) => {
    if (!data) return [];

    const userRole = session?.user?.role;
    const userEmail = session?.user?.email;

    // If user is an APPLICANT, show only their own credit commitments
    if (userRole === "APPLICANT" && userEmail) {
      return data.filter(
        (commitment) => commitment?.customer?.email === userEmail,
      );
    }

    // For other roles (DIRECTOR, ADMIN, etc.), show all credit commitments
    return data;
  };

  const filteredCreditCommitments =
    getFilteredCreditCommitments(creditCommitments);

  const dispatch = useAppDispatch();
  const { data: caseData } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );
  const [exportCreditCommitmentsCSV, { isLoading: isExporting }] =
    useExportCreditCommitmentsMutation();
  // rtk hooks end

  const currentTab: string | null = useAppSelector(
    (state) => state.caseSections.basicTabId,
  );

  const handleNextTab = () => {
    const nextTabNav = getNextTabNav(
      caseData?.case_stage,
      caseData?.case_category,
      currentTab!,
    );
    if (nextTabNav) {
      dispatch(basicTabIndicator(nextTabNav));
    } else {
      toast.warning("This is the last tab.");
    }
  };

  const handleExportToCSV = async () => {
    try {
      const blob = await exportCreditCommitmentsCSV({
        case_alias: casealias,
      }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "credit-commitments-report.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to export properties to CSV.");
      console.error("Export error:", error);
    }
  };

  const canApplicantEdit = (): boolean => {
    if (session?.user?.role === "APPLICANT") {
      return (
        caseData?.case_stage === "ENQUIRY" ||
        caseData?.case_stage === "FACT_FIND"
      );
    }
    return true; // Non-applicant users can always edit
  };

  return (
    <div className="p-2">
      <CreditCommitmentsSummary />
      <Row>
        <Col className="d-flex justify-content-end gap-2">
          <Button
            color="secondary"
            type="submit"
            className="d-flex justify-content-center align-items-center gap-1"
            onClick={handleExportToCSV}
            disabled={
              isExporting ||
              !filteredCreditCommitments ||
              filteredCreditCommitments.length === 0
            }
          >
            <FaFileExport />
            <span>Export CSV</span>
          </Button>
          {canApplicantEdit() && (
            <Button
              color="primary"
              type="submit"
              className="d-flex justify-content-center align-items-center gap-1"
              onClick={() => setModalIsOpen(!modalIsOpen)}
            >
              <TbCirclePlus />
              <span>Add Credit Item</span>
            </Button>
          )}
        </Col>
      </Row>
      {/* Table start  */}
      <Row className="mt-4">
        <Col>
          {/* <div className="table-responsive"> */}
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Actions</th>
                <th>Applicant</th>
                <th>Joint</th>
                <th>Type</th>
                <th>Company</th>
                <th>Account No.</th>
                <th>OS Balance ({getCurrencySign()})</th>
                <th>Settlement Balance ({getCurrencySign()})</th>
                <th>Monthly Repayment ({getCurrencySign()})</th>
                <th>Interest Rate (%)</th>
                <th>Card Limit ({getCurrencySign()})</th>
                <th>Term Remaining (Months)</th>
                <th>Balloon Payment ({getCurrencySign()})</th>
                <th>Court Ordered</th>
                <th>Cost of Credit ({getCurrencySign()})</th>
                <th>Paid on Completion</th>
                <th>Source</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={18} className="text-center py-4">
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : !filteredCreditCommitments ||
                filteredCreditCommitments.length === 0 ? (
                <tr>
                  <td colSpan={18} className="text-center">
                    <span className="text-danger opacity-75 fs-6">
                      No credit commitments available
                    </span>
                  </td>
                </tr>
              ) : (
                filteredCreditCommitments.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            setSelectedCreditData(item);
                            setIsUpdateModalOpen(true);
                          }}
                        >
                          <i className="fa fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            setSelectedItemAlias(item.alias);
                            setSelectedItemName(
                              `${formatChoiceFieldValue(item.customer?.title) || ""} ${item.customer?.first_name || ""} ${item.customer?.middle_name || ""} ${
                                item.customer?.last_name || ""
                              }`,
                            );
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    </td>
                    <td className="text-truncate">
                      {`${formatChoiceFieldValue(item.customer?.title) || ""} ${item.customer?.first_name || ""} ${item.customer?.middle_name || ""} ${
                        item.customer?.last_name || ""
                      }` || "-"}
                    </td>
                    <td>
                      <div className="d-flex justify-content-center align-items-center fs-5">
                        {item.joint?.toLowerCase() === "yes" ? (
                          <TbCircleCheck className="text-primary" />
                        ) : item.joint?.toLowerCase() === "no" ? (
                          <TbCircleCheck className="text-danger" />
                        ) : (
                          "-"
                        )}
                      </div>
                    </td>
                    <td>
                      {item.type ? formatChoiceFieldValue(item.type) : "-"}
                    </td>
                    <td>{item.company || "-"}</td>
                    <td>{item.account_no || "-"}</td>
                    <td>
                      {item.os_balance ? (
                        `${getCurrencySign()}${item.os_balance.toFixed(2)}`
                      ) : (
                        <span className="text-danger opacity-50">
                          {getCurrencySign()}0.00
                        </span>
                      )}
                    </td>
                    <td>
                      {getCurrencySign()}
                      {item.settlement_balance?.toFixed(2) || "0.00"}
                    </td>
                    <td>
                      {getCurrencySign()}
                      {item.monthly_repayment?.toFixed(2) || "0.00"}
                    </td>
                    <td>{item.interest_rate?.toFixed(2) || "0.00"}%</td>
                    <td>
                      {getCurrencySign()}
                      {item.card_limit?.toFixed(2) || "0.00"}
                    </td>
                    <td>{item.term_remaining || "0"}</td>
                    <td>
                      {getCurrencySign()}
                      {item.balloon_payment?.toFixed(2) || "0.00"}
                    </td>
                    <td>
                      <div className="d-flex justify-content-center align-items-center fs-5">
                        {item.court_ordered?.toLowerCase() === "yes" ? (
                          <i className="fa-solid fa-circle-check text-success"></i>
                        ) : item.court_ordered?.toLowerCase() === "no" ? (
                          <i className="fa-solid fa-circle-xmark text-danger"></i>
                        ) : (
                          "-"
                        )}
                      </div>
                    </td>
                    <td>
                      {getCurrencySign()}
                      {item.cost_of_credit?.toFixed(2) || "0.00"}
                    </td>
                    <td>
                      <div className="d-flex justify-content-center align-items-center fs-5">
                        {item.paid_on_completion?.toLowerCase() === "yes" ? (
                          <i className="fa-solid fa-circle-check text-success"></i>
                        ) : item.paid_on_completion?.toLowerCase() === "no" ? (
                          <i className="fa-solid fa-circle-xmark text-danger"></i>
                        ) : (
                          "-"
                        )}
                      </div>
                    </td>
                    <td>{item.source || "-"}</td>
                    <td>
                      {item.has_the_unsecured_credit_mounted_up || (
                        <span className="text-danger opacity-50">
                          No note available
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          {/* </div> */}
        </Col>
      </Row>
      <div className=" mt-3 d-flex justify-content-end">
        {session?.user?.role !== "APPLICANT" && (
          <Button
            type="submit"
            color="secondary"
            onClick={() => {
              handleNextTab();
            }}
          >
            {/* {session?.user?.role === "APPLICANT" ? "Go To Next" : "Save & Next"} */}
            Save & Next
          </Button>
        )}
      </div>
      {/* modals start */}
      <AddCreditCommitmentModal
        isOpen={modalIsOpen}
        toggle={() => setModalIsOpen(!modalIsOpen)}
      />
      <UpdateCreditCommitmentModal
        isOpen={isUpdateModalOpen}
        toggle={() => setIsUpdateModalOpen(!isUpdateModalOpen)}
        casealias={casealias?.toString()}
        creditData={selectedCreditData}
      />
      <DeleteCreditCommitmentModal
        isOpen={isDeleteModalOpen}
        toggle={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
        onDelete={() => setIsDeleteModalOpen(false)}
        casealias={casealias?.toString()}
        creditCommitmentAlias={selectedItemAlias}
        creditCommitmentName={selectedItemName}
      />
      {/* modals end */}
    </div>
  );
};

export default CreditCommitmentsContent;
