import { useDeleteAdvertiserMutation } from "@/Redux/Reducers/SuperAdmin/Advertisers/AdvertisersApi";
import { DeleteAdvertiserModalProps } from "@/Types/SuperAdmin/Advertisers/AdvertisersTypes";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteAdvertiserModal: React.FC<DeleteAdvertiserModalProps> = ({
  isOpen,
  toggle,
  advertiserData,
}) => {
  const router = useRouter();
  const [deleteAdvertiser, { isLoading }] = useDeleteAdvertiserMutation();

  const handleDelete = async () => {
    if (!advertiserData?.alias) {
      toast.error("Missing advertiser information.");
      return;
    }

    try {
      await deleteAdvertiser({ alias: advertiserData.alias }).unwrap();
      toast.success("Advertiser deleted successfully!");
      toggle();
      router.back();
    } catch (error) {
      console.error("Failed to delete advertiser", error);
      toast.error("Failed to delete advertiser. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Confirm Deletion</h3>
      </ModalHeader>
      <ModalBody>
        <p>
          Are you sure you want to delete{" "}
          <strong className="text-danger">
            {advertiserData?.company_name || advertiserData?.alias}
          </strong>
          ?
        </p>

        <div className="border border-danger rounded p-3 bg-light">
          <p className="mb-2 fw-semibold text-danger">
            This action is irreversible.
          </p>
          <small className="text-muted">
            Deleting this advertiser will permanently remove its profile details
            and any associated records in the system. This data cannot be
            restored.
          </small>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle} disabled={isLoading}>
          Cancel
        </Button>
        <Button color="danger" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteAdvertiserModal;
