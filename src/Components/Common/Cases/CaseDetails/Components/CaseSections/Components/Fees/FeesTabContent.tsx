import { useCalculateFeesQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Fees/FeesApi";
import { FeesTabContentProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/FeeTypes";
import { useParams } from "next/navigation";
import { FC } from "react";
import { Col, Row } from "reactstrap";
import FeeInTable from "./FeesTabContents/FeesInTable";
import FeeOutTable from "./FeesTabContents/FeesOutTable";

export const FeesTabContent: FC<FeesTabContentProps> = ({ tabId }) => {
  const { casealias } = useParams();
  const { data: feesCaculateData, isLoading: feesCalculateLoading } =
    useCalculateFeesQuery({
      case_alias: casealias,
    });

  const renderTabContent = () => {
    switch (tabId) {
      case "1":
        return <FeeInTable />;
      case "2":
        return <FeeOutTable />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      {renderTabContent()}
      <Row>
        <Col>
          <div className="d-flex justify-content-center gap-2 mt-3 bg-light-primary p-3 rounded">
            <h6 className="mb-0">Total Fees In:</h6>
            <h5>£{feesCaculateData?.total_fees_in || "0.00"}</h5>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="d-flex justify-content-center gap-2 mt-3 bg-light-info p-3 rounded">
            <h6 className="mb-0">Total Fees Out:</h6>
            <h5>£{feesCaculateData?.total_fees_out || "0.00"}</h5>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="d-flex justify-content-center gap-2 mt-3 bg-primary p-3 rounded">
            <h6 className="mb-0">Net Fees:</h6>
            <h5>£{feesCaculateData?.net_fees || "0.00"}</h5>
          </div>
        </Col>
      </Row>
    </div>
  );
};
