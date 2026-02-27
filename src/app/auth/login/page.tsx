"use client";
import { LoginForm } from "@/Components/Auth/LoginForm";
import { getSession, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Col, Container, Row } from "reactstrap";

const UserLogin = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only act once NextAuth has resolved auth state.
    if (status !== "authenticated") return;
    if (!session?.user?.accessToken) return;

    // On some browsers/devices right after first login, `user_type` can be briefly
    // missing even though the session has been established. Avoid signing out
    // or redirecting until it is available.
    if (!session.user?.user_type) {
      const timeoutId = window.setTimeout(async () => {
        const refreshed = await getSession();
        if (refreshed?.user?.user_type) {
          // Session now has role; the effect will re-run and redirect.
          return;
        }
        // Still no role after waiting; sign out to avoid being stuck.
        await signOut({ redirect: false });
      }, 800);

      return () => window.clearTimeout(timeoutId);
    }

    if (session.user?.user_type === "ADMIN") {
      router.push("/admin/dashboard");
    } else if (session.user?.user_type === "NETWORK_DIRECTOR") {
      router.push("/network/director/dashboard");
    } else if (session.user?.user_type === "NETWORK_COMPLIANCE") {
      router.push("/network/director/dashboard");
    } else if (session.user?.user_type === "NETWORK_ADVISER") {
      router.push("/network/adviser/dashboard");
    } else if (session.user?.user_type === "ORGANISATION_DIRECTOR") {
      router.push("/organisation/director/dashboard");
    } else if (session.user?.user_type === "ORGANISATION_ADVISER") {
      router.push("/organisation/adviser/dashboard");
    } else if (session.user?.user_type === "ORGANISATION_ADMIN") {
      router.push("/organisation/admin/dashboard");
    } else if (session.user?.user_type === "CLIENT") {
      router.push("/client/dashboard");
    } else {
      // Unknown role but authenticated; sign out without relying on redirects.
      signOut({ redirect: false });
    }
  }, [session, status, router]);

  if (status === "authenticated") return null;
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
