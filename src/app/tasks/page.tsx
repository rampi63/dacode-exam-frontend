"use client";

import { useAuth } from "@/context/AuthContext";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { GET_TASKS } from "@/lib/graphql/queries/getTasks";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useMutation } from '@apollo/client';
import EditTaskModal from "@/components/EditTaskModal";
import { DELETE_TASK } from '@/lib/graphql/mutations/deleteTask';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CreateTaskModal from "@/components/CreateTaskModal";
import { Badge } from "@/components/ui/badge";

export default function TasksPage() {
    const { user, loading } = useProtectedRoute();
    const { logout } = useAuth();
    const [page, setPage] = useState(1);
    const [editingTask, setEditingTask] = useState<{
        id: string;
        title: string;
        description: string;
        status: "pending" | "in_progress" | "completed";
    } | null>(null);
    const [creatingTask, setCreatingTask] = useState(false);
    const [deleteTask] = useMutation(DELETE_TASK);

    const { data, loading: taskLoading, refetch } = useQuery(GET_TASKS, {
        variables: { page, limit: 5 },
    });

    if (loading && taskLoading) {
        return <p className="text-center mt-10">Cargando...</p>;
    }

    const status = {
        pending: "Pendiente",
        in_progress: "En progreso",
        completed: "Completada",
    }

    return (
        <div>
            <div className="flex justify-between items-center bg-gray-100 p-4 pb-0 shadow-md">
                <h2 className="text-2xl font-bold mb-4">Bienvenido, {user?.email}</h2>
                <Button onClick={logout} variant="destructive" className="mb-4">
                    Cerrar sesión
                </Button>
            </div>
            <div className="max-w-xl mx-auto mt-8 px-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Mis Tareas</h1>
                    <Button
                        onClick={() => setCreatingTask(true)}
                    >
                        Crear nueva tarea
                    </Button>
                </div>
                <ul className="space-y-4">
                    {data?.getTasks?.tasks?.map((task: { id: string; title: string; description: string; status: keyof typeof status }) => (
                        <Card key={task.id}>
                            <CardContent className="p-4">
                                <div className="font-semibold text-lg">{task.title}</div>
                                <div className="text-gray-600">{task.description}</div>
                                <div className="mt-2 text-sm text-blue-600 mb-5">
                                    Estado: <Badge 
                                        className={
                                            task.status === "completed" 
                                                ? "bg-green-500 text-white" 
                                                : task.status === "pending" 
                                                ? "bg-gray-500 text-white" 
                                                : "bg-yellow-500 text-white"
                                        }
                                    >
                                        {status[task.status]}
                                    </Badge>
                                </div>
                                <div className="mt-2 flex gap-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingTask(task)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={async () => {
                                            const confirmDelete = confirm("¿Estás seguro?");
                                            if (!confirmDelete) return;
                                            await deleteTask({ variables: { id: task.id } });
                                            refetch();
                                        }}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </ul>

                <div className="flex justify-between items-center my-6">
                    <Button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="px-4 py-2 rounded disabled:opacity-50"
                        disabled={page === 1}
                    >
                        Anterior
                    </Button>
                    <span className="text-sm text-muted-foreground font-bold">Página {page}</span>
                    <Button
                        onClick={() => {
                            const total = data.getTasks.total;
                            const maxPage = Math.ceil(total / 5);
                            setPage((p) => (p < maxPage ? p + 1 : p));
                        }}
                        className="px-4 py-2 rounded disabled:opacity-50"
                        disabled={data?.getTasks?.tasks?.length < 5}
                    >
                        Siguiente
                    </Button>
                </div>

                {creatingTask && (
                    <CreateTaskModal
                        task={creatingTask}
                        onClose={() => setCreatingTask(false)}
                        refetch={refetch}
                    />
                )}
                {editingTask && (
                    <EditTaskModal
                        task={editingTask}
                        onClose={() => setEditingTask(null)}
                        refetch={refetch}
                    />
                )}

            </div>
        </div>
    )
}
