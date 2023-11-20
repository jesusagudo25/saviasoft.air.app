import axios from 'axios';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter, usePathname } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ResetPasswordView() {
  const theme = useTheme();

  const router = useRouter();
  
  const pathname = usePathname();

  const { control, handleSubmit, formState: { errors }, getValues } = useForm();

  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  /* const [isTokenValid, setIsTokenValid] = useState(false); */

  const handleClick = (event) => {
    setIsLoading(true);

    const token = pathname.split('/')[2];
    
    axios.patch(`${import.meta.env.VITE_MICRO_SECURTY}/auth/reset-password`, {
      token,
      password: event.password,
      passwordConfirm: event.passwordConfirm,
    })
      .then((response) => {
        console.log(response.data);
        setIsLoading(false);
        localStorage.setItem('resetPassword', true)
        router.push('/login');
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
    
  };

  const renderForm = (
    <Stack spacing={3} sx={{ mb: 5 }}>

      <Controller
        name="password"
        control={control}
        defaultValue=""
        rules={{
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password should be at least 6 characters',
          }
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

      <Controller
        name="passwordConfirm"
        control={control}
        defaultValue=""
        rules={{
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password should be at least 6 characters',
          },
          validate: (value) => value === getValues('password') || 'The passwords do not match',
        }}
        render={({ field }) => (
          <TextField
            name="passwordConfirm"
            label="Password Confirm"
            type={showPasswordConfirm ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPasswordConfirm((prev) => !prev)}>
                    <Iconify icon={showPasswordConfirm ? 'ic:outline-visibility-off' : 'ic:outline-visibility'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
            {...field}
            error={Boolean(errors.passwordConfirm)}
            helperText={errors.passwordConfirm ? errors.passwordConfirm.message : ''}
          />
        )}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleSubmit(handleClick)}
        loading={isLoading}
      >
        Reset Password
      </LoadingButton>
    </Stack>
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
          <Typography variant="h4">Reset Password</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            When finished, we will send you to log in again with your new password
          </Typography>

          <Divider sx={{ my: 3 }} />

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
