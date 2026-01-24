import { useAddFeesOutDetailsMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Fees/FeesApi";
import {
  AddFeeOutModalProps,
  FeeDataProps,
} from "@/Types/Common/Cases/CaseDetails/CaseSections/FeeTypes";
import { limitDecimalPlaces } from "@/utils/inputHandlers";
import { FC, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

const AddFeeOutModal: FC<AddFeeOutModalProps> = ({
  isOpen,
  toggle,
  onSubmit,
  feeTypes,
  methods,
  caseAlias,
}) => {
  const [addFeesOutDetails, { isLoading }] = useAddFeesOutDetailsMutation();
  const initialState = {
    fee: "",
    feeType: "",
    method: "",
    notes: "",
    feeDate: "",
  };
  const [feeData, setFeeData] = useState<FeeDataProps>(initialState);

  const handleInputChange = (field: keyof FeeDataProps, value: string) => {
    setFeeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      amount: Number(feeData.fee) || 0,
      case_alias: caseAlias,
      date_paid_out: feeData.feeDate || null,
      fee_out_type: feeData.feeType || null,
      fees_type: "FEES_OUT",
      method: feeData.method || null,
      notes: feeData.notes || "",
    };

    const res = await addFeesOutDetails({
      case_alias: caseAlias,
      feesOutDetails: data,
    });
    if (res.data) {
      onSubmit(feeData);
      setFeeData(initialState); // Reset form
      toggle();
      toast.success("Fee added successfully");
    } else if (res.error) {
      const errorMessage =
        (res.error as any)?.data?.detail || "Failed to add fee.";
      toast.error(errorMessage);
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>Add New Fee Out</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="amount">Amount</Label>
                <InputGroup>
                  <InputGroupText>£</InputGroupText>
                  <Input
                    type="number"
                    id="amount"
                    placeholder="0.00"
                    value={feeData.fee}
                    onInput={limitDecimalPlaces}
                    onChange={(e) => handleInputChange("fee", e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="feeType">Fee Type</Label>
                <Input
                  type="select"
                  id="feeType"
                  value={feeData.feeType}
                  onChange={(e) => handleInputChange("feeType", e.target.value)}
                >
                  <option value="">Select Type</option>
                  {feeTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.title}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="method">Payment Method*</Label>
                <Input
                  type="select"
                  id="method"
                  value={feeData.method}
                  onChange={(e) => handleInputChange("method", e.target.value)}
                  required
                >
                  <option value="">Select Method</option>
                  {methods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.title}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="feeDate">Date Paid Out</Label>
                <Input
                  type="date"
                  id="feeDate"
                  value={feeData.feeDate}
                  onChange={(e) => handleInputChange("feeDate", e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label for="notes">Notes</Label>
            <Input
              type="textarea"
              id="notes"
              rows={3}
              placeholder="Add notes..."
              value={feeData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Fee"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddFeeOutModal;
