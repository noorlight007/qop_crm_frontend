import { Props } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/SecurityPropertyTypes";
import React from "react";
import {
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";

const PropertyAddressModal: React.FC<Props> = ({
  isOpen,
  toggle,
  addresses,
  onSelect,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>Select Address</ModalHeader>
      <ModalBody style={{ maxHeight: "450px", overflowY: "auto" }}>
        <ListGroup>
          {Array.isArray(addresses) && addresses.length > 0 ? (
            addresses.map((item) => (
              <ListGroupItem
                key={item.id}
                tag="button"
                action
                onClick={() => onSelect(item.id)}
                className="text-start"
              >
                {item.address}
              </ListGroupItem>
            ))
          ) : (
            <div className="p-3 text-center text-muted">
              No addresses found.
            </div>
          )}
        </ListGroup>
      </ModalBody>
    </Modal>
  );
};

export default PropertyAddressModal;
