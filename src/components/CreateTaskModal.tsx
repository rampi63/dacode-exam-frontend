'use client';

import { useForm } from 'react-hook-form';
import { UPDATE_TASK } from '@/lib/graphql/mutations/updateTask';
import { useMutation } from '@apollo/client';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { CREATE_TASK } from '@/lib/graphql/mutations/createTask';

export default function CreateTaskModal({ onClose, refetch }: any) {

    const { register, handleSubmit, reset } = useForm();
    const [createTask] = useMutation(CREATE_TASK);

    const onSubmit = async (data: any) => {
        try {
            await createTask({ variables: { input: data } });
            onClose();
            refetch();
        } catch (err) {
            console.error('Error al crear tarea', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Editar tarea</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        type="text"
                        {...register('title', { required: true })}
                        placeholder="Título"
                        className="w-full border p-2 rounded"
                    />
                    <Textarea
                        {...register('description', { required: true })}
                        placeholder="Descripción"
                        className="w-full border p-2 rounded"
                    />
                    <Button
                        type="submit"
                        className="px-4 py-2"
                    >
                        Crear tarea
                    </Button>
                </form>
            </div>
        </div>
    );
}
