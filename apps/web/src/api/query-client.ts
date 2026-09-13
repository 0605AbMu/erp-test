// query-client.ts
import {
    MutationCache,
    QueryCache,
    QueryClient,
} from '@tanstack/react-query';
import { notification } from 'antd';

const handleError = (error: Error) => {
    notification.error({
        title: 'Xatolik',
        description: error.message || 'Kutilmagan xatolik yuz berdi',
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