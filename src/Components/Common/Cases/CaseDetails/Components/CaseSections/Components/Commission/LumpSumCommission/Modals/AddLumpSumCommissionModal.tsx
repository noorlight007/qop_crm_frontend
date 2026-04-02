import { useAddLumpSumCommissionMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Commission/CommissionApi";
import { AddLumpSumAndTrailModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/CommissionTypes";
import getCurrencySign from "@/utils/currency";
import formatChoiceFieldValue from "@/utils/formatters";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

const AddLumpSumCommissionModal: React.FC<AddLumpSumAndTrailModalProps> = ({
  isOpen,
  toggle,
  caseAlias,
  commissionAlias,
  policies = [],
  onAdded,
}) => {
  const [addLumpSumCommission, { isLoading }] =
    useAddLumpSumCommissionMutation();

  const [policy, setPolicy] = useState<string | null>(null);
  const [commissionAmount, setCommissionAmount] = useState<string>("");
  const [dateReceived, setDateReceived] = useState<string>("");
  const [clawbackAmount, setClawbackAmount] = useState<string>("");
  const [clawbackDate, setClawbackDate] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sanitize = (s: string) => (s || "").replace(/^\s*\d+,\s*/g, "").trim();
  const toCamel = (key: string) =>
    key.replace(/_([a-z])/g, (_, c) => (c ? c.toUpperCase() : ""));

  const flattenErrors = (value: any, path = ""): Record<string, string> => {
    const out: Record<string, string> = {};
    if (value == null) return out;
    if (typeof value === "string") {
      out[path || ""] = sanitize(value);
      return out;
    }
    if (Array.isArray(value)) {
      out[path || ""] = sanitize(
        value
          .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
          .join(", "),
      );
      return out;
    }
    if (typeof value === "object") {
      for (const k of Object.keys(value)) {
        const v = value[k];
        const newPath = path ? `${path}.${k}` : k;
        if (typeof v === "string" || Array.isArray(v)) {
          out[newPath] = sanitize(
            (Array.isArray(v)
              ? v
                  .map((x) => (typeof x === "string" ? x : JSON.stringify(x)))
                  .join(", ")
              : v) as string,
          );
        } else {
          Object.assign(out, flattenErrors(v, newPath));
        }
      }
    }
    return out;
  };

  const clearFieldError = (field: string) =>
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      const snake = field.replace(/([A-Z])/g, (m) => `_${m.toLowerCase()}`);
      delete copy[snake];
      return copy;
    });

  const getErrorMessage = (err: any) => {
    if (!err) return "Unknown error";
    if (typeof err === "string") return err;
    if (typeof err?.data === "string") return err.data;
    try {
      if (err?.data?.message) return String(err.data.message);
      if (err?.message) return String(err.message);
    } catch {}
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      // reset form when modal closed
      setPolicy(null);
      setCommissionAmount("");
      setDateReceived("");
      setClawbackAmount("");
      setClawbackDate("");
    }
  }, [isOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!caseAlias || !commissionAlias) return;

    const payload = {
      policy: policy || null,
      commission_amount:
        commissionAmount === "" ? null : parseFloat(commissionAmount),
      date_received: dateReceived === "" ? null : dateReceived,
      clawback_amount:
        clawbackAmount === "" ? null : parseFloat(clawbackAmount),
      clawback_date: clawbackDate === "" ? null : clawbackDate,
    };

    try {
      await addLumpSumCommission({
        case_alias: caseAlias,
        commission_alias: commissionAlias,
        lumpSumData: payload,
      }).unwrap();
      if (onAdded) onAdded();
      // clear errors and close modal on success
      setErrors({});
      toggle();
      toast.success("Lump sum commission added successfully");
    } catch (err) {
      console.error("Failed to add lump sum", err);
      // Try to parse validation errors and show per-field messages
      const e: any = err;
      const dataErrors = e?.data?.errors ?? e?.data ?? e;
      try {
        const flat = flattenErrors(dataErrors);
        const normalized: Record<string, string> = {};
        Object.entries(flat).forEach(([k, v]) => {
          // map snake_case keys to camelCase used in UI
          const parts = k.split(".").filter(Boolean);
          const last = parts[parts.length - 1];
          const camel = toCamel(last);
          normalized[camel] = v;
        });
        if (Object.keys(normalized).length) {
          setErrors(normalized);
          const first = Object.values(normalized)[0];
          toast.error(getErrorMessage(first));
          return; // keep modal open
        }
      } catch (e2) {
        console.error("Error parsing validation errors", e2);
      }

      toast.error(getErrorMessage(err) || "Failed to add lump sum commission");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>
        <h3 className="text-primary">Add New Lump Sum</h3>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row className="g-3">
            <Col md={6}>
              <Label>
                Policy<span className="text-danger">*</span>
              </Label>
              <Input
                type="select"
                value={policy ?? ""}
                onChange={(e) => {
                  setPolicy(e.target.value || null);
                  clearFieldError("policy");
                }}
                required
              >
                <option value="">Select...</option>
                {policies.map((p) => (
                  <option key={p.alias} value={p.alias}>
                    {formatChoiceFieldValue(p.policy_type) || p.alias}
                  </option>
                ))}
              </Input>
            </Col>
            <Col md={6}>
              <Label>Commission Amount({getCurrencySign()})</Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={commissionAmount}
                onChange={(e) => {
                  setCommissionAmount(e.target.value);
                  clearFieldError("commissionAmount");
                }}
                placeholder="e.g. 1000"
              />
              {errors["commissionAmount"] && (
                <div className="text-danger small mt-1">
                  {errors["commissionAmount"]}
                </div>
              )}
            </Col>

            <Col md={6}>
              <Label>Date Received</Label>
              <Input
                type="date"
                value={dateReceived}
                onChange={(e) => {
                  setDateReceived(e.target.value);
                  clearFieldError("dateReceived");
                }}
              />
              {errors["dateReceived"] && (
                <div className="text-danger small mt-1">
                  {errors["dateReceived"]}
                </div>
              )}
            </Col>

            <Col md={6}>
              <Label>Clawback Amount({getCurrencySign()})</Label>
              <Input
                type="number"
                min={0}
                value={clawbackAmount}
                onChange={(e) => {
                  setClawbackAmount(e.target.value);
                  clearFieldError("clawbackAmount");
                }}
                placeholder="e.g. 500"
              />
              {errors["clawbackAmount"] && (
                <div className="text-danger small mt-1">
                  {errors["clawbackAmount"]}
                </div>
              )}
            </Col>

            <Col md={6}>
              <Label>Clawback Date</Label>
              <Input
                type="date"
                value={clawbackDate}
                onChange={(e) => {
                  setClawbackDate(e.target.value);
                  clearFieldError("clawbackDate");
                }}
              />
              {errors["clawbackDate"] && (
                <div className="text-danger small mt-1">
                  {errors["clawbackDate"]}
                </div>
              )}
            </Col>
          </Row>
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={toggle} disabled={isLoading}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Lump Sum"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddLumpSumCommissionModal;
