import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

        await fetch(backendUrl!, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    mutation {
                        logout
                    }
                `,
            }),
        });
    } catch (error) {
        console.error('Error al hacer logout en el backend:', error);
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set('accessToken', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
    });

    response.cookies.set('refreshToken', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
    });

    return response;
}
