import { FaChartBar, FaRegFileImage } from "react-icons/fa";
import { TbCalendar, TbMessage2 } from "react-icons/tb";
import { Button, Card, CardBody } from "reactstrap";

const QuickActions: React.FC = () => {
  return (
    <Card className="border-0 shadow">
      <CardBody>
        <h3 className="mb-3 fw-bold">Quick Actions</h3>
        <Button
          outline
          color="secondary"
          className="d-flex gap-2 w-100 rounded-2 px-3 py-2 mb-2"
        >
          <TbMessage2 />
          <p>Send WhatsApp Message</p>
        </Button>
        <Button
          outline
          color="primary"
          className="d-flex gap-2 w-100 rounded-2 px-3 py-2 mb-2"
        >
          <TbCalendar />
          <p>Schedule Social Post</p>
        </Button>
        <Button
          outline
          color="danger"
          className="d-flex gap-2 w-100 rounded-2 px-3 py-2 mb-2"
        >
          <FaChartBar />
          <p>Create Lead Ad Campaign</p>
        </Button>
        <Button
          outline
          color="success"
          className="d-flex gap-2 w-100 rounded-2 px-3 py-2 mb-2"
        >
          <FaRegFileImage />
          <p>Upload to Content Library</p>
        </Button>
      </CardBody>
    </Card>
  );
};

export default QuickActions;
