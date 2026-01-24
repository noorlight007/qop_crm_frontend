import { useGetIVAsQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/AdverseDetails/AdverseDetailsApi";
import {
  IVAItemProps,
  ViewIVAsModalProps,
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

const ViewIVAsModal: React.FC<ViewIVAsModalProps> = ({
  isOpen,
  toggle,
  adverseAlias,
}) => {
  const params = useParams();
  const { casealias } = params;
  const { data: ivasData, isLoading } = useGetIVAsQuery({
    case_alias: casealias,
    adverse_alias: adverseAlias,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>
        <h2>View IVAs</h2>
      </ModalHeader>

      <ModalBody className="p-4">
        <Table responsive striped bordered>
          <thead>
            <tr>
              <th>Date Registered</th>
              <th>Outstanding Balance</th>
              <th>Satisfied</th>
              <th>Date Satisfied</th>
            </tr>
          </thead>
          <tbody>
            {ivasData && ivasData.length > 0 ? (
              ivasData.map((iva: IVAItemProps, index: number) => (
                <tr key={index}>
                  <td>{iva.date_registered || "-"}</td>
                  <td>
                    {iva.outstanding_balance
                      ? `£${parseFloat(iva.outstanding_balance).toLocaleString(
                          "en-GB",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}`
                      : "-"}
                  </td>
                  <td>{iva.satisfied ? "Yes" : "No"}</td>
                  <td>{iva.satisfied ? iva.date_satisfied || "-" : "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center">
                  No IVAs found
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

export default ViewIVAsModal;
