"use client";

import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "@/lib/graphql/mutations/login";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
    email: z.string().email(),
    password: z.string(),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
    const router = useRouter();
    const [loginUser, { loading }] = useMutation(LOGIN_MUTATION);
    const [formError, setFormError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        try {
            const response = await loginUser({ variables: data });
            const result = response.data.login;

            if (result.success) {
                window.location.href = "/tasks";
            } else {
                setFormError(result.message);
            }
        } catch (err) {
            setFormError("Error inesperado al iniciar sesión.");
            console.error(err);
        }
    };

    return (
        <div className="h-[100vh] w-[100vw] flex items-center justify-center">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Bienvenido</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div>
                            <Input
                                {...register("email")}
                                type="email"
                                placeholder="Email"
                                className="w-full p-2 border rounded"
                            />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        </div>
                        <div>
                            <Input
                                {...register("password")}
                                type="password"
                                placeholder="Contraseña"
                                className="w-full p-2 border rounded"
                            />
                            {errors.password && (
                                <p className="text-red-500">{errors.password.message}</p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-1">
                        <div className="w-full">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? "Ingresando..." : "Iniciar sesión"}
                            </Button>
                            {formError && <p className="text-red-500">{formError}</p>}
                        </div>
                        <div>
                            o <a href="/register" className="text-blue-500 hover:underline">
                                Regístrate aquí
                            </a>
                        </div>
                    </CardFooter>
                </Card>
            </form>

            {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                    {...register("email")}
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}

                <input
                    {...register("password")}
                    type="password"
                    placeholder="Contraseña"
                    className="w-full p-2 border rounded"
                />
                {errors.password && (
                    <p className="text-red-500">{errors.password.message}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                    {loading ? "Ingresando..." : "Iniciar sesión"}
                </button>

                {formError && <p className="text-red-500">{formError}</p>}
            </form> */}
        </div>
    );
}
