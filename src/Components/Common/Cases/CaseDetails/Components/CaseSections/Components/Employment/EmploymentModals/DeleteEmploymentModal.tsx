import { useDeleteEmploymentDetailsMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/EmploymentDetails/EmploymentDetailsApi";
import React from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

type Props = {
  isOpen: boolean;
  toggle: () => void;
  caseAlias?: string;
  employmentAlias?: string;
  onSuccess?: () => void;
};

const DeleteEmploymentModal: React.FC<Props> = ({
  isOpen,
  toggle,
  caseAlias,
  employmentAlias,
  onSuccess,
}) => {
  const [deleteEmployment, { isLoading }] =
    useDeleteEmploymentDetailsMutation();

  const handleConfirm = async () => {
    if (!employmentAlias) return;
    try {
      await deleteEmployment({
        case_alias: caseAlias,
        employmentDetails_alias: employmentAlias,
      }).unwrap();
      toast.success("Deleted successfully.");
      toggle();
      onSuccess?.();
    } catch (error) {
      console.error("Delete failed", error);
      const getErrorMessage = (err: any): string | null => {
        if (!err) return null;
        // RTK Query: FetchBaseQueryError shape often has .data and/or .status
        if (err.data) {
          const d = err.data;
          if (typeof d === "string") return d;
          if (d.message && typeof d.message === "string") return d.message;
          // validation errors might be an object of arrays
          if (d.errors) {
            if (Array.isArray(d.errors)) return d.errors.join(", ");
            if (typeof d.errors === "object") {
              try {
                const vals = Object.values(d.errors)
                  .flat()
                  .map((v: any) =>
                    typeof v === "string" ? v : JSON.stringify(v)
                  );
                return vals.join(", ");
              } catch (e) {
                // fallthrough
              }
            }
          }
        }
        // Serialized/other error shapes
        if (err.message && typeof err.message === "string") return err.message;
        if (err.error && typeof err.error === "string") return err.error;
        // fallback: stringify object but strip status-like fields so status codes
        // are not shown to end users.
        try {
          const forbidden = ["status", "statusCode", "code", "status_text"];
          const sanitize = (o: any) => {
            if (!o || typeof o !== "object") return o;
            const copy: any = Array.isArray(o) ? [...o] : { ...o };
            forbidden.forEach((k) => {
              if (k in copy) delete copy[k];
            });
            // also sanitize nested `data` or `error` objects
            ["data", "error"].forEach((nk) => {
              if (copy[nk] && typeof copy[nk] === "object") {
                forbidden.forEach((k) => {
                  if (k in copy[nk]) delete copy[nk][k];
                });
              }
            });
            return copy;
          };

          const cleaned = sanitize(err);
          const str = JSON.stringify(cleaned);
          return str === "{}" || str === "[]" ? null : str;
        } catch (e) {
          return null;
        }
      };

      const msg =
        getErrorMessage(error) ?? "Failed to delete employment record.";
      toast.error(msg);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Confirm Delete</h3>
      </ModalHeader>
      <ModalBody>
        Are you sure you want to delete this employment record?
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle} disabled={isLoading}>
          Cancel
        </Button>
        <Button color="danger" onClick={handleConfirm} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteEmploymentModal;
