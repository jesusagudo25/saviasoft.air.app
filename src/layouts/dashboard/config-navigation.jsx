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
    role: ['ADMINISTRADOR', 'CLIENTE'],
  },
  {
    title: 'Lecturas',
    path: '/dashboard/reading',
    icon: icon('ic_blog'),
    role: ['ADMINISTRADOR', 'CLIENTE'],
  },
  {
    title: 'Usuarios',
    path: '/dashboard/user',
    icon: icon('ic_user'),
    role: ['ADMINISTRADOR'],
  },
  {
    title: 'Configuración',
    path: '/dashboard/settings',
    icon: icon('ic_lock'),
    role: ['ADMINISTRADOR'],
  }
];

export default navConfig;
