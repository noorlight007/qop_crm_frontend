import { BreadcrumbsProps } from "@/Types/BreadcrumbsType";
import { getDashboardHomeUrl } from "@/utils/RedirectPaths";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { TbArrowBarToLeft } from "react-icons/tb";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Col,
  Container,
  Row,
} from "reactstrap";

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  title,
  subTitle,
  items,
}) => {
  const { data: session } = useSession();

  return (
    <Container fluid>
      <Row className="page-title">
        <Col sm="6">
          <h2>{title}</h2>
          <small className="mb-0 text-muted">{subTitle}</small>
        </Col>
        <Col sm="6">
          <Breadcrumb className="justify-content-sm-end align-items-center">
            {/* Back / Forward buttons */}
            <div className="d-flex gap-1 me-2 pe-2 border-end border-2">
              <Button
                color="primary"
                outline
                size="sm"
                onClick={() => window.history.back()}
                title="Go back"
              >
                <TbArrowBarToLeft size={14} />
              </Button>
            </div>

            {/* Home */}
            <BreadcrumbItem>
              <Link href={getDashboardHomeUrl(session)}>
                <i className="iconly-Home icli svg-color" />
              </Link>
            </BreadcrumbItem>

            {/* Dynamic items */}
            {items?.map((item, index) => {
              const isActive = item.active ?? index === items.length - 1;
              return (
                <BreadcrumbItem key={index} active={isActive}>
                  {item.href && !isActive ? (
                    <Link href={item.href}>{item.label}</Link>
                  ) : (
                    item.label
                  )}
                </BreadcrumbItem>
              );
            })}
          </Breadcrumb>
        </Col>
      </Row>
    </Container>
  );
};

export default Breadcrumbs;
