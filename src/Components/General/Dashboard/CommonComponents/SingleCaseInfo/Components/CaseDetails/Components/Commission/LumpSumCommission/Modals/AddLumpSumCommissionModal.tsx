import { useAddLumpSumCommissionMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Commission/CommissionApi";
import { Modal } from "reactstrap";

const AddLumpSumCommissionModal: React.FC = () => {
  const [addLumpSumCommission] = useAddLumpSumCommissionMutation();
  
  return <Modal>{/* JSX here */}</Modal>;
};

export default AddLumpSumCommissionModal;
