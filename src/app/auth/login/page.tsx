'use client';
import { LoginForm } from '@/Components/Auth/LoginForm';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Col, Container, Row } from 'reactstrap';

const UserLogin = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If no session, show login form
    if (!session) return;

    const accessToken = session.user?.accessToken;
    const refreshToken = session.user?.refreshToken;
    const role = session.user?.role;
    const isNetwork = session.user?.is_network;

    // Verify tokens exist before proceeding
    if (!accessToken || !refreshToken) {
      console.warn('Tokens missing in session');
      return;
    }

    // Ensure tokens are in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }

    // Route based on role and network status
    if (role === 'SUPER_ADMIN') {
      router.push('/super-admin/dashboard');
    } else if (role === 'DIRECTOR' && isNetwork) {
      router.push('/network/director/dashboard');
    } else if (role === 'COMPLIANCE' && isNetwork) {
      router.push('/network/director/dashboard');
    } else if (role === 'ADVISER' && isNetwork) {
      router.push('/network/adviser/dashboard');
    } else if (role === 'DIRECTOR' && isNetwork === false) {
      router.push('/organisation/director/dashboard');
    } else if (role === 'ADVISER' && isNetwork === false) {
      router.push('/organisation/adviser/dashboard');
    } else if (role === 'ADMIN' && isNetwork === false) {
      router.push('/organisation/admin/dashboard');
    } else if (role === 'APPLICANT') {
      router.push('/applicant/dashboard');
    } else {
      console.warn('Unknown role:', role);
    }
  }, [session, router]);

  if (session) return null;
  return (
    <Container fluid className='p-0'>
      <Row className='m-0'>
        <Col xs='12' className='p-0'>
          <div className='login-card login-dark'>
            <LoginForm />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserLogin;
