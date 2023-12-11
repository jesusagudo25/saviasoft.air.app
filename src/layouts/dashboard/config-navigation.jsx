import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Panel',
    path: '/dashboard',
    icon: icon('ic_analytics'),
    role: ['ADMINISTRADOR', 'USUARIO'],
  },
  {
    title: 'Usuarios',
    path: '/dashboard/user',
    icon: icon('ic_user'),
    role: ['ADMINISTRADOR'],
  },
];

export default navConfig;
