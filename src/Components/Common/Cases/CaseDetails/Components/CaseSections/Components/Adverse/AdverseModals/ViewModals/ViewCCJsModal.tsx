import { useGetCCJsQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/AdverseDetails/AdverseDetailsApi";
import {
  CCJProps,
  ViewCCJsModalProps,
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

const ViewCCJsModal: React.FC<ViewCCJsModalProps> = ({
  isOpen,
  toggle,
  adverseAlias,
}) => {
  const params = useParams();
  const { casealias } = params;
  const { data: ccjs, isLoading } = useGetCCJsQuery({
    case_alias: casealias,
    adverse_alias: adverseAlias,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>
        <h2>View CCJs</h2>
      </ModalHeader>

      <ModalBody className="p-4">
        <Table responsive striped bordered>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Company Name</th>
              <th>Date Registered</th>
              <th>Satisfied</th>
              <th>Date Satisfied</th>
            </tr>
          </thead>
          <tbody>
            {ccjs && ccjs.length > 0 ? (
              ccjs.map((ccj: CCJProps, index: number) => (
                <tr key={index}>
                  <td>
                    {ccj.amount
                      ? `£${parseFloat(ccj.amount).toLocaleString("en-GB", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : "-"}
                  </td>
                  <td>{ccj.loan_company_name || "-"}</td>
                  <td>{ccj.date_registered || "-"}</td>
                  <td>{ccj.has_satisfied ? "Yes" : "No"}</td>
                  <td>{ccj.has_satisfied ? ccj.date_satisfied || "-" : "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No CCJs found
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

export default ViewCCJsModal;
