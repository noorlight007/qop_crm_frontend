import { useDeleteAdvertiserAdMutation } from "@/Redux/Reducers/SuperAdmin/Advertisers/AdvertisersApi";
import { DeleteAdModalProps } from "@/Types/SuperAdmin/Advertisers/AdvertisersTypes";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteAdModal: React.FC<DeleteAdModalProps> = ({
  isOpen,
  toggleModal,
  advertiserAlias,
  adData,
}) => {
  const [deleteAd, { isLoading }] = useDeleteAdvertiserAdMutation();

  const handleDelete = async () => {
    if (!advertiserAlias || !adData?.alias) {
      toast.error("Missing advertiser or ad information.");
      return;
    }

    try {
      await deleteAd({
        alias: advertiserAlias,
        adAlias: adData.alias,
      }).unwrap();
      toast.success("Ad deleted successfully.");
      toggleModal();
    } catch (error) {
      console.error("Failed to delete ad", error);
      toast.error("Failed to delete ad. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} centered>
      <ModalHeader toggle={toggleModal}>
        <h3 className="text-danger">Confirm Delete</h3>
      </ModalHeader>
      <ModalBody>
        <p>
          Are you sure you want to delete this ad for{" "}
          <strong>{adData?.title || "this advertiser"}</strong>?
        </p>
        <div className="border border-danger rounded p-3 bg-light">
          <p className="mb-2 fw-semibold text-danger">
            This action is irreversible.
          </p>
          <small className="text-muted">
            Deleting this ad will remove it permanently from the advertiser
            profile.
          </small>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleModal} disabled={isLoading}>
          Cancel
        </Button>
        <Button color="danger" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteAdModal;
