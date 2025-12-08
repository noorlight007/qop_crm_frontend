"use client";
import { LoginForm } from "@/Components/Auth/LoginForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Col, Container, Row } from "reactstrap";

const UserLogin = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.user_type === "ADMIN") {
      router.push("/dashboard/admin");
    } else if (
      session?.user?.user_type === "NETWORK_ADMIN" ||
      session?.user?.user_type === "NETWORK_COMPLIANCE_ASSISTANT"
    ) {
      router.push("/dashboard/network/director");
    } else if (session?.user?.user_type === "NETWORK_ADVISER") {
      router.push("/dashboard/network/adviser");
    } else if (session?.user?.user_type === "CLIENT") {
      router.push("/dashboard/client");
    } else if (session?.user?.user_type === "ORGANIZATION_ADMIN") {
      router.push("/dashboard/organisation");
    } else if (session?.user?.user_type === "ORGANIZATION_ADVISER") {
      router.push("/dashboard/orgadviser");
    } else if (session?.user?.user_type === "ORGANIZATION_SUPPORT") {
      router.push("/dashboard/orgstaff");
    } else {
      if (session?.user?.accessToken) {
        router.push("/logout");
      } else {
        router.push("/auth/login");
      }
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
