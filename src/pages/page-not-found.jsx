import { Helmet } from 'react-helmet-async';

import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title> Página no encontrada | {import.meta.env.VITE_APP_TITLE} </title>
      </Helmet>

      <NotFoundView />
    </>
  );
}
