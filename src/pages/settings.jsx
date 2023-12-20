import React from 'react'
import { Helmet } from 'react-helmet-async'

import { SettingsView } from 'src/sections/settings/view'

export default function settings() {
  return (
    <>
      <Helmet>
        <title> Panel de administración | {import.meta.env.VITE_APP_TITLE}  </title>
      </Helmet>

      <SettingsView />
    </>
  )
}
