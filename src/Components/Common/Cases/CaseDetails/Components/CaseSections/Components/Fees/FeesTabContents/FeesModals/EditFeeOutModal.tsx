import { useEditFeesInOutMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Fees/FeesApi";
import {
  EditFeeModalProps,
  FeeDataProps,
} from "@/Types/Common/Cases/CaseDetails/CaseSections/FeeTypes";
import getCurrencySign from "@/utils/currency";
import { limitDecimalPlaces } from "@/utils/inputHandlers";
import { FC, useEffect, useState } from "react";
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

const EditFeeOutModal: FC<EditFeeModalProps> = ({
  isOpen,
  toggle,
  onSubmit,
  feeTypes,
  methods,
  caseAlias,
  initialData,
}) => {
  const [editFeesInOut, { isLoading }] = useEditFeesInOutMutation();

  const initialState: FeeDataProps = {
    fee: "",
    feeType: "",
    method: "",
    notes: "",
    feeDate: "",
  };

  const [feeData, setFeeData] = useState<FeeDataProps>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;
    if (!initialData) {
      setFeeData(initialState);
      setErrors({});
      return;
    }

    setFeeData({
      fee: String(initialData.fee ?? initialData.amount ?? ""),
      feeType: String(initialData.feeType ?? ""),
      method: String(initialData.method ?? ""),
      notes: String(initialData.notes ?? ""),
      feeDate: String(initialData.feeDate ?? ""),
    });
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData?.alias]);

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
      const mappings: Record<string, string> = {
        amount: "fee",
        fee_out_type: "feeType",
        feeType: "feeType",
        date_paid_out: "feeDate",
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

    const normalizedCaseAlias = Array.isArray(caseAlias)
      ? caseAlias[0]
      : caseAlias;
    const feeAlias = initialData?.alias;

    if (!normalizedCaseAlias) {
      toast.error("Case alias not found");
      return;
    }

    if (!feeAlias) {
      toast.error("Fee data not found");
      return;
    }

    const data = {
      amount: Number(feeData.fee) || 0,
      date_paid_out: feeData.feeDate || null,
      fee_out_type: feeData.feeType || null,
      method: feeData.method || null,
      notes: feeData.notes || "",
    };

    const res = await editFeesInOut({
      case_alias: normalizedCaseAlias,
      fee_alias: feeAlias,
      feeDetails: data,
    });

    if ((res as any).data) {
      setErrors({});
      onSubmit(feeData);
      toggle();
      toast.success("Fee updated successfully");
    } else if ((res as any).error) {
      const parsed = parseApiErrors((res as any).error);
      setErrors(parsed);
      const firstMsg =
        Object.values(parsed)[0] ||
        (res as any).error?.data?.detail ||
        "Failed to update fee.";
      toast.error(firstMsg);
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>Edit Fee Out</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="amount">
                  Amount<span className="text-danger">*</span>
                </Label>
                <InputGroup>
                  <InputGroupText>{getCurrencySign()}</InputGroupText>
                  <Input
                    type="number"
                    id="amount"
                    placeholder="0.00"
                    value={feeData.fee}
                    onInput={limitDecimalPlaces}
                    onChange={(e) => handleInputChange("fee", e.target.value)}
                    required
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
                <Label for="method">
                  Payment Method<span className="text-danger">*</span>
                </Label>
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
                <Label for="feeDate">
                  Date Paid Out<span className="text-danger">*</span>
                </Label>
                <Input
                  type="date"
                  id="feeDate"
                  value={feeData.feeDate}
                  onChange={(e) => handleInputChange("feeDate", e.target.value)}
                  required
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
          <Button color="secondary" onClick={toggle} disabled={isLoading}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default EditFeeOutModal;
