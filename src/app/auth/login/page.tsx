"use client";
import { LoginForm } from "@/Components/Auth/LoginForm";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Col, Container, Row } from "reactstrap";

const UserLogin = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) return;

    if (session.user?.user_type === "ADMIN") {
      router.push("/admin");
    } else if (
      session.user?.user_type === "NETWORK_DIRECTOR" ||
      session.user?.user_type === "NETWORK_COMPLIANCE_ASSISTANT"
    ) {
      router.push("/network/director");
    } else if (session.user?.user_type === "NETWORK_ADVISER") {
      router.push("/network/adviser");
    } else if (session.user?.user_type === "ORGANISATION_DIRECTOR") {
      router.push("/organisation/director");
    } else if (session.user?.user_type === "ORGANISATION_ADVISER") {
      router.push("/organisation/adviser");
    } else if (session.user?.user_type === "ORGANISATION_ADMIN") {
      router.push("/organisation/admin");
    } else if (session.user?.user_type === "CLIENT") {
      router.push("/client");
    } else if (session.user?.accessToken) {
      // Unknown role but still have a session; force sign-out
      // without relying on redirects to avoid loops.
      signOut({ redirect: false });
    }
  }, [session, router]);

  if (session) return null;
  return (
    <Container fluid className="p-0">
      <Row className="m-0">
        <Col xs="12" className="p-0">
          <div className="login-card login-dark">
            <LoginForm />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserLogin;
