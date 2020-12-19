import React from "react";
import { gql } from "apollo-boost";
import {
    TopicData,
    DeleteTopicData,
    DeleteTopicDataVariables
} from "../Topics";
import {
    useQuery,
    useMutation
} from "react-apollo";
import { TopicDataVariables } from "./types";

const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDgzOTA1NDUsIm5iZiI6MTYwODM5MDU0NSwianRpIjoiNGUxNmUyZDItOGJlOS00MGI5LWJlYTYtZjc4Njg0MDU0MDk3IiwiZXhwIjoxNjEwOTgyNTQ1LCJpZGVudGl0eSI6ImVlOTg4MjU3LTM5ODAtNDc5ZS1iZGU0LWQyNDY1MjRmNDJhYSIsImZyZXNoIjp0cnVlLCJ0eXBlIjoiYWNjZXNzIn0.FIzhKiELC36aaQLSGKsxr9KjyYQVLSHTsJkvWhujfz0`;
const TOPICS = gql`
    query getAllTopics($token: String!) {
            topics(token: $token) {
                id
                subject
                created_by { id name email created_at updated_at }
                updated_by { id name email created_at updated_at }
                created_at
                updated_at
                deleted_at
                messages { 
                    id
                    message
                    created_by { id name email created_at updated_at }
                    updated_by { id name email created_at updated_at }
            }
        }
    }
`;

const DELETE_TOPIC = gql`
    mutation deleteTopic($token: String!, $topic_id: ID!) {
        topic_delete(token: $token, id: $topic_id)
    }
`


interface Props {
    title: string;
}


export const Topics = ({ title }: Props) => {
    const { data, loading, error, refetch } = useQuery<
        TopicData, TopicDataVariables
    >(TOPICS, { variables: { token } });
    const [
        deleteTopic,
        {
            loading: deleteTopicLoading,
            error: deleteTopicError
        }
    ] = useMutation<
        DeleteTopicData,
        DeleteTopicDataVariables
    >(DELETE_TOPIC);

    const handleDeleteTopic = async (topic_id: string) => {
        await deleteTopic( { variables: { topic_id, token } });
        refetch();
    };
    const topics = data ? data.topics : null;
    const topicList = topics && topics[0]
        ? <ul>{topics.map((topic) => {
                return <li key={topic.id}>
                    {topic.subject}
                    <button onClick={() => handleDeleteTopic(topic.id)}
                    >
                        Delete
                    </button>
                </li>
            })}</ul>
        : null;
    if (loading) {
        return <h2>Loading...</h2>
    }
    if (error) {
        return (
        <h2>
            Uh oh! Something went wrong - please try again 
            later 
            :(
        </h2>
        );
    }

    const deleteTopicLoadingMessage = deleteTopicLoading
    ? (
        <h4>Deletion in progress...</h4>
    ) : null;

    const deleteTopicErrorMessage = deleteTopicError
    ? (
        <h4>
            Uh oh! Something went wrong - please try again 
            later 
            :(
        </h4>
    ) : null;

    return <div>
        <h2>{title}</h2>
        {topicList}
        {deleteTopicLoadingMessage}
        {deleteTopicErrorMessage}
    </div>
};
