import { useAddTrailCommissionMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Commission/CommissionApi";
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

const AddTrailCommissionModal: React.FC<AddLumpSumAndTrailModalProps> = ({
  isOpen,
  toggle,
  caseAlias,
  commissionAlias,
  policies = [],
  onAdded,
}) => {
  const [addTrailCommission, { isLoading }] = useAddTrailCommissionMutation();

  const [policy, setPolicy] = useState<string | null>(null);
  const [monthlyPayment, setMonthlyPayment] = useState<string>("");
  const [numberOfPayments, setNumberOfPayments] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
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
      setPolicy(null);
      setMonthlyPayment("");
      setNumberOfPayments("");
      setStartDate("");
      setEndDate("");
    }
  }, [isOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!caseAlias || !commissionAlias) return;

    const payload = {
      policy: policy || null,
      monthly_payment:
        monthlyPayment === "" ? null : parseFloat(monthlyPayment),
      number_of_payments:
        numberOfPayments === "" ? null : parseInt(numberOfPayments, 10),
      start_date: startDate === "" ? null : startDate,
      end_date: endDate === "" ? null : endDate,
      total_trail_commission: 0.0,
    };

    try {
      await addTrailCommission({
        case_alias: caseAlias,
        commission_alias: commissionAlias,
        trailCommissionData: payload,
      }).unwrap();
      if (onAdded) onAdded();
      // clear errors and close modal on success
      setErrors({});
      toggle();
      toast.success("Trail commission added successfully");
    } catch (err) {
      console.error("Failed to add trail commission", err);
      // parse validation errors
      const e: any = err;
      const dataErrors = e?.data?.errors ?? e?.data ?? e;
      try {
        const flat = flattenErrors(dataErrors);
        const normalized: Record<string, string> = {};
        Object.entries(flat).forEach(([k, v]) => {
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

      toast.error(getErrorMessage(err) || "Failed to add trail commission");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>
        <h3 className="text-primary">Add New Trail Commission</h3>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row className="g-3">
            <Col md={6}>
              <Label>Policy*</Label>
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
              <Label>Monthly Payment({getCurrencySign()})</Label>
              <Input
                type="number"
                min={0}
                value={monthlyPayment}
                onChange={(e) => {
                  setMonthlyPayment(e.target.value);
                  clearFieldError("monthlyPayment");
                }}
                placeholder="e.g. 50"
              />
              {errors["monthlyPayment"] && (
                <div className="text-danger small mt-1">
                  {errors["monthlyPayment"]}
                </div>
              )}
            </Col>

            <Col md={6}>
              <Label>Number Of Payments</Label>
              <Input
                type="number"
                min={0}
                value={numberOfPayments}
                onChange={(e) => {
                  setNumberOfPayments(e.target.value);
                  clearFieldError("numberOfPayments");
                }}
                placeholder="e.g. 12"
              />
              {errors["numberOfPayments"] && (
                <div className="text-danger small mt-1">
                  {errors["numberOfPayments"]}
                </div>
              )}
            </Col>

            <Col md={6}>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  clearFieldError("startDate");
                }}
              />
              {errors["startDate"] && (
                <div className="text-danger small mt-1">
                  {errors["startDate"]}
                </div>
              )}
            </Col>

            <Col md={6}>
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  clearFieldError("endDate");
                }}
              />
              {errors["endDate"] && (
                <div className="text-danger small mt-1">
                  {errors["endDate"]}
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
            {isLoading ? "Adding..." : "Add Trail Commission"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddTrailCommissionModal;
