import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { basicTabIndicator } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/CaseDetailsTabIndicatorSlice";
import { useGetCreditCommitmentsDetailsQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/CreditCommitmentsDetails/CreditCommitmentsDetailsApi";
import LoadingSpinner from "@/app/loading";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
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
import AddCreditCommitmentModal from "./CreditCommitmentsModals/AddCreditCommitmentModal";
import DeleteCreditCommitmentModal from "./CreditCommitmentsModals/DeleteCreditCommitmentModal";
import UpdateCreditCommitmentModal from "./CreditCommitmentsModals/UpdateCreditCommitmentModal";

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
  const dispatch = useAppDispatch();
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias }
  );
  // rtk hooks end

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

  if (isLoading)
    return (
      <div>
        <LoadingSpinner />
      </div>
    );

  if (creditCommitments?.data?.length === 0) return <div>No data found</div>;

  // Add calculation function
  const calculateTotals = () => {
    if (!creditCommitments)
      return {
        totalBalance: 0,
        totalBalanceToBeRepaid: 0,
        totalBalanceToRemain: 0,
        totalMonthlyPayment: 0,
        totalMonthlyPaymentToBeRepaid: 0,
        totalMonthlyPaymentToRemain: 0,
        totalSettlementBalance: 0,
      };

    return creditCommitments.reduce(
      (acc: any, item: any) => {
        const osBalance = Number(item.os_balance) || 0;
        const monthlyPayment = Number(item.monthly_repayment) || 0;
        const settlementBalance = Number(item.settlement_balance) || 0;
        const isPaidOnCompletion =
          item.paid_on_completion?.toLowerCase() === "yes";

        return {
          totalBalance: acc.totalBalance + osBalance,
          totalBalanceToBeRepaid:
            acc.totalBalanceToBeRepaid + (isPaidOnCompletion ? osBalance : 0),
          totalBalanceToRemain:
            acc.totalBalanceToRemain + (isPaidOnCompletion ? 0 : osBalance),
          totalMonthlyPayment: acc.totalMonthlyPayment + monthlyPayment,
          totalMonthlyPaymentToBeRepaid:
            acc.totalMonthlyPaymentToBeRepaid +
            (isPaidOnCompletion ? monthlyPayment : 0),
          totalMonthlyPaymentToRemain:
            acc.totalMonthlyPaymentToRemain +
            (isPaidOnCompletion ? 0 : monthlyPayment),
          totalSettlementBalance:
            acc.totalSettlementBalance + settlementBalance,
        };
      },
      {
        totalBalance: 0,
        totalBalanceToBeRepaid: 0,
        totalBalanceToRemain: 0,
        totalMonthlyPayment: 0,
        totalMonthlyPaymentToBeRepaid: 0,
        totalMonthlyPaymentToRemain: 0,
        totalSettlementBalance: 0,
      }
    );
  };

  const totals = calculateTotals();

  return (
    <Container>
      <Row>
        <Col lg="4" md="12">
          <Card className="shadow">
            <CardBody className="support-ticket-font pt-2 pb-3 border-3 rounded-3 border-b-primary">
              <CardHeader className="pt-0 pb-1 m-0 text-center">
                <h6 className="fw-bold fs-6">Total Balance</h6>
              </CardHeader>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-primary h1">
                  <i className="fa-solid fa-sterling-sign"></i>
                </span>
                <span className="h2 text-primary font-weight-bold">
                  £{totals.totalBalance.toFixed(2)}
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4" md="12">
          <Card className="shadow">
            <CardBody className="support-ticket-font pt-2 pb-3 border-3 rounded-3 border-b-secondary">
              <CardHeader className="pt-0 pb-1 m-0 text-center">
                <h6 className="fw-bold">Total Balance To Be Repaid</h6>
              </CardHeader>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-secondary h1">
                  <i className="fa-solid fa-sterling-sign"></i>
                </span>
                <span className="h2 text-secondary font-weight-bold">
                  £{totals.totalBalanceToBeRepaid.toFixed(2)}
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4" md="12">
          <Card className="shadow">
            <CardBody className="support-ticket-font pt-2 pb-3 border-3 rounded-3 border-b-success">
              <CardHeader className="pt-0 pb-1 m-0 text-center">
                <h6 className="fw-bold">Total Balance To Remain</h6>
              </CardHeader>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-success h1">
                  <i className="fa-solid fa-sterling-sign"></i>
                </span>
                <span className="h2 text-success font-weight-bold">
                  £{totals.totalBalanceToRemain.toFixed(2)}
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* 2nd row  */}
      <Row>
        <Col lg="4" md="12">
          <Card className="shadow">
            <CardBody className="support-ticket-font pt-2 pb-3 border-3 rounded-3 border-b-primary">
              <CardHeader className="pt-0 pb-1 m-0 text-center">
                <h6 className="fw-bold">Total Monthly Payment</h6>
              </CardHeader>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-primary h1">
                  <i className="fa-solid fa-calendar-days"></i>
                </span>
                <span className="h2 text-primary font-weight-bold">
                  £{totals.totalMonthlyPayment.toFixed(2)}
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4" md="12">
          <Card className="shadow">
            <CardBody className="support-ticket-font pt-2 pb-3 border-3 rounded-3 border-b-secondary">
              <CardHeader className="pt-0 pb-1 m-0 text-center">
                <h6 className="fw-bold">Total Monthly Payment To Be Repaid</h6>
              </CardHeader>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-secondary h1">
                  <i className="fa-solid fa-calendar-days"></i>
                </span>
                <span className="h2 text-secondary font-weight-bold">
                  £{totals.totalMonthlyPaymentToBeRepaid.toFixed(2)}
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4" md="12">
          <Card className="shadow">
            <CardBody className="support-ticket-font pt-2 pb-3 border-3 rounded-3 border-b-success">
              <CardHeader className="pt-0 pb-1 m-0 text-center">
                <h6 className="fw-bold">Total Monthly Payment To Remain</h6>
              </CardHeader>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-success h1">
                  <i className="fa-solid fa-calendar-days"></i>
                </span>
                <span className="h2 text-success font-weight-bold">
                  £{totals.totalMonthlyPaymentToRemain.toFixed(2)}
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* 3r row  */}
      <Row>
        <Col lg="4" md="12">
          <Card className="shadow">
            <CardBody className="support-ticket-font pt-2 pb-3 border-3 rounded-3 border-b-primary">
              <CardHeader className="pt-0 pb-1 m-0 text-center">
                <h6 className="fw-bold">Total Settlement Balance</h6>
              </CardHeader>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-primary h1">
                  <i className="fa-solid fa-sterling-sign"></i>
                </span>
                <span className="h2 text-primary font-weight-bold">
                  £{totals.totalSettlementBalance.toFixed(2)}
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* Cards Rows end  */}
      <Row>
        <Col className="d-flex justify-content-between">
          <Button
            color="secondary"
            type="submit"
            className="d-flex justify-content-center align-items-center gap-1"
          >
            <span>View Summary</span>
            <i className="fa-solid fa-eye"></i>
          </Button>
          <Button
            color="primary"
            type="submit"
            className="d-flex justify-content-center align-items-center gap-1"
            onClick={() => setModalIsOpen(!modalIsOpen)}
            disabled={session?.user?.user_type === "CLIENT"}
          >
            <span>Add Credit Item</span>
            <i className="fa-solid fa-circle-plus"></i>
          </Button>
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
                <th>OS Balance (£)</th>
                <th>Settlement Balance (£)</th>
                <th>Monthly Repayment (£)</th>
                <th>Interest Rate (%)</th>
                <th>Card Limit (£)</th>
                <th>Term Remaining (Months)</th>
                <th>Balloon Payment (£)</th>
                <th>Court Ordered</th>
                <th>Cost of Credit (£)</th>
                <th>Paid on Completion</th>
                <th>Source</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {!creditCommitments || creditCommitments.length === 0 ? (
                <tr>
                  <td colSpan={18} className="text-center">
                    <span className="text-danger opacity-75 fs-6">
                      No credit commitments available
                    </span>
                  </td>
                </tr>
              ) : (
                creditCommitments.map((item: any, index: number) => (
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
                              `${item.applicant_details?.first_name || ""} ${
                                item.applicant_details?.last_name || ""
                              }`
                            );
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    </td>
                    <td>
                      {`${item.applicant_details?.first_name || ""} ${
                        item.applicant_details?.last_name || ""
                      }` || "-"}
                    </td>
                    <td>
                      <div className="d-flex justify-content-center align-items-center fs-4">
                        {item.joint?.toLowerCase() === "yes" ? (
                          <i className="fa-solid fa-circle-check text-success"></i>
                        ) : item.joint?.toLowerCase() === "no" ? (
                          <i className="fa-solid fa-circle-xmark text-danger"></i>
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
                        `£${item.os_balance.toFixed(2)}`
                      ) : (
                        <span className="text-danger opacity-50">£0.00</span>
                      )}
                    </td>
                    <td>£{item.settlement_balance?.toFixed(2) || "0.00"}</td>
                    <td>£{item.monthly_repayment?.toFixed(2) || "0.00"}</td>
                    <td>{item.interest_rate?.toFixed(2) || "0.00"}%</td>
                    <td>£{item.card_limit?.toFixed(2) || "0.00"}</td>
                    <td>{item.term_remaining || "0"}</td>
                    <td>£{item.balloon_payment?.toFixed(2) || "0.00"}</td>
                    <td>
                      <div className="d-flex justify-content-center align-items-center fs-4">
                        {item.court_ordered?.toLowerCase() === "yes" ? (
                          <i className="fa-solid fa-circle-check text-success"></i>
                        ) : item.court_ordered?.toLowerCase() === "no" ? (
                          <i className="fa-solid fa-circle-xmark text-danger"></i>
                        ) : (
                          "-"
                        )}
                      </div>
                    </td>
                    <td>£{item.cost_of_credit?.toFixed(2) || "0.00"}</td>
                    <td>
                      <div className="d-flex justify-content-center align-items-center fs-4">
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
        <Button
          type="submit"
          color="secondary"
          onClick={() => {
            handleNextTab();
          }}
        >
          {session?.user?.user_type === "CLIENT" ? "Go To Next" : "Save & Next"}
        </Button>
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
        casealias={casealias?.toString()}
        creditCommitmentAlias={selectedItemAlias}
        creditCommitmentName={selectedItemName}
      />
      {/* modals end */}
    </Container>
  );
};

export default CreditCommitmentsContent;
