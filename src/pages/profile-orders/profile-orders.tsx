import { ProfileOrdersUI } from '@ui-pages';

import { selectProfileOrders } from '@services/slices/feed-slice';
import { useSelector } from '@services/store';

import type { TOrder } from '@utils-types';

export const ProfileOrders = (): React.JSX.Element => {
  const orders: TOrder[] = useSelector(selectProfileOrders);

  return <ProfileOrdersUI orders={orders} />;
};
