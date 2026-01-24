import { useAddLumpSumCommissionMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Commission/CommissionApi";
import { AddLumpSumAndTrailModalProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/CommissionTypes";
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
      toggle();
      toast.success("Lump sum commission added successfully");
    } catch (err) {
      console.error("Failed to add lump sum", err);
      toast.error("Failed to add lump sum commission");
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
              <Label>Commission Amount(£)</Label>
              <Input
                type="number"
                min={0}
                value={commissionAmount}
                onChange={(e) => setCommissionAmount(e.target.value)}
                placeholder="e.g. 1000"
              />
            </Col>

            <Col md={6}>
              <Label>Date Received</Label>
              <Input
                type="date"
                value={dateReceived}
                onChange={(e) => setDateReceived(e.target.value)}
              />
            </Col>

            <Col md={6}>
              <Label>Clawback Amount(£)</Label>
              <Input
                type="number"
                min={0}
                value={clawbackAmount}
                onChange={(e) => setClawbackAmount(e.target.value)}
                placeholder="e.g. 500"
              />
            </Col>

            <Col md={6}>
              <Label>Clawback Date</Label>
              <Input
                type="date"
                value={clawbackDate}
                onChange={(e) => setClawbackDate(e.target.value)}
              />
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
