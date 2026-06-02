'use client';
import { useNavigationHistory } from '@/context/NavigationHistoryContext';
import { BreadcrumbsProps } from '@/Types/BreadcrumbsType';
import { getDashboardHomeUrl } from '@/utils/RedirectPaths';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { TbArrowBarToLeft, TbArrowBarToRight, TbReload } from 'react-icons/tb';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Col,
  Container,
  Row,
} from 'reactstrap';

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  title,
  subTitle,
  items,
}) => {
  const { data: session } = useSession();
  const { back, forward, canGoBack, canGoForward, reload } =
    useNavigationHistory();

  return (
    <Container fluid>
      <Row className='page-title'>
        <Col sm='6'>
          <h2>{title}</h2>
          <small className='mb-0 text-muted'>{subTitle}</small>
        </Col>
        <Col sm='6'>
          <Breadcrumb className='justify-content-sm-end align-items-center'>
            {/* Back / Forward buttons */}
            <div className='d-flex gap-2 me-2 pe-2 border-end border-2'>
              <Button
                color='secondary'
                size='sm'
                onClick={back}
                disabled={!canGoBack}
                title='Go back'
                aria-label='Go back'
                className='rounded-circle'
              >
                <TbArrowBarToLeft style={{ marginBottom: '2px' }} />
              </Button>
              <Button
                color='secondary'
                size='sm'
                onClick={forward}
                disabled={!canGoForward}
                title='Go forward'
                aria-label='Go forward'
                className='rounded-circle'
              >
                <TbArrowBarToRight style={{ marginBottom: '2px' }} />
              </Button>
              <Button
                color='secondary'
                size='sm'
                onClick={reload}
                title='Reload page'
                aria-label='Reload page'
                className='rounded-circle'
              >
                <TbReload style={{ marginBottom: '2px' }} />
              </Button>
            </div>

            {/* Home */}
            <BreadcrumbItem>
              <Link href={getDashboardHomeUrl(session)}>
                <i className='iconly-Home icli svg-color' />
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
