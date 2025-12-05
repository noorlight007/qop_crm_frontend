import { useCopyCaseMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseCopy/CaseCopyApi";
import { useParams } from "next/navigation";
import { Form, Modal, ModalBody, ModalHeader } from "reactstrap";

interface CopyCaseModalProps {
  isOpen: boolean;
  toggle: () => void;
  caseData: any;
}

const CopyCaseModal: React.FC<CopyCaseModalProps> = ({
  isOpen,
  toggle,
  caseData,
}) => {
  const { casealias } = useParams();
  const [copyCase, { isLoading }] = useCopyCaseMutation();

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h3 className="text-primary">Copy Case</h3>
      </ModalHeader>
      <ModalBody>
        <Form>
            
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default CopyCaseModal;
