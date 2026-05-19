import { useGetAdvertisersQuery } from "@/Redux/Reducers/SuperAdmin/Advertisers/AdvertisersApi";
import { PlusCircle } from "react-feather";
import { FaEnvelope, FaGlobe, FaSearch } from "react-icons/fa";
import { Alert, Button, Card, CardBody, Col, Row, Spinner } from "reactstrap";

type Advertiser = {
  alias: string;
  company_name: string;
  contact_email?: string | null;
  website?: string | null;
};

type AdvertiserListResponse = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: Advertiser[];
};

const getInitials = (value?: string | null) => {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return "—";

  const parts = trimmed.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second =
    parts.length > 1 ? (parts[1]?.[0] ?? "") : (parts[0]?.[1] ?? "");
  return (first + second).toUpperCase() || "—";
};

const toAbsoluteUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const AdvertiserList: React.FC = () => {
  const {
    data: advertisersData,
    isLoading,
    isFetching,
    error,
  } = useGetAdvertisersQuery(undefined);

  const response = advertisersData as AdvertiserListResponse | Advertiser[];
  const advertisers: Advertiser[] = Array.isArray(response)
    ? response
    : (response?.results ?? []);

  const totalCount = Array.isArray(response)
    ? advertisers.length
    : (response?.count ?? advertisers.length);

  const apiErrorDetail: string | null = (() => {
    if (!error) return null;
    const data = (error as any)?.data ?? (error as any);
    const detail = data?.detail ?? data?.message ?? data;
    if (!detail) return JSON.stringify(error);
    return typeof detail === "string" ? detail : JSON.stringify(detail);
  })();

  if (isLoading) {
    return (
      <Row className="py-5">
        <Col xs="12" className="text-center">
          <Spinner color="primary" className="mb-3" />
        </Col>
      </Row>
    );
  }

  if (apiErrorDetail) {
    return (
      <Row className="mt-3">
        <Col xs="12">
          <Alert color="danger" className="mb-0">
            {apiErrorDetail}
          </Alert>
        </Col>
      </Row>
    );
  }

  if (!advertisers.length) {
    return (
      <Row className="py-5">
        <Col xs="12" className="text-center">
          <div className="text-muted">
            <FaSearch size={48} className="mb-3 opacity-50" />
            <h5 className="mb-1">No advertisers found</h5>
            <p className="mb-0">Create an advertiser to get started.</p>
          </div>
        </Col>
      </Row>
    );
  }

  return (
    <Row className="mt-4 g-4">
      <Col
        xs="12"
        className="d-flex justify-content-end align-items-center mb-3"
      >
        <Button color="primary">
          <PlusCircle size={16} className="me-2" />
          Add Advertiser
        </Button>
      </Col>

      {advertisers.map((advertiser) => (
        <Col xs="12" md="6" xl="4" key={advertiser.alias}>
          <Card className="h-100 border-0 shadow-lg rounded-4 overflow-hidden mb-0 bg-white">
            <CardBody className="p-4 d-flex flex-column">
              <div className="d-flex align-items-start justify-content-between gap-3">
                <div className="d-flex align-items-center gap-3 flex-grow-1 overflow-hidden">
                  <div className="rounded-circle bg-light-primary d-flex align-items-center justify-content-center img-40 img-h-40 flex-shrink-0">
                    <span className="fw-bold text-primary text-uppercase">
                      {getInitials(advertiser.company_name || advertiser.alias)}
                    </span>
                  </div>

                  <div className="flex-grow-1 overflow-hidden">
                    <h5 className="mb-1 fw-bold text-dark text-truncate w-100">
                      {advertiser.company_name || "Not provided"}
                    </h5>
                  </div>
                </div>

                {isFetching ? (
                  <Spinner
                    size="sm"
                    color="primary"
                    className="flex-shrink-0"
                  />
                ) : null}
              </div>

              <div className="border-top pt-3 mt-3 w-100">
                <div className="d-flex align-items-start gap-3 mb-3">
                  <div className="rounded-circle bg-light-primary d-flex align-items-center justify-content-center img-40 img-h-40 flex-shrink-0">
                    <FaEnvelope className="text-primary" />
                  </div>

                  <div className="flex-grow-1 overflow-hidden">
                    <small className="text-muted d-block mb-1 text-truncate">
                      Email
                    </small>
                    {advertiser.contact_email ? (
                      advertiser.contact_email
                    ) : (
                      <small className="text-muted">Not provided</small>
                    )}
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-circle bg-light-primary d-flex align-items-center justify-content-center img-40 img-h-40 flex-shrink-0">
                    <FaGlobe className="text-primary" />
                  </div>

                  <div className="flex-grow-1 overflow-hidden">
                    <small className="text-muted d-block mb-1 text-truncate">
                      Website
                    </small>
                    {advertiser.website ? (
                      <a
                        className="fw-medium text-dark text-decoration-none text-truncate d-block w-100"
                        href={toAbsoluteUrl(advertiser.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={advertiser.website}
                      >
                        {advertiser.website}
                      </a>
                    ) : (
                      <small className="text-muted">Not provided</small>
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default AdvertiserList;
