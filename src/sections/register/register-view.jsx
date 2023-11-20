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
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function RegisterView() {
  const theme = useTheme();

  const router = useRouter();

  const { control, handleSubmit, formState: { errors }, } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (event) => {
    setIsLoading(true);

    axios.post(`${import.meta.env.VITE_MICRO_SECURTY}/auth/register`, {
      firstName: event.firstName,
      lastName: event.lastName,
      email: event.email,
      password: event.password,
    })
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('id', response.data.id);

        console.log(response.data);
        setIsLoading(false);
        router.push('/dashboard');
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const renderForm = (
    <>
      <Stack spacing={3} sx={{ mb: 5 }}>

        <Controller
          name="firstName"
          control={control}
          defaultValue=""
          rules={{
            required: 'First name is required',
            minLength: {
              value: 2,
              message: 'First name should be at least 2 characters',
            },
          }}
          render={({ field }) => (
            <TextField
              fullWidth
              label="First name"
              {...field}
              error={Boolean(errors.firstName)}
              helperText={errors.firstName ? errors.firstName.message : ''}
            />
          )}
        />

        <Controller
          name="lastName"
          control={control}
          defaultValue=""
          rules={{
            required: 'Last name is required',
            minLength: {
              value: 2,
              message: 'Last name should be at least 2 characters',
            },
          }}
          render={({ field }) => (
            <TextField
              fullWidth
              label="Last name"
              {...field}
              error={Boolean(errors.lastName)}
              helperText={errors.lastName ? errors.lastName.message : ''}
            />
          )}
        />

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

        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password should be at least 6 characters',
            },
          }}
          render={({ field }) => ( 
            <TextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'ic:outline-visibility-off' : 'ic:outline-visibility'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
            {...field}
            error={Boolean(errors.password)}
            helperText={errors.password ? errors.password.message : ''}
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
        Register
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
          <Typography variant="h4">Get started absolutely free.</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Already have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }} underline="hover" onClick={() => router.push('/login')}>
              Sign in
            </Link>
          </Typography>

          <Divider sx={{ my: 3 }} />

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
