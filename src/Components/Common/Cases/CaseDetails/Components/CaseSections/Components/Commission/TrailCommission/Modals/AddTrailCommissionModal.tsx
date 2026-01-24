import { useAddTrailCommissionMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Commission/CommissionApi";
import { AddLumpSumAndTrailModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/CommissionTypes";
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
      toggle();
      toast.success("Trail commission added successfully");
    } catch (err) {
      console.error("Failed to add trail commission", err);
      toast.error("Failed to add trail commission");
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
                onChange={(e) => setPolicy(e.target.value || null)}
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
              <Label>Monthly Payment(£)</Label>
              <Input
                type="number"
                min={0}
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(e.target.value)}
                placeholder="e.g. 50"
              />
            </Col>

            <Col md={6}>
              <Label>Number Of Payments</Label>
              <Input
                type="number"
                min={0}
                value={numberOfPayments}
                onChange={(e) => setNumberOfPayments(e.target.value)}
                placeholder="e.g. 12"
              />
            </Col>

            <Col md={6}>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Col>

            <Col md={6}>
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
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
