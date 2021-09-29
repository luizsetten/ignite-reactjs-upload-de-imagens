import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
import { ImagesQueryResponse } from './api/images';

export default function Home(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const loadImages = async ({ pageParam = 0 }) => {
    const response = await api.get<ImagesQueryResponse>(`images`, {
      params: {
        after: pageParam,
      },
    });

    return response.data;
  };
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', loadImages, {
    getNextPageParam: (page, pages) => page.after,
  });

  const formattedData = useMemo(() => {
    const array = [];
    if (!data) return array;

    data.pages.forEach(page => {
      page.data.forEach(image => {
        array.push({
          ...image.data,
          ts: image.ts,
        });
      });
    });
    return array;
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
          >
            Load more images
          </Button>
        )}
      </Box>
    </>
  );
}
