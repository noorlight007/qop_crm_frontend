"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button, Col, Container } from "reactstrap";

const FallbackLogout: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Create a new Audio instance and play it
    const audio = new Audio("/assets/audio/error_sound.mp3");
    audio.play().catch((err) => {
      console.warn("Audio playback failed:", err);
    });

    return () => {
      audio.pause(); // Cleanup if needed
    };
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  return (
    <div>
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <div className="error-wrapper">
          <Container>
            <div className="svg-wrraper">
              <Image
                src={"/assets/images/logout/logouterror.png"}
                alt="access"
                className="rounded-2"
                width={500}
                height={400}
              />
            </div>
            <Col md="8" className="offset-md-2">
              <h3 className="mb-0 text-danger">Access Restricted!</h3>
              <p className="sub-content mt-0 mb-2">
                You don't have permission to view this page. Please contact your
                administrator.
              </p>
              <Button
                color="danger"
                onClick={handleLogout}
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
                {"LOGOUT"}
              </Button>
            </Col>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default FallbackLogout;
