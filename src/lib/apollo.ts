import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { fromPromise } from '@apollo/client/link/utils';

const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_BACKEND_URL!,
    credentials: "include",
});

const refreshTokenMutation = `
    mutation RefreshToken {
        refreshToken
    }
`;

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    const unauthenticated = graphQLErrors?.some(
        (err) => err.extensions?.code === 'UNAUTHENTICATED'
    );

    if (!unauthenticated) return;

    return fromPromise(
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL!, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: refreshTokenMutation,
            }),
        })
            .then(async (res) => {
                const result = await res.json();
                console.log('Resultado de refreshToken fetch:', result);
                return result?.data?.refreshToken ? true : false;
            })
            .catch((err) => {
                console.error('Error al hacer refresh:', err);
                return false;
            })
    )
        .filter(Boolean)
        .flatMap(() => forward(operation));
});

export const client = new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache(),
});
