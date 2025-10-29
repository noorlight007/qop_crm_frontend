"use client";
import Image from "next/image";
import Link from "next/link";
import { Button, Col, Container } from "reactstrap";

const UnauthorizedPage: React.FC = () => {
  return (
    <div>
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <div className="error-wrapper">
          <Container>
            <div className="svg-wrraper">
              <Image
                src={"/assets/images/logout/logouterror.png"}
                alt="unauthorized"
                className="rounded-2"
                width={500}
                height={400}
              />
            </div>
            <Col md="8" className="offset-md-2">
              <h3 className="mb-0 text-danger">Session Ended</h3>
              <p className="sub-content mt-0 mb-2">
                Your session was ended (possibly from another tab). Please sign
                in again to continue.
              </p>
              <Button
                color="danger"
                // onClick={handleGoToLogin}
                style={{
                  animation: "pulseEffect 2s infinite",
                  background: "linear-gradient(45deg, #ff0000, #ff6b6b)",
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
          box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
        }
        
        50% {
          transform: scale(1.05);
          box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
        }
        
        100% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
        }
      }
    `}
                </style>
                <Link className="text-white" href="/auth/login">
                  {"SIGN IN"}
                </Link>
              </Button>
            </Col>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
