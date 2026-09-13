// query-client.ts
import {
    MutationCache,
    QueryCache,
    QueryClient,
} from '@tanstack/react-query';
import { notification } from 'antd';

const handleError = (error: Error) => {
    notification.error({
        title: 'Error',
        description: error.message || 'Something went wrong',
        placement: 'topRight',
    });
};

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: handleError,
    }),

    mutationCache: new MutationCache({
        onError: handleError,
    }),
});