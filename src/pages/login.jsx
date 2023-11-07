import { Helmet } from 'react-helmet-async';

import { LoginView } from 'src/sections/login';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
      <title> Login | {import.meta.env.VITE_APP_TITLE} </title>
      </Helmet>

      <LoginView />
    </>
  );
}
