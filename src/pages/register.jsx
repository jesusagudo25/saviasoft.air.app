import { Helmet } from 'react-helmet-async';

import { RegisterView } from 'src/sections/register';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
      <title> Register | {import.meta.env.VITE_APP_TITLE} </title>
      </Helmet>

      <RegisterView />
    </>
  );
}
