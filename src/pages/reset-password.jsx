import { Helmet } from 'react-helmet-async';

import { ResetPasswordView } from 'src/sections/reset-password';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
      <title> Restablecer contraseña | {import.meta.env.VITE_APP_TITLE} </title>
      </Helmet>

      <ResetPasswordView />
    </>
  );
}
