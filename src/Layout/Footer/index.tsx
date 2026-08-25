import { Col, Container, Row } from 'reactstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year
  return (
    <footer className='footer'>
      <Container fluid>
        <Row>
          <Col md='6' className='footer-copyright'>
            <p className='mb-0'>
              Copyright 2025-{currentYear} &copy; QOP. All rights reserved.
            </p>
          </Col>
          <Col md='6'>
            <p className='float-end mb-0'>
              Version: {process.env.NEXT_PUBLIC_MANUAL_VERSION}
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
