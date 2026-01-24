import { useGetPayDayLoansQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/AdverseDetails/AdverseDetailsApi";
import {
  PayDayLoanProps,
  ViewPayDayLoansModalProps,
} from "@/Types/Common/Cases/CaseDetails/CaseSections/AdverseTypes";
import { useParams } from "next/navigation";
import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from "reactstrap";

const ViewPayDayLoansModal: React.FC<ViewPayDayLoansModalProps> = ({
  isOpen,
  toggle,
  adverseAlias,
}) => {
  const params = useParams();
  const { casealias } = params;
  const { data: payDayLoans, isLoading } = useGetPayDayLoansQuery({
    case_alias: casealias,
    adverse_alias: adverseAlias,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>
        <h2>View Pay Day Loans</h2>
      </ModalHeader>

      <ModalBody className="p-4">
        <Table responsive striped bordered>
          <thead>
            <tr>
              <th>Loan Amount</th>
              <th>Loan Date</th>
              <th>Repaid</th>
              <th>Date Repaid</th>
              <th>Lender Name</th>
            </tr>
          </thead>
          <tbody>
            {payDayLoans && payDayLoans.length > 0 ? (
              payDayLoans.map((loan: PayDayLoanProps, index: number) => (
                <tr key={index}>
                  <td>
                    {loan.loan_amount
                      ? `£${parseFloat(loan.loan_amount).toLocaleString(
                          "en-GB",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}`
                      : "-"}
                  </td>
                  <td>{loan.loan_date || "-"}</td>
                  <td>
                    {loan.has_the_pay_day_loan_been_repaid ? "Yes" : "No"}
                  </td>
                  <td>
                    {loan.has_the_pay_day_loan_been_repaid
                      ? loan.date_repaid || "-"
                      : "-"}
                  </td>
                  <td>{loan.lender_name || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No Pay Day Loans found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ViewPayDayLoansModal;
