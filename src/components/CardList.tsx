import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [urlImage, setUrlImage] = useState('');

  const hanldeViewImage = (image): void => {
    setUrlImage(image);
    onOpen();
  };

  return (
    <>
      <SimpleGrid columns={3} spacing={10}>
        {cards.map(image => (
          <Card
            data={image}
            key={image.id}
            viewImage={viewImage => hanldeViewImage(viewImage)}
          />
        ))}
      </SimpleGrid>
      <ModalViewImage isOpen={isOpen} onClose={onClose} imgUrl={urlImage} />
    </>
  );
}
