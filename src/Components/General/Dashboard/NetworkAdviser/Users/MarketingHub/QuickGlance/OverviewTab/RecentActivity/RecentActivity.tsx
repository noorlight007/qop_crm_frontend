import { TbEye, TbSend, TbUsers } from "react-icons/tb";
import { Card, CardBody } from "reactstrap";

const RecentActivity = () => {
  return (
    <Card className="shadow border-0">
      <CardBody>
        <h3 className="mb-3 fw-bold">Recent Activity</h3>
        <div>
          <div className="p-2 mb-2 border-l-primary border-2 rounded bg-light-primary d-flex justify-content-start gap-2">
            <div>
              <TbSend className="fs-4" />
            </div>
            <div>
              <span className="fw-medium">WhatsApp campaign sent</span>
              <br />
              <small className="text-muted">
                247 messages delivered • 2 hours ago
              </small>
            </div>
          </div>
          <div className="p-2 mb-2 border-l-success border-2 rounded bg-light-success d-flex justify-content-start gap-2">
            <div>
              <TbEye className="fs-4" />
            </div>
            <div>
              <span className="fw-medium">Instagram post published</span>
              <br />
              <small className="text-muted">
                Mortgage tips post • 4 hours ago
              </small>
            </div>
          </div>
          <div className="p-2 mb-2 border-l-secondary border-2 rounded bg-light-secondary bg-opacity-10 d-flex justify-content-start gap-2">
            <div>
              <TbUsers className="fs-4" />
            </div>
            <div>
              <span className="fw-medium">New leads from Facebook</span>
              <br />
              <small className="text-muted">
                5 new mortgage inquiries • 6 hours ago
              </small>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default RecentActivity;
