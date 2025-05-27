"use client";

import { useMutation } from "@apollo/client";
import { REGISTER_MUTATION } from "@/lib/graphql/mutations/register";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
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
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    repeatPassword: z.string(),
}).refine((data) => data.password === data.repeatPassword, {
    message: "Las contraseñas no coinciden",
    path: ["repeatPassword"],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
    const router = useRouter();
    const [registerUser, { loading, error }] = useMutation(REGISTER_MUTATION);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        try {
            const { email, password } = data;
            await registerUser({ variables: { email, password } });
            router.push("/login");
        } catch (err) {
            console.error("Error registrando:", err);
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
                        <div>
                            <Input
                                {...register("repeatPassword")}
                                type="password"
                                placeholder="Repite tu contraseña"
                                className="w-full p-2 border rounded"
                            />
                            {errors.repeatPassword && (
                                <p className="text-red-500">{errors.repeatPassword.message}</p>
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
                                {loading ? "Registrando..." : "Registrar"}
                            </Button>
                            {error && <p className="text-red-500">Error: {error.message}</p>}
                        </div>
                        <div>
                            o <a href="/login" className="text-blue-500 hover:underline">
                                Inicia sesión aquí
                            </a>
                        </div>
                    </CardFooter>
                </Card>
            </form>
            {/* <h1 className="text-2xl font-bold mb-4">Registrarse</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    placeholder="Password"
                    className="w-full p-2 border rounded"
                />
                {errors.password && (
                    <p className="text-red-500">{errors.password.message}</p>
                )}
                <input
                    {...register("repeatPassword")}
                    type="password"
                    placeholder="Repite tu contraseña"
                    className="w-full p-2 border rounded"
                />
                {errors.repeatPassword && (
                    <p className="text-red-500">{errors.repeatPassword.message}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                    {loading ? "Registrando..." : "Registrar"}
                </button>

                {error && <p className="text-red-500">Error: {error.message}</p>}
            </form> */}
        </div>
    );
}
