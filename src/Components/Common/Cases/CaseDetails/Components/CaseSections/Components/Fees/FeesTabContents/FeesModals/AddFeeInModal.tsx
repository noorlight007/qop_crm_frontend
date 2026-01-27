import { useAddFeesInDetailsMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Fees/FeesApi";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
import {
  AddFeeInModalProps,
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

const AddFeeInModal: FC<AddFeeInModalProps> = ({
  isOpen,
  toggle,
  onSubmit,
  feeTypes,
  methods,
  caseAlias,
}) => {
  const [addFeesInDetails, { isLoading }] = useAddFeesInDetailsMutation();
  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();
  const initialState = {
    fee: "",
    feeType: "",
    method: "",
    notes: "",
    feeDate: "",
  };
  const [feeData, setFeeData] = useState<FeeDataProps>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof FeeDataProps, value: string) => {
    setFeeData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => {
      if (!prev) return prev;
      const copy = { ...prev };
      if (copy[field as string]) delete copy[field as string];
      return copy;
    });
  };

  const parseApiErrors = (err: any): Record<string, string> => {
    const out: Record<string, string> = {};
    const src = err?.data || err || {};
    const sanitize = (s: any) => String(s ?? "").replace(/^\s*\d+,\s*/g, "");

    const mapKey = (k: string) => {
      // map server keys to our form keys
      const mappings: Record<string, string> = {
        amount: "fee",
        fee_in_type: "feeType",
        feeType: "feeType",
        date_received: "feeDate",
        feeDate: "feeDate",
        method: "method",
        notes: "notes",
      };
      return mappings[k] || k;
    };

    const walk = (obj: any) => {
      if (!obj) return;
      if (typeof obj === "string") {
        out.detail = sanitize(obj);
        return;
      }
      if (Array.isArray(obj)) {
        obj.forEach((it) => {
          if (typeof it === "string") out.detail = sanitize(it);
          else walk(it);
        });
        return;
      }
      if (typeof obj === "object") {
        Object.entries(obj).forEach(([k, v]) => {
          const fk = mapKey(k);
          if (typeof v === "string" || typeof v === "number") {
            out[fk] = sanitize(v);
          } else if (Array.isArray(v)) {
            out[fk] = v.map(sanitize).join(" ");
          } else if (typeof v === "object") {
            // nested object: flatten one level
            Object.entries(v as any).forEach(([k2, v2]) => {
              const fk2 = mapKey(k2);
              if (Array.isArray(v2)) out[fk2] = v2.map(sanitize).join(" ");
              else out[fk2] = sanitize(v2);
            });
          }
        });
      }
    };

    walk(src);
    return out;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      amount: Number(feeData.fee) || 0,
      case_alias: caseAlias,
      date_received: feeData.feeDate || null,
      fee_in_type: feeData.feeType || null,
      fees_type: "FEES_IN",
      method: feeData.method || null,
      notes: feeData.notes || "",
    };

    const res = await addFeesInDetails({
      case_alias: caseAlias,
      feesInDetails: data,
    });
    if (res.data) {
      setErrors({});
      try {
        await updateSectionCompleteStatus({
          case_alias: caseAlias,
          section_data: { is_fees: true },
        });
      } catch (err) {
        console.error("Failed to update section complete status:", err);
      }
      onSubmit(feeData);
      setFeeData(initialState); // Reset form
      toggle();
      toast.success("Fee added successfully");
    } else if (res.error) {
      const parsed = parseApiErrors(res.error);
      setErrors(parsed);
      const firstMsg =
        Object.values(parsed)[0] ||
        (res.error as any)?.data?.detail ||
        "Failed to add fee.";
      toast.error(firstMsg);
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>Add New Fee</ModalHeader>
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
                {errors.fee && <div className="text-danger">{errors.fee}</div>}
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
                {errors.feeType && (
                  <div className="text-danger">{errors.feeType}</div>
                )}
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
                {errors.method && (
                  <div className="text-danger">{errors.method}</div>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="feeDate">Date Received</Label>
                <Input
                  type="date"
                  id="feeDate"
                  value={feeData.feeDate}
                  onChange={(e) => handleInputChange("feeDate", e.target.value)}
                />
                {errors.feeDate && (
                  <div className="text-danger">{errors.feeDate}</div>
                )}
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
            {errors.notes && <div className="text-danger">{errors.notes}</div>}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Fee In"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddFeeInModal;
