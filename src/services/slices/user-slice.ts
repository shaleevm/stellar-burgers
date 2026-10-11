import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  logoutApi,
  updateUserApi,
  type TLoginData,
  type TRegisterData,
} from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { setCookie, deleteCookie } from '@utils/cookie';

import type { TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  isSuccessRegistration: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  isSuccessRegistration: false,
  isLoading: false,
  error: null,
};

export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (data) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (data) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const getUser = createAsyncThunk<TUser, void>('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/updateUser',
  async (data) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk<void, void>('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccessRegistration = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.isSuccessRegistration = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccessRegistration = false;
        state.error = action.error.message ?? 'Ошибка регистрации';
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка входа';
      })

      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.error = null;
      })

      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка обновления профиля';
      })

      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.isSuccessRegistration = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка выхода';
      });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectUserName: (state) => state.user?.name ?? undefined,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectIsSuccessRegistration: (state) => state.isSuccessRegistration,
    selectUserIsLoading: (state) => state.isLoading,
    selectUserError: (state) => state.error,
  },
});

export const { authChecked, clearError } = userSlice.actions;

export const {
  selectUser,
  selectUserName,
  selectIsAuthChecked,
  selectIsAuthenticated,
  selectIsSuccessRegistration,
  selectUserIsLoading,
  selectUserError,
} = userSlice.selectors;

export default userSlice.reducer;
