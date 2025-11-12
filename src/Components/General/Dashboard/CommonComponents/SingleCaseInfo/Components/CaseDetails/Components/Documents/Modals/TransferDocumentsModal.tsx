import { useGetCasesQuery } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { useUpdateCaseDocumentMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Documents/DocumentsApi";
import {
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";

export interface TransferDocumentsModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const TransferDocumentsModal: React.FC<TransferDocumentsModalProps> = ({
  isOpen,
  toggle,
}) => {
  // RTK hooks
  const { data: caseData, isLoading: isCaseLoading } =
    useGetCasesQuery(undefined);
  const [updateCaseDocument, { isLoading }] = useUpdateCaseDocumentMutation();

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Transfer Documents</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="caseSelect">Select Case to Transfer Documents</Label>

          <Input id="caseSelect" className="form-control" type="select">
            {isCaseLoading ? (
              <option>Loading cases...</option>
            ) : (
              caseData?.results.map((caseItem: any) => (
                <option key={caseItem.alias} value={caseItem.alias}>
                  {caseItem.name}
                </option>
              ))
            )}
          </Input>
        </FormGroup>
      </ModalBody>
    </Modal>
  );
};

export default TransferDocumentsModal;
