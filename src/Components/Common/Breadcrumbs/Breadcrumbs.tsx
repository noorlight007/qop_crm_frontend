import { BreadcrumbsProps } from "@/Types/BreadcrumbsType";
import { getDashboardHomeUrl } from "@/utils/RedirectPaths";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, Col, Container, Row } from "reactstrap";

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  title,
  subTitle,
  parent,
  child,
  items,
}) => {
  const { data: session } = useSession();
  return (
    <Container fluid>
      <Row className="page-title">
        <Col sm="6">
          <h2>{title}</h2>
          <p className="mb-0 text-title-gray">{subTitle}</p>
        </Col>
        <Col sm="6">
          <Breadcrumb className="justify-content-sm-end align-items-center">
            <BreadcrumbItem>
              <Link href={getDashboardHomeUrl(session)}>
                <i className="iconly-Home icli svg-color" />
              </Link>
            </BreadcrumbItem>
            {items?.length ? (
              items.map((item, index) => {
                const isActive = item.active ?? index === items.length - 1;
                return (
                  <BreadcrumbItem
                    key={index}
                    className={isActive ? "active" : undefined}
                  >
                    {item.href && !isActive ? (
                      <Link href={item.href}>{item.label}</Link>
                    ) : (
                      item.label
                    )}
                  </BreadcrumbItem>
                );
              })
            ) : (
              <>
                {parent && <BreadcrumbItem>{parent}</BreadcrumbItem>}
                {child && (
                  <BreadcrumbItem className="active">{child}</BreadcrumbItem>
                )}
              </>
            )}
          </Breadcrumb>
        </Col>
      </Row>
    </Container>
  );
};

export default Breadcrumbs;
