import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { loginUser, selectUserError } from '@services/slices/user-slice';
import { useDispatch, useSelector } from '@services/store';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const error = useSelector(selectUserError);
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Ошибка входа:', err);
    }
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
