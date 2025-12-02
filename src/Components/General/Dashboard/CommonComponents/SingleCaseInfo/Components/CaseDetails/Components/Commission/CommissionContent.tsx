import LoadingSpinner from "@/app/loading";
import {
  useAddCommissionMutation,
  useGetCommissionQuery,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Commission/CommissionApi";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import LumpSumCommission from "./LumpSumCommission/LumpSumCommission";
import TrailCommission from "./TrailCommission/TrailCommission";

const CommissionContent: React.FC = () => {
  const { casealias } = useParams();
  // RTK hooks
  const { data: commissionData, isLoading } = useGetCommissionQuery({
    case_alias: casealias,
  });

  // API may return an array (e.g. [{...}]) — normalize to single object
  const commission = Array.isArray(commissionData)
    ? commissionData[0]
    : commissionData;
  const [addCommission, { isLoading: isAdding }] = useAddCommissionMutation();

  const [note, setNote] = useState<string>("");

  useEffect(() => {
    if (commission) {
      setNote(commission.note ?? "");
    }
  }, [commission]);

  if (isLoading) {
    return (
      <div className="p-2">
        <LoadingSpinner />
      </div>
    );
  }

  const totalCommission = commission?.total_commission ?? 0;
  console.log("Total Commission:", totalCommission);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await addCommission({
        case_alias: casealias,
        commission_alias: commission?.alias,
        commissionData: { note },
      });
      toast.success("Commission notes updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update commission notes");
    }
  };

  return (
    <div className="p-2">
      <Row>
        <Col>
          <LumpSumCommission
            caseAlias={casealias}
            commissionAlias={commission?.alias}
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <TrailCommission
            caseAlias={casealias}
            commissionAlias={commission?.alias}
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <div className="d-flex justify-content-center align-items-center mb-3 bg-light-success p-3">
            <h6>Total Commission: </h6>
            <h5>
              {new Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: "GBP",
              }).format(totalCommission)}
            </h5>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="commissionNotes">Commission Notes</Label>
              <Input
                type="textarea"
                id="commissionNotes"
                name="commissionNotes"
                placeholder="Enter commission notes here..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={5}
              />
            </FormGroup>
            <div className="d-flex justify-content-end gap-2">
              <Button color="primary" type="submit" disabled={isAdding}>
                {isAdding ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default CommissionContent;
