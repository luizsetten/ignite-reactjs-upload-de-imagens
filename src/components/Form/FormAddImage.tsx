import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm, RegisterOptions } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

interface ValidationProps {
  image: RegisterOptions;
  title: RegisterOptions;
  description: RegisterOptions;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations: ValidationProps = {
    image: {
      required: true,
      validate: {
        maxSize: file => {
          return file[0].size < 10485760;
        },
        format: file => file[0].type.includes('image/'),
      },
    },
    title: {
      required: true,
      minLength: 3,
      maxLength: 40,
    },
    description: {
      required: true,
      maxLength: 200,
    },
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (data: Record<string, unknown>) => {
      return api.post('/images', {
        url: imageUrl,
        title: data.title,
        description: data.description,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: 'Upload de imagem não sucedido',
          status: 'error',
        });
      }
      await mutation.mutate(data);

      toast({
        title: 'Imagem salva!',
        status: 'success',
      });
    } catch {
      toast({
        title: 'Erro ao salvar imagem!',
        status: 'error',
      });
    } finally {
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register('image', { ...formValidations.image })}
          error={errors.image}
        />

        <TextInput
          placeholder="Título da imagem..."
          {...register('title', { ...formValidations.title })}
          error={errors.title}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          {...register('description', { ...formValidations.description })}
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
