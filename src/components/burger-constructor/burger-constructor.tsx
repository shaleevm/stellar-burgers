import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  selectConstructor,
  removeIngredientAll,
} from '@services/slices/constructor-slice';
import { clearOrderModal, createOrder } from '@services/slices/order-slice';
import { selectUser } from '@services/slices/user-slice';
import { useDispatch, useSelector } from '@services/store';

import type { TConstructorIngredient, TConstructorState, TOrder } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const constructorItems: TConstructorState = useSelector(selectConstructor);

  const orderRequest = useSelector((state) => state.order.orderRequest);
  const orderModalData: TOrder | null = useSelector(
    (state) => state.order.orderModalData
  );
  const user = useSelector(selectUser);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const ids: string[] = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];

    dispatch(createOrder(ids))
      .unwrap()
      .then(() => {
        dispatch(removeIngredientAll());
      })
      .catch((error) => {
        console.error('Ошибка оформления заказа:', error);
      });
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
