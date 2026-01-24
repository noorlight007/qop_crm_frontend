import LoadingSpinner from "@/app/loading";
import { useGetPreviousAddressQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/ApplicantsDetails/ApplicantPreviousAddressApi";
import {
  PreviousAddressProps,
  ViewPreviousAddressModalProps,
} from "@/Types/Common/Cases/CaseDetails/CaseSections/ApplicantsDetailsTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { TbCirclePlus } from "react-icons/tb";
import { Button, Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import AddPreviousAddressModal from "./AddPreviousAddressModal";
import DeletePreviousAddressModal from "./DeletePreviousAddressModal";

const ViewPreviousAddressModal: React.FC<ViewPreviousAddressModalProps> = ({
  isOpen,
  toggle,
  applicantAlias,
}) => {
  const params = useParams();
  const { casealias } = params;
  const [isAddPreviousAddressModalOpen, setIsAddPreviousAddressModalOpen] =
    useState(false);
  const [
    isDeletePreviousAddressModalOpen,
    setIsDeletePreviousAddressModalOpen,
  ] = useState(false);
  const [selectedAddressAlias, setSelectedAddressAlias] = useState<string>("");

  // RTK api hooks
  const { data: previousAddressesData, isLoading } = useGetPreviousAddressQuery(
    {
      case_alias: casealias,
      applicantDetails_alias: applicantAlias,
    },
    {
      skip: !isOpen || !casealias || !applicantAlias,
      refetchOnMountOrArgChange: true,
    },
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="xl">
      <ModalHeader toggle={toggle}>
        <h3 className="text-primary">View Previous Address</h3>
      </ModalHeader>
      <ModalBody>
        {previousAddressesData && previousAddressesData.length > 0 && (
          <div className="d-flex justify-content-end align-items-center mb-3">
            <Button
              color="primary"
              onClick={() => setIsAddPreviousAddressModalOpen(true)}
            >
              <TbCirclePlus size={18} /> Add Previous Address
            </Button>
          </div>
        )}
        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>Postcode</th>
              <th>House Name/Number</th>
              <th>Address Line 1</th>
              <th>City</th>
              <th>County</th>
              <th>Country</th>
              <th>Effective From</th>
              <th>Effective To</th>
              <th>Time at Address</th>
              <th>Residential Status</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="small">
            {isLoading ? (
              <tr>
                <td colSpan={12} className="text-center p-2">
                  <LoadingSpinner />
                </td>
              </tr>
            ) : previousAddressesData && previousAddressesData.length > 0 ? (
              previousAddressesData.map((addressData: PreviousAddressProps) => (
                <tr key={addressData.alias}>
                  <td>{addressData.postcode}</td>
                  <td>{addressData.house_name_or_number}</td>
                  <td>{addressData.address_line1}</td>
                  <td>{addressData.city}</td>
                  <td>{addressData.county}</td>
                  <td>{addressData.country}</td>
                  <td>{addressData.pre_effective_from}</td>
                  <td>{addressData.pre_effective_to}</td>
                  <td>
                    {addressData.time_at_address_years} years,{" "}
                    {addressData.time_at_address_months} months
                  </td>
                  <td>
                    {addressData.residential_status
                      ? formatChoiceFieldValue(addressData.residential_status)
                      : ""}
                  </td>
                  <td>{addressData.notes}</td>
                  <td>
                    <div className="d-flex justify-content-center">
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => {
                          setSelectedAddressAlias(addressData.alias);
                          setIsDeletePreviousAddressModalOpen(true);
                        }}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="text-center">
                  No previous addresses found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ModalBody>
      <AddPreviousAddressModal
        isOpen={isAddPreviousAddressModalOpen}
        toggle={() =>
          setIsAddPreviousAddressModalOpen(!isAddPreviousAddressModalOpen)
        }
        lastEffectiveFromDate={
          previousAddressesData && previousAddressesData.length > 0
            ? previousAddressesData[0].pre_effective_from
            : undefined
        }
        applicantDetailsAlias={applicantAlias || ""}
      />
      {/* Delete Previous Address Modal */}
      <DeletePreviousAddressModal
        isOpen={isDeletePreviousAddressModalOpen}
        toggle={() =>
          setIsDeletePreviousAddressModalOpen(!isDeletePreviousAddressModalOpen)
        }
        applicantDetails_alias={applicantAlias || ""}
        previousAddress_alias={selectedAddressAlias}
      />
    </Modal>
  );
};

export default ViewPreviousAddressModal;
