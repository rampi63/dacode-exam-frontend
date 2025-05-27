'use client';

import { useForm } from 'react-hook-form';
import { UPDATE_TASK } from '@/lib/graphql/mutations/updateTask';
import { useMutation } from '@apollo/client';

interface EditTaskModalProps {
    task: {
        id: string;
        title: string;
        description: string;
        status: string;
    };
    onClose: () => void;
    refetch: () => void;
}

export default function EditTaskModal({ task, onClose, refetch }: EditTaskModalProps) {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            title: task.title,
            description: task.description,
            status: task.status,
        },
    });

    const [updateTask] = useMutation(UPDATE_TASK);

    const onSubmit = async (data: { title: string; description: string; status: string }) => {
        await updateTask({ variables: { id: task.id, input: data } });
        onClose();
        refetch();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Editar tarea</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input
                        {...register('title')}
                        placeholder="Título"
                        className="w-full border p-2 rounded"
                    />
                    <textarea
                        {...register('description')}
                        placeholder="Descripción"
                        className="w-full border p-2 rounded"
                    />
                    <select {...register('status')} className="w-full border p-2 rounded">
                        <option value="pending">Pendiente</option>
                        <option value="in_progress">En progreso</option>
                        <option value="completed">Completada</option>
                    </select>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
