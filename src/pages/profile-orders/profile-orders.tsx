import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { getProfileOrders, selectProfileOrders } from '@services/slices/feed-slice';
import { useSelector, useDispatch } from '@services/store';

import type { TOrder } from '@utils-types';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectProfileOrders);

  useEffect(() => {
    void dispatch(getProfileOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
