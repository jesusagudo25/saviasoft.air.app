import { Helmet } from 'react-helmet-async';

import { ReadingView } from 'src/sections/reading/view';

export default function reading() {
  return (
    <>
    <Helmet>
      <title> Lecturas | {import.meta.env.VITE_APP_TITLE} </title>
    </Helmet>

      <ReadingView />
  </>
  )
}
