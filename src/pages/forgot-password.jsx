import { Helmet } from 'react-helmet-async';

import { ForgotPasswordView } from 'src/sections/forgot-password';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
      <title> Olvido de contraseña | {import.meta.env.VITE_APP_TITLE} </title>
      </Helmet>

      <ForgotPasswordView />
    </>
  );
}
