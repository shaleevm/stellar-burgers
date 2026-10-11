import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { logoutUser } from '@services/slices/user-slice';
import { useDispatch } from '@services/store';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = (): void => {
    dispatch(logoutUser());
    navigate('/login', { replace: true });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
