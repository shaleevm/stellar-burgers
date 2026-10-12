import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { selectUser, updateUser } from '@services/slices/user-slice';
import { useSelector, useDispatch } from '@services/store';

export const Profile = (): React.JSX.Element => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name ?? '',
      email: user?.email ?? '',
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    if (!isFormChanged) return;

    const changedData: Partial<{ name?: string; email?: string; password?: string }> =
      {};

    if (formValue.name !== user?.name) {
      changedData.name = formValue.name;
    }
    if (formValue.email !== user?.email) {
      changedData.email = formValue.email;
    }
    if (formValue.password) {
      changedData.password = formValue.password;
    }

    if (!Object.keys(changedData).length) return;

    void dispatch(updateUser(changedData))
      .unwrap()
      .then(() => {
        setFormValue((currentValue) => ({
          ...currentValue,
          password: '',
        }));
      })
      .catch((error) => {
        console.error('Ошибка обновления профиля:', error);
      });
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
