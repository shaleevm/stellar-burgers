import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import {
  selectFeedOrders,
  getFeeds,
  selectFeedIsLoading,
} from '@services/slices/feed-slice';
import { useSelector, useDispatch } from '@services/store';

import type { TOrder } from '@utils-types';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedIsLoading);

  useEffect(() => {
    void dispatch(getFeeds());
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    void dispatch(getFeeds());
  };

  if (isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
