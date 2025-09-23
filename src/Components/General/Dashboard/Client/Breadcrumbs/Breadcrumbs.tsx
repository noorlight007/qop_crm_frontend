import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, Col, Container, Row } from "reactstrap";

interface ClientBreadcrumbsProps {
  mainTitle: string;
  title: string;
  parent?: string;
  activePage?: string;
}

const ClientBreadcrumbs: React.FC<ClientBreadcrumbsProps> = ({
  mainTitle,
  title,
  parent,
  activePage,
}) => {
  return (
    <Container fluid>
      <Row className="page-title">
        <Col sm="6">
          <h2>{mainTitle}</h2>
          <p className="mb-0 text-title-gray">{title}</p>
        </Col>
        <Col sm="6">
          <Breadcrumb className="justify-content-sm-end align-items-center">
            <BreadcrumbItem>
              <Link href={`/dashboard/client`}>
                <i className="iconly-Home icli svg-color" />
              </Link>
            </BreadcrumbItem>
            {parent && <BreadcrumbItem>{parent}</BreadcrumbItem>}
            {activePage && (
              <BreadcrumbItem className="active">{activePage}</BreadcrumbItem>
            )}
          </Breadcrumb>
        </Col>
      </Row>
    </Container>
  );
};

export default ClientBreadcrumbs;
