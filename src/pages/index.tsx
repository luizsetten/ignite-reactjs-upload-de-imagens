import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface Image {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface FetchImagesPageResponse {
  after: string;
  data: Image[];
}

export default function Home(): JSX.Element {
  const loadImages = async ({
    pageParam = 0,
  }): Promise<FetchImagesPageResponse> => {
    const response = await api.get<FetchImagesPageResponse>(`/api/images`, {
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
    getNextPageParam: page => page.after,
  });

  const formattedData = useMemo(() => {
    if (!data) return [];
    const allData = data.pages.map(page => page.data);

    return allData.flat();
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
            disabled={isFetchingNextPage}
          >
            Load more images
          </Button>
        )}
      </Box>
    </>
  );
}
