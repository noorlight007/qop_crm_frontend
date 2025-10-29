import { useGetCommitmentPaymentsQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/AdverseDetails/AdverseDetailsApi";
import { ViewCommitmentPaymentsMissedModalProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/AdverseTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import { useParams } from "next/navigation";
import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
} from "reactstrap";

const ViewCommitmentPaymentsMissedModal: React.FC<
  ViewCommitmentPaymentsMissedModalProps
> = ({ isOpen, toggle, adverseAlias }) => {
  const params = useParams();
  const { casealias } = params;

  const { data, isLoading } = useGetCommitmentPaymentsQuery({
    case_alias: casealias,
    adverse_alias: adverseAlias,
  });

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="xl">
      <ModalHeader toggle={toggle}>
        <h2>View Commitment Payments Missed</h2>
      </ModalHeader>

      <ModalBody className="p-4">
        {isLoading ? (
          <div className="text-center p-4">
            <Spinner color="primary" />
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center p-4">No commitment payments found</div>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Commitment Type</th>
                  <th>Loan Company</th>
                  <th>Status</th>
                  <th>Date Cleared</th>
                  <th>3 Months</th>
                  <th>12 Months</th>
                  <th>24 Months</th>
                  <th>36 Months</th>
                  <th>60 Months</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>
                      {item?.commitment_type
                        ? formatChoiceFieldValue(item.commitment_type)
                        : "-"}
                    </td>
                    <td>{item?.loan_company_name || "-"}</td>
                    <td>{item?.cleared ? "Cleared" : "Not Cleared"}</td>
                    <td>{formatDate(item?.date_cleared)}</td>
                    <td>
                      {item?.missed_payments_in_the_last_three_months || 0}
                    </td>
                    <td>
                      {item?.missed_payments_in_the_last_twelve_months || 0}
                    </td>
                    <td>
                      {item?.missed_payments_in_the_last_twenty_four_months ||
                        0}
                    </td>
                    <td>
                      {item?.missed_payments_in_the_last_thirty_six_months || 0}
                    </td>
                    <td>
                      {item?.missed_payments_in_the_last_sixty_months || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ViewCommitmentPaymentsMissedModal;
