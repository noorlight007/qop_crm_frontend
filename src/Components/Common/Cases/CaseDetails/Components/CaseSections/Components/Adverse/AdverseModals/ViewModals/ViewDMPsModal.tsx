import { useGetDMPsQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/AdverseDetails/AdverseDetailsApi";
import {
  DMPItemProps,
  ViewDMPsModalProps,
} from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/AdverseTypes";
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

const ViewDMPsModal: React.FC<ViewDMPsModalProps> = ({
  isOpen,
  toggle,
  adverseAlias,
}) => {
  const params = useParams();
  const { casealias } = params;
  const { data: dmpsData, isLoading } = useGetDMPsQuery({
    case_alias: casealias,
    adverse_alias: adverseAlias,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>
        <h2>View DMPs</h2>
      </ModalHeader>

      <ModalBody className="p-4">
        <Table responsive striped bordered>
          <thead>
            <tr>
              <th>Plan Type</th>
              <th>Company Name</th>
              <th>Date Registered</th>
              <th>Outstanding Balance</th>
              <th>Satisfied</th>
              <th>Date Satisfied</th>
            </tr>
          </thead>
          <tbody>
            {dmpsData && dmpsData.length > 0 ? (
              dmpsData.map((dmp: DMPItemProps, index: number) => (
                <tr key={index}>
                  <td>{dmp.plan === "DIRECT" ? "Direct" : "3rd Party"}</td>
                  <td>{dmp.loan_company_name || "-"}</td>
                  <td>{dmp.date_registered || "-"}</td>
                  <td>
                    {dmp.outstanding_balance
                      ? `£${parseFloat(dmp.outstanding_balance).toLocaleString(
                          "en-GB",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}`
                      : "-"}
                  </td>
                  <td>{dmp.satisfied ? "Yes" : "No"}</td>
                  <td>{dmp.satisfied ? dmp.date_satisfied || "-" : "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No DMPs found
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

export default ViewDMPsModal;
