import ConfigDB from '@/Config/ThemeConfig';
import { useAppDispatch, useAppSelector } from '@/Redux/Hooks';
import { useGetPublicAppranceQuery } from '@/Redux/Reducers/Appearance/AppearanceApi';
import { addSideBarBackGround } from '@/Redux/Reducers/ThemeCustomizerReducer';
import { getSession, signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BiMoon, BiSolidSun } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { Button, Form, FormGroup, Input, Label, Spinner } from 'reactstrap';
import imageTwo from '../../../public/assets/images/logo/logo-dark.png';
import imageOne from '../../../public/assets/images/logo/logo1.png';

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const currentTheme = useAppSelector(
    (state) => state.themeCustomizer.mix_background_layout,
  );
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: appearanceData } = useGetPublicAppranceQuery(undefined);

  // Sync tokens from NextAuth session to localStorage after successful login
  useEffect(() => {
    if (session?.user?.accessToken && session?.user?.refreshToken) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', session.user.accessToken);
        localStorage.setItem('refreshToken', session.user.refreshToken);
      }
    }
  }, [session?.user?.accessToken, session?.user?.refreshToken]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      ConfigDB.color.mix_background_layout = savedTheme;
      document.body.className = `${
        document.body.className.split(' ').find((cls) => cls.includes('__')) ||
        ''
      } ${savedTheme}`.trim();

      if (currentTheme !== savedTheme) {
        dispatch(addSideBarBackGround(savedTheme));
      }
    }
  }, [dispatch, currentTheme]);

  const handleThemeToggle = () => {
    const nextTheme = currentTheme !== 'light' ? 'light' : 'dark-only';
    ConfigDB.color.mix_background_layout = nextTheme;
    dispatch(addSideBarBackGround(nextTheme));

    const fontClass =
      document.body.className.split(' ').find((cls) => cls.includes('__')) ||
      '';
    document.body.className = `${fontClass} ${nextTheme}`.trim();
    localStorage.setItem('theme', nextTheme);
  };

  const formSubmitHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Get user agent from navigator
    const userAgent =
      typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Device';

    // Extract subdomain from browser URL
    let subdomain = process.env.NEXT_PUBLIC_LOCAL_SUBDOMAIN || ''; // Default for localhost
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;

      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        const parts = hostname.split('.');
        if (
          parts.length > 2 ||
          (parts.length === 2 && parts[1] === 'localhost')
        ) {
          const extractedSubdomain = parts[0];
          if (extractedSubdomain && extractedSubdomain !== 'www') {
            subdomain = extractedSubdomain;
          }
        }
      }
    }

    const result = await signIn('credentials', {
      email,
      password,
      userAgent,
      subdomain,
      redirect: false,
    });
    setIsLoading(false);
    if (result?.ok) {
      toast.success('Successfully Logged in. Redirecting...');

      // Store tokens immediately after successful login
      // Get the updated session with tokens
      const session = await getSession();
      if (session?.user?.accessToken && session?.user?.refreshToken) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', session.user.accessToken);
          localStorage.setItem('refreshToken', session.user.refreshToken);
          // console.log('Tokens stored to localStorage after login');
        }
      }
    } else {
      toast.error('Invalid Credentials...');
    }
  };
  return (
    <div className='login-main'>
      <Form
        className='theme-form'
        onSubmit={(event) => formSubmitHandle(event)}
      >
        <div className='position-relative'>
          <Button
            type='button'
            color='black'
            className={
              currentTheme === 'light' ? 'bg-light-dark' : 'bg-light-primary'
            }
            onClick={handleThemeToggle}
            aria-label='Toggle theme'
            title={
              currentTheme === 'light'
                ? 'Switch to dark mode'
                : 'Switch to light mode'
            }
            style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
            }}
          >
            {currentTheme === 'light' ? <BiMoon /> : <BiSolidSun />}
          </Button>
        </div>
        <div className='d-flex align-items-start justify-content-center'>
          <Link className='logo mb-2' href='/'>
            <Image
              width={300}
              height={100}
              className='img-fluid for-light'
              src={appearanceData?.logo || imageOne}
              alt='login page'
              priority
              style={{ width: '160px', height: '60px' }}
            />
            <Image
              width={300}
              height={100}
              className='img-fluid for-dark'
              src={appearanceData?.logo || imageTwo}
              alt='login page'
              priority
              style={{ width: '160px', height: '60px' }}
            />
          </Link>
        </div>
        <h2 className='text-center'>Sign in to account</h2>
        <p className='text-center mb-2'>Enter your email & password to login</p>
        <FormGroup>
          <Label className='col-form-label'>Email Address</Label>
          <Input
            type='email'
            onChange={(event) => setEmail(event.target.value)}
            placeholder='Enter Your Registered Email'
            required
          />
        </FormGroup>
        <FormGroup>
          <Label className='col-form-label'>Password</Label>
          <div className='position-relative form-input'>
            <Input
              type={show ? 'text' : 'password'}
              onChange={(event) => setPassword(event.target.value)}
              placeholder='Enter Password'
              required
            />
            <div className='show-hide' onClick={() => setShow(!show)}>
              <span className='show fs-4'>{show ? '🫣' : '🤫'}</span>
            </div>
          </div>
        </FormGroup>
        <FormGroup className='mb-0 checkbox-checked'>
          <Link className='link' href={`/auth/forgot-password/send-email`}>
            Forgot password?
          </Link>
          <div className='text-end mt-3'>
            <Button type='submit' color='primary' block disabled={isLoading}>
              {isLoading ? <Spinner size='sm' /> : 'Sign in'}
            </Button>
          </div>
        </FormGroup>
      </Form>
    </div>
  );
};
