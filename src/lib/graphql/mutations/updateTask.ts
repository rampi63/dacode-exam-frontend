import { gql } from '@apollo/client';

export const UPDATE_TASK = gql`
    mutation UpdateTask($id: String!, $input: UpdateTaskInput!) {
        updateTask(id: $id, input: $input) {
            id
            title
            description
            status
            updatedAt
        }
}`;
