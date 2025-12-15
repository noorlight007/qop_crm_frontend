import { CommonDirectorDashboardProps } from "@/Types/CommonComponents/CommonDirectorDashboard/CommonDirectorDashboardType";
import { Col, Row } from "reactstrap";
import LendersChart from "./LendersChart/LendersChart";
import MortgagesChart from "./MortgagesChart/MortgagesChart";

const Charts: React.FC<CommonDirectorDashboardProps> = ({
  isLoading,
  commonDirectorDashboardData,
}) => {
  return (
    <Row>
      <Col sm="12" xl="6" className="box-col-6">
        <MortgagesChart
          isLoading={isLoading}
          commonDirectorDashboardData={commonDirectorDashboardData}
        />
      </Col>
      <Col sm="12" xl="6" className="box-col-6">
        <LendersChart
          isLoading={isLoading}
          commonDirectorDashboardData={commonDirectorDashboardData}
        />
      </Col>
    </Row>
  );
};

export default Charts;
