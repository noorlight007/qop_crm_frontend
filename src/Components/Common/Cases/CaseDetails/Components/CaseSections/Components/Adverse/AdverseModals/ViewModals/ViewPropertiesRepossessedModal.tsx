import { useGetPropertyRepossessedQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/AdverseDetails/AdverseDetailsApi";
import { ViewPropertiesRepossessedModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/AdverseTypes";
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

const ViewPropertiesRepossessedModal: React.FC<
  ViewPropertiesRepossessedModalProps
> = ({ isOpen, toggle, adverseAlias }) => {
  const params = useParams();
  const { casealias } = params;

  const { data, isLoading } = useGetPropertyRepossessedQuery({
    case_alias: casealias,
    adverse_alias: adverseAlias,
  });

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>
        <h2>View Properties Repossessed</h2>
      </ModalHeader>

      <ModalBody className="p-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Table striped responsive>
            <thead>
              <tr>
                <th>Lender</th>
                <th>Date of Registration</th>
                <th>Date of Satisfaction</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{item.lender || "-"}</td>
                  <td>{item.date_of_registration || "-"}</td>
                  <td>{item.date_of_satisfaction || "-"}</td>
                </tr>
              ))}
              {!data?.length && (
                <tr>
                  <td colSpan={3} className="text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
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

export default ViewPropertiesRepossessedModal;
