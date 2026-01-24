import { useGetDefaultsQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/AdverseDetails/AdverseDetailsApi";
import { ViewDefaultsModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/AdverseTypes";
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

const ViewDefaultsModal: React.FC<ViewDefaultsModalProps> = ({
  isOpen,
  toggle,
  adverseAlias,
}) => {
  const params = useParams();
  const { casealias } = params;

  const { data, isLoading } = useGetDefaultsQuery({
    case_alias: casealias,
    adverse_alias: adverseAlias,
  });

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  const formatAmount = (amount: string) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(Number(amount));
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="xl">
      <ModalHeader toggle={toggle}>
        <h2>View Defaults</h2>
      </ModalHeader>

      <ModalBody className="p-4">
        {isLoading ? (
          <div className="text-center p-4">
            <Spinner color="primary" />
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center p-4">No defaults found</div>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Loan Company</th>
                  <th>Date Registered</th>
                  <th>Status</th>
                  <th>Date Satisfied</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>{formatAmount(item.amount)}</td>
                    <td>{item.loan_company_name || "-"}</td>
                    <td>{formatDate(item.date_registered)}</td>
                    <td>
                      <span
                        className={`badge ${
                          item.has_satisfied ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {item.has_satisfied ? "Satisfied" : "Not Satisfied"}
                      </span>
                    </td>
                    <td>{formatDate(item.date_satisfied)}</td>
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

export default ViewDefaultsModal;
