import { Helmet } from 'react-helmet-async';

import { AppView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | {import.meta.env.VITE_APP_TITLE}  </title>
      </Helmet>

      <AppView />
    </>
  );
}
