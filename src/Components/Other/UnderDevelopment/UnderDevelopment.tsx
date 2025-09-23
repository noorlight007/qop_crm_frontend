import { Button, Col, Container, NavLink, Row } from "reactstrap";

const UnderDevelopment = () => {
  return (
    <Container className="min-vh-100 text-center mt-5">
      <Row>
        <Col>
          <i
            style={{ fontSize: "100px", color: "gray" }}
            className="fa-solid fa-circle-exclamation"
          ></i>
          <h1 className="text-danger mt-3">Sorry!</h1>
          <h5 className="text-primary mt-2">This page is Under Development.</h5>
          <NavLink href={"/auth/login"}>
            <Button
              className="mt-2"
              style={{
                animation: "pulseEffect 2s infinite",
                background: "linear-gradient(45deg, #007bff, #00bfff)",
                border: "none",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <style>
                {`
      @keyframes pulseEffect {
        0% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
        }
        
        50% {
          transform: scale(1.05);
          box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
        }
        
        100% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
        }
      }
    `}
              </style>
              Go To Dashboard
            </Button>
          </NavLink>
        </Col>
      </Row>
    </Container>
  );
};

export default UnderDevelopment;
