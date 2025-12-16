import { NetworkDirectorDashboardProps } from "@/Types/Network/Director/DashboardTypes";
import { Col, Row } from "reactstrap";
import LendersChart from "./LendersChart/LendersChart";
import MortgagesChart from "./MortgagesChart/MortgagesChart";

const Charts: React.FC<NetworkDirectorDashboardProps> = ({
  isLoading,
  networkDashboardData,
}) => {
  return (
    <Row>
      <Col sm="12" xl="6" className="box-col-6">
        <MortgagesChart
          isLoading={isLoading}
          networkDashboardData={networkDashboardData}
        />
      </Col>
      <Col sm="12" xl="6" className="box-col-6">
        <LendersChart
          isLoading={isLoading}
          networkDashboardData={networkDashboardData}
        />
      </Col>
    </Row>
  );
};

export default Charts;
