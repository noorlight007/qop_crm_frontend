import { NetworkDirectorDashboardProps } from "@/Types/Network/Director/DashboardTypes";
import { Col, Row } from "reactstrap";
import LendersChart from "./LendersChart/LendersChart";
import MortgagesChart from "./MortgagesChart/MortgagesChart";

const Charts: React.FC<NetworkDirectorDashboardProps> = ({
  isLoading,
  networkDirectorDashboardData,
}) => {
  return (
    <Row>
      <Col sm="12" xl="6" className="box-col-6">
        <MortgagesChart
          isLoading={isLoading}
          networkDirectorDashboardData={networkDirectorDashboardData}
        />
      </Col>
      <Col sm="12" xl="6" className="box-col-6">
        <LendersChart
          isLoading={isLoading}
          networkDirectorDashboardData={networkDirectorDashboardData}
        />
      </Col>
    </Row>
  );
};

export default Charts;
