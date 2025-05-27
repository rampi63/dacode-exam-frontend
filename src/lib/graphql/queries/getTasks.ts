import { gql } from '@apollo/client';

export const GET_TASKS = gql`
    query GetTasks($page: Int, $limit: Int) {
        getTasks(page: $page, limit: $limit) {
            tasks {
                id
                title
                description
                status
                createdAt
            }
            total
        }
}`;
