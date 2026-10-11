import { Preloader, OrderInfoUI } from '@ui';
import { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { selectFeedOrders, selectProfileOrders } from '@services/slices/feed-slice';
import { selectIngredients } from '@services/slices/ingredients-slice';
import { selectCurrentOrder, getOrderByNumber } from '@services/slices/order-slice';
import { useSelector, useDispatch } from '@services/store';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);

  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);
  const currentOrder = useSelector(selectCurrentOrder);

  const orderData =
    feedOrders.find((o) => o.number === orderNumber) ??
    profileOrders.find((o) => o.number === orderNumber) ??
    (currentOrder?.number === orderNumber ? currentOrder : null);

  const ingredients: TIngredient[] = useSelector(selectIngredients);

  useEffect(() => {
    if (!orderData && orderNumber) {
      dispatch(getOrderByNumber(orderNumber));
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

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
