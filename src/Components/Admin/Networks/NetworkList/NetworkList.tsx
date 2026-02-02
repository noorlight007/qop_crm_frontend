import { useGetNetworkListQuery } from "@/Redux/Reducers/Admin/Networks/NetworksApi";
import { Network } from "@/Types/Admin/Networks/NetworkType";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import { useState } from "react";
import {
  FaCalendarAlt,
  FaEnvelope,
  FaGlobe,
  FaInfoCircle,
  FaPhone,
  FaSearch,
} from "react-icons/fa";
import { TbCirclePlus } from "react-icons/tb";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  InputGroup,
  PopoverBody,
  Row,
  Spinner,
  UncontrolledPopover,
} from "reactstrap";

const NetworkList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: getNetworkList, isLoading } = useGetNetworkListQuery({});

  return (
    <div>
      <Container fluid>
        <Row>
          <Col xs="12">
            <Card className="px-4 border-0 shadow-sm">
              <Row className="flex justify-content-between py-4">
                <Col md="3">
                  <h4 className="mb-0 fw-bold text-dark">Networks</h4>
                  <p className="text-muted small mb-0">
                    {getNetworkList?.count || 0} total networks
                  </p>
                </Col>
                <Col md={3} xs="12" className="mt-3 mt-md-0">
                  <InputGroup className="position-relative">
                    <FaSearch
                      className="position-absolute top-50 start-0 translate-middle-y ms-2 text-primary"
                      style={{ zIndex: 10, pointerEvents: "none" }}
                    />
                    <Input
                      type="text"
                      placeholder="Search Organisation... "
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        // setCurrentPage(1);
                      }}
                      style={{ padding: "10px 10px 10px 25px" }}
                      className="rounded-end-1"
                    />
                    <FaInfoCircle
                      id="OrgListSearchSuggestion"
                      className="position-absolute top-50 end-0 translate-middle-y me-2 text-primary fs-6"
                      style={{ cursor: "pointer", zIndex: 10 }}
                    />

                    <UncontrolledPopover
                      placement="right"
                      target="OrgListSearchSuggestion"
                      trigger="hover"
                    >
                      <PopoverBody className="bg-white rounded text-dark p-3 small">
                        🔍 You can search using Organisation Name.
                      </PopoverBody>
                    </UncontrolledPopover>
                  </InputGroup>
                </Col>
                <Col
                  md="3"
                  xs="12"
                  className="text-md-end text-center mt-3 mt-md-0"
                >
                  <Button color="primary" className="px-4">
                    <TbCirclePlus size={18} className="me-2" />
                    Add Network
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Network Cards Section */}
        <Row className="mt-4">
          {isLoading ? (
            <Col xs="12" className="text-center py-5">
              <Spinner color="primary" className="mb-3">
                Loading...
              </Spinner>
              <p className="mt-3 text-muted">Loading networks...</p>
            </Col>
          ) : getNetworkList?.results?.length === 0 ? (
            <Col xs="12" className="text-center py-5">
              <div className="text-muted">
                <FaSearch size={48} className="mb-3 opacity-50" />
                <h5>No networks found</h5>
                <p>
                  {searchQuery
                    ? "Try adjusting your search criteria"
                    : "Click 'Add Network' to create your first network"}
                </p>
              </div>
            </Col>
          ) : (
            getNetworkList?.results?.map((network: Network) => (
              <Col key={network.slug} xs="12" md="6" lg="4" className="mb-4">
                <Card className="h-100 shadow-sm border-0">
                  <CardBody className="p-3">
                    <div className="d-flex gap-3">
                      {/* Logo Section */}
                      <div className="flex-shrink-0 position-relative">
                        {network.logo ? (
                          <img
                            src={network.logo}
                            alt={network.name}
                            className="rounded"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="bg-primary bg-gradient text-center rounded d-flex align-items-center justify-content-center"
                            style={{ width: "80px", height: "80px" }}
                          >
                            <h3 className="text-white fw-bold mb-0">
                              {network.name.charAt(0).toUpperCase()}
                            </h3>
                          </div>
                        )}
                      </div>

                      {/* Details Section */}
                      <div className="flex-grow-1">
                        <h5 className="fw-bold text-dark mb-1">
                          {network.name}
                        </h5>
                        <p className="text-muted small mb-2">
                          <FaGlobe className="me-1" />
                          {network.subdomain}
                        </p>

                        <div className="mb-1">
                          <small className="text-muted d-flex align-items-center">
                            <FaEnvelope className="me-2 text-primary" />
                            <span className="text-truncate">
                              {network.email}
                            </span>
                          </small>
                        </div>

                        <div className="mb-2">
                          <small className="text-muted d-flex align-items-center">
                            <FaPhone className="me-2 text-primary" />
                            {network.primary_mobile}
                          </small>
                        </div>
                      </div>
                    </div>

                    <hr className="my-3" />

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <small className="text-muted">
                        <FaCalendarAlt className="me-1" />
                        Created {formatDateAndTime(network.created_at)}
                      </small>
                    </div>

                    <Row className="g-2">
                      <Col xs="6">
                        <Button
                          color="primary"
                          outline
                          size="sm"
                          block
                          className="fw-semibold"
                        >
                          Edit
                        </Button>
                      </Col>
                      <Col xs="6">
                        <Button
                          color="secondary"
                          outline
                          size="sm"
                          block
                          className="fw-semibold"
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>
  );
};

export default NetworkList;
