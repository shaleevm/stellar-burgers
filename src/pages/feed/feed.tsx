import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import { selectFeedOrders, getFeeds } from '@services/slices/feed-slice';
import { useSelector, useDispatch } from '@services/store';

import type { TOrder } from '@utils-types';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedOrders);

  const handleGetFeeds = (): void => {
    dispatch(getFeeds());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
