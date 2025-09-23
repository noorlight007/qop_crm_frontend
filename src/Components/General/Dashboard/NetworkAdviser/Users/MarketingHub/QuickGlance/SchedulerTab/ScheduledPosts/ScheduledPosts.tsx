import {
  TbBrandFacebook,
  TbBrandInstagram,
  TbBrandLinkedin,
  TbBrandTwitter,
} from "react-icons/tb";
import { Button, Card, CardBody } from "reactstrap";

const ScheduledPosts: React.FC = () => {
  return (
    <Card>
      <CardBody className="pb-0">
        <div className="mb-3">
          <h3>Scheduled posts</h3>
          <small>Manage your upcoming and published posts</small>
        </div>
        <div>
          <Card className="shadow">
            <CardBody className="d-flex justify-content-between">
              <div>
                <p className="mb-0 text-truncate">
                  First-time buyer? We make the mortgage process simple and
                  stress-free! Get in touch for a free consultation.
                </p>
                <small className="text-info">
                  #FirstTimeBuyer #Mortgage #UKProperty
                </small>
                <div className="mt-1">
                  <span className="me-1">
                    <TbBrandFacebook />
                  </span>
                  <span className="me-1">
                    <TbBrandInstagram />
                  </span>
                  <span className="me-1">•2024-01-25 10:00</span>
                  <span className="bg-light-dark rounded-3 px-2">
                    scheduled
                  </span>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button outline color="dark">
                  Edit
                </Button>
                <Button color="danger">Delete</Button>
              </div>
            </CardBody>
          </Card>
          <Card className="shadow">
            <CardBody className="d-flex justify-content-between">
              <div>
                <p className="mb-0 text-truncate">
                  Thinking of remortgaging? Now might be the perfect time! Rates
                  are competitive - let's chat.
                </p>
                <small className="text-info">
                  #Remortgage #PropertyFinance #MortgageBroker
                </small>
                <div className="mt-1">
                  <span className="me-1">
                    <TbBrandLinkedin />
                  </span>
                  <span className="me-1">
                    <TbBrandFacebook />
                  </span>
                  <span className="me-1">•2024-01-25 10:00</span>
                  <span className="bg-light-dark rounded-3 px-2">
                    scheduled
                  </span>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button outline color="dark">
                  Edit
                </Button>
                <Button color="danger">Delete</Button>
              </div>
            </CardBody>
          </Card>
          <Card className="shadow">
            <CardBody className="d-flex justify-content-between">
              <div>
                <p className="mb-0 text-truncate">
                  Posted: New mortgage rates available! Contact us for the
                  latest deals.
                </p>
                <small className="text-info">
                  #MortgageDeals #PropertyFinance
                </small>
                <div className="mt-1">
                  <span className="me-1">
                    <TbBrandFacebook />
                  </span>
                  <span className="me-1">
                    <TbBrandInstagram />
                  </span>
                  <span className="me-1">
                    <TbBrandTwitter />
                  </span>
                  <span className="me-1">•2024-01-25 10:00</span>
                  <span className="bg-light-success rounded-3 px-2">
                    published
                  </span>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button outline color="dark">
                  Edit
                </Button>
                <Button color="danger">Delete</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </CardBody>
    </Card>
  );
};

export default ScheduledPosts;
