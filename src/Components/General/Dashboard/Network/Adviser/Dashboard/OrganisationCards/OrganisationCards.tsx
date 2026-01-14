import { useGetOrganisationListQuery } from "@/Redux/Reducers/Network/Director/Organisations/OrganisationListApi";
import Image from "next/image";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import {
  Card,
  CardBody,
  Col,
  Input,
  InputGroup,
  Row,
  Spinner,
} from "reactstrap";

const OrganisationCards = () => {
  const [searchQuery, setSearchQuery] = useState("");

  //RTK api Hooks
  const { data: organisationList, isLoading } = useGetOrganisationListQuery({
    search: searchQuery,
  });

  return (
    <Card className="mt-4">
      <Row>
        <Col md="12" className="px-4">
          <Row className="flex justify-content-between py-4">
            <Col md="3">
              <h4 className="mb-4 fw-bold">Organisations</h4>
            </Col>
            <Col md="3" xs="12">
              <InputGroup className="position-relative">
                <FaSearch
                  className="position-absolute top-50 start-0 translate-middle-y ms-2 text-primary"
                  style={{ zIndex: 10, pointerEvents: "none" }}
                />
                <Input
                  type="text"
                  placeholder="Search Organisation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ padding: "10px 10px 10px 25px" }}
                />
              </InputGroup>
            </Col>
            <Col md="3" xs="12" />
            {/* <Col
              md="3"
              xs="12"
              className="text-md-end text-center mt-2 mt-md-0"
            >
              <Link
                href="/dashboard/network/organisations"
                className="text-decoration-none"
              >
                <Button color="primary">
                  <TbEye className="me-1 fs-5" />
                  View All Organisation
                </Button>
              </Link>
            </Col> */}
          </Row>
          <Row>
            {isLoading ? (
              <Row className="pb-4 d-flex justify-content-center">
                <Spinner color="primary" />
              </Row>
            ) : organisationList && organisationList.length > 0 ? (
              organisationList.slice(0, 8).map((item: any) => (
                <Col
                  sm="6"
                  xxl="3"
                  lg="4"
                  className="col-ed-4 box-col-4"
                  key={item.slug}
                >
                  <Card className="bg-white border organisation_card opacity-100  p-3 position-relative">
                    {/* <Link
                      href={`/dashboard/network/organisations/${item.slug}`}
                      href="#"
                      target="_blank"
                      className="text-muted position-absolute top-0 end-0 p-3"
                    >
                      <i
                        style={{ fontSize: "10px" }}
                        className="fa-solid fa-up-right-from-square"
                      ></i>
                    </Link> */}

                    <CardBody className="p-0 ">
                      <div className="d-flex gap-2">
                        <div className="mt-0 rounded-circle overflow-hidden border-1 border-primary">
                          <Image
                            width="28"
                            height="28"
                            className="object-fit-cover"
                            src={item.logo || "/assets/images/network/logo.jpg"}
                            alt="Organisation"
                          />
                        </div>
                        <h5 className="mb-1">
                          <span className="text-black fw-bold">
                            {item.name}
                          </span>
                          {/* <Link
                            className="text-black fw-bold text_decoration_hover"
                            href="#"
                          >
                            {item.name}
                          </Link> */}
                        </h5>
                      </div>
                      <div className="mt-2 mb-4">{item.email}</div>
                      <div className="d-flex justify-content-between mt-3 pt-2 border-top">
                        <Col className="border-end">
                          <div className="text-center ">
                            <h5 className="mb-0">15</h5>
                            <span className="text-primary small">Cases</span>
                          </div>
                        </Col>
                        <Col className="border-end">
                          <div className="text-center ">
                            <h5 className="mb-0">10</h5>
                            <span className="text-primary small">
                              Employees
                            </span>
                          </div>
                        </Col>
                        <Col className="">
                          <div className="text-center">
                            <h5 className="mb-0">14</h5>
                            <span className="text-primary small">Clients</span>
                          </div>
                        </Col>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))
            ) : (
              <Row className="text-center">
                <p>Organisation not found!</p>
              </Row>
            )}
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default OrganisationCards;
