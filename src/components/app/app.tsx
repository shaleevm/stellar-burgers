import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute,
} from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import {
  fetchIngredients,
  selectIngredients,
  selectIsIngredientsLoading,
  selectIngredientsError,
} from '@services/slices/ingredients-slice';
import { useDispatch, useSelector } from '@services/store';

import type { AppContentProps } from './type';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIsIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;

const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  const navigate = useNavigate();

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <>
      <Routes>
        {/* Публичные страницы */}
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />

        {/* Страницы только для неавторизованных */}
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* Страницы только для авторизованных */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* Модальные окна */}
        <Route
          path="/feed/:number"
          element={
            <Modal title="Детали заказа" onClose={handleModalClose}>
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path="/ingredients/:id"
          element={
            <Modal title="Информация об ингредиенте" onClose={handleModalClose}>
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <Modal title="Детали заказа" onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </>
  );
};
