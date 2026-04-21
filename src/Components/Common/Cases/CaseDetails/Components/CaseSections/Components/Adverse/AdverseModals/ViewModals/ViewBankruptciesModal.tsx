import { LoadingSpinner2 } from "@/app/loading";
import { useGetBankruptsQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/AdverseDetails/AdverseDetailsApi";
import { ViewBankruptciesModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/AdverseTypes";
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

const ViewBankruptciesModal: React.FC<ViewBankruptciesModalProps> = ({
  isOpen,
  toggle,
  adverseAlias,
}) => {
  const params = useParams();
  const { casealias } = params;

  const { data, isLoading } = useGetBankruptsQuery({
    case_alias: casealias,
    adverse_alias: adverseAlias,
  });

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>
        <h2>View Bankruptcies</h2>
      </ModalHeader>

      <ModalBody className="p-4">
        {isLoading ? (
          <div className="text-center p-4">
            <LoadingSpinner2 />
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center p-4">No bankruptcies found</div>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Date Discharged</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>{formatDate(item.date_discharged)}</td>
                    <td>
                      <span
                        className={`badge ${
                          item.date_discharged ? "bg-success" : "bg-warning"
                        }`}
                      >
                        {item.date_discharged ? "Discharged" : "Pending"}
                      </span>
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

export default ViewBankruptciesModal;
