import axios from 'axios';
import { useState, useEffect  } from 'react';
import { useForm, Controller  } from "react-hook-form";
import { toast, ToastContainer } from 'react-toastify';

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

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const {control, handleSubmit, formState: { errors } } = useForm();

  const handleClick = (event) => {
    setIsLoading(true);

    axios.post(`${import.meta.env.VITE_MICRO_SECURTY}/auth/login`, {
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
        notifyInvalidPassword();
        setIsLoading(false);
      });
  };

  const notifyResetPassword = () => toast("Reset password successfully", {
    type: 'success',
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
  });

  const notifyInvalidPassword = () => toast("Email or password is invalid", {
    type: 'error',
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
  });

  useEffect(() => {
    if(localStorage.getItem('resetPassword')) {
      notifyResetPassword();
      localStorage.removeItem('resetPassword');
    }
  }, []);

  const renderForm = (
    <>
      <Stack spacing={3}>

        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: 'Please enter your email address',
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              autoComplete="username"
              type="email"
              label="Email address"
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
            required: 'Please enter your password',
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              error={Boolean(errors.password)}
              helperText={errors.password ? errors.password.message : ''}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

        />
        
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover" onClick={() => router.push('/forgot-password') }>
          Forgot password?
        </Link>
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
        Login
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
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
          <Typography variant="h4">Sign in to AirQualityApp</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don’t have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }} underline="hover" onClick={() => router.push('/register') }>
              Get started
            </Link>
          </Typography>

          <Divider sx={{ my: 3 }} />

          {renderForm}
        </Card>
      </Stack>

      <ToastContainer />
    </Box>
  );
}
