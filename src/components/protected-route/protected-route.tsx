import { Preloader } from '@ui';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { selectIsAuthChecked, selectUser } from '@services/slices/user-slice';

type TLocationState = {
  from?: {
    pathname: string;
  };
};

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
}: TProtectedRouteProps): React.ReactNode => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();
  const locationState = location.state as TLocationState | null;

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = locationState?.from?.pathname ?? '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
