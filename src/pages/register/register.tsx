import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

import { registerUser, selectUserError, clearError } from '@services/slices/user-slice';
import { useDispatch, useSelector } from '@services/store';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const error = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    dispatch(clearError());

    void dispatch(registerUser({ name: userName, email, password }))
      .unwrap()
      .catch((err: unknown) => {
        console.error('Ошибка регистрации:', err);
      });
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
