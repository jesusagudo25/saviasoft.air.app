import { Helmet } from 'react-helmet-async';

import { DeviceView } from 'src/sections/device/view';

export default function device ()  {
    return (
        <>
          <Helmet>
            <title> Dispositivos | {import.meta.env.VITE_APP_TITLE} </title>
          </Helmet>
    
            <DeviceView />
        </>
      );
}