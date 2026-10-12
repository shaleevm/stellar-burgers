import { Preloader, OrderInfoUI } from '@ui';
import { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { selectFeedOrders, selectProfileOrders } from '@services/slices/feed-slice';
import { selectIngredients } from '@services/slices/ingredients-slice';
import {
  selectCurrentOrder,
  selectCurrentOrderLoading,
  selectOrderError,
  getOrderByNumber,
} from '@services/slices/order-slice';
import { useSelector, useDispatch } from '@services/store';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);
  console.log('Параметр number:', number);
  console.log('Число заказа:', orderNumber);
  console.log('Текущий URL:', window.location.pathname);

  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);
  const currentOrder = useSelector(selectCurrentOrder);
  const isLoading = useSelector(selectCurrentOrderLoading);
  const error = useSelector(selectOrderError);

  const orderData =
    feedOrders.find((o) => o.number === orderNumber) ??
    profileOrders.find((o) => o.number === orderNumber) ??
    (currentOrder?.number === orderNumber ? currentOrder : null);

  const ingredients: TIngredient[] = useSelector(selectIngredients);

  useEffect(() => {
    if (!orderData && orderNumber) {
      void dispatch(getOrderByNumber(orderNumber));
    }
  }, [dispatch, orderData, orderNumber]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <p>Не удалось загрузить заказ.</p>;
  }

  if (!orderInfo) {
    return (
      <div>
        <p>Номер заказа: {number}</p>
        <p>Заказ найден: {String(Boolean(orderData))}</p>
        <p>Ингредиентов загружено: {ingredients.length}</p>
        <p>Загрузка заказа: {String(isLoading)}</p>
        <p>Ошибка: {error ?? 'нет'}</p>
      </div>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
