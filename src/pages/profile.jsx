import React from 'react'
import { Helmet } from 'react-helmet-async'

import { ProfilesView } from 'src/sections/profile';

export default function profile() {
    return (
        <>
            <Helmet>
                <title> Perfil | {import.meta.env.VITE_APP_TITLE}  </title>
            </Helmet>

            <ProfilesView />

        </>
    )
}
