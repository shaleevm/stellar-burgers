import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { registerUser, selectUserError } from '@services/slices/user-slice';
import { useDispatch, useSelector } from '@services/store';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector(selectUserError);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      await dispatch(registerUser({ name: userName, email, password })).unwrap();

      navigate('/', { replace: true });
    } catch (err) {
      console.error('Ошибка регистрации:', err);
    }
  };

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
