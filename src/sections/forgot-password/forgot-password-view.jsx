import axios from 'axios';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';


// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();

  const { control, handleSubmit, formState: { errors }, } = useForm();

  const [isLoading, setIsLoading] = useState(false);

  const [sendEmail, setSendEmail] = useState(false);

  const [email, setEmail] = useState('');

  const handleClick = (event) => {
    setIsLoading(true);

    axios.post(`${import.meta.env.VITE_MICRO_SECURTY}/auth/forgot-password`, {
      email: event.email,
    })
      .then((response) => {

        console.log(response.data);
        setEmail(event.email);
        setSendEmail(true);
        setIsLoading(false);

      })
      .catch((error) => {
        console.log(error);
        setSendEmail(true);
        setEmail(event.email);
        setIsLoading(false);
      });
  };

  const renderForm = (
    <>
      <Stack spacing={3} sx={{ mb: 5 }}>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          }}
          render={({ field }) => (
            <TextField
              fullWidth
              label="Email address"
              {...field}
              error={Boolean(errors.email)}
              helperText={errors.email ? errors.email.message : ''}
            />
          )}
        />

      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleSubmit(handleClick)}
        loading={isLoading}
      >
        Send Email
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_2.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          {
            sendEmail ? (
              <>
                <Typography variant="h4">Check your email</Typography>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Iconify icon="ic:outline-email" width={80} height={80} />
                </Box>
                <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>We have sent an email to <strong>
                  {email}
                </strong>. Click the link in the email to reset your password.</Typography>
              </>
            ) : (
              <>
                <Typography variant="h4">Forgot your password?</Typography>

                <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
                  Already have an account?
                  <Link variant="subtitle2" sx={{ ml: 0.5 }} underline="hover" onClick={() => router.push('/login')}>
                    Sign in
                  </Link>
                </Typography>

                <Divider sx={{ my: 3 }} />

                {renderForm}
              </>
            )
          }
        </Card>
      </Stack>
    </Box>

  );
}
