export {};
// import React from "react";
// import { gql } from "apollo-boost";
// import {
//     useQuery,
//     useMutation
// } from "react-apollo";
// import {
//     Alert,
//     Avatar,
//     Button,
//     List,
//     Spin
// } from "antd";
// import {
//     getAllTopics as TopicData,
//     getAllTopicsVariables as TopicDataVariables,
//     deleteTopic as DeleteTopicData,
//     deleteTopicVariables as DeleteTopicDataVariables
// } from "./__generated__";
// import { TopicsSkeleton } from "./components";
// import "./styles/Topics.css";

// const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDgzOTA1NDUsIm5iZiI6MTYwODM5MDU0NSwianRpIjoiNGUxNmUyZDItOGJlOS00MGI5LWJlYTYtZjc4Njg0MDU0MDk3IiwiZXhwIjoxNjEwOTgyNTQ1LCJpZGVudGl0eSI6ImVlOTg4MjU3LTM5ODAtNDc5ZS1iZGU0LWQyNDY1MjRmNDJhYSIsImZyZXNoIjp0cnVlLCJ0eXBlIjoiYWNjZXNzIn0.FIzhKiELC36aaQLSGKsxr9KjyYQVLSHTsJkvWhujfz0`;
// const TOPICS = gql`
//     query getAllTopics($token: String!) {
//             topics(token: $token) {
//                 id
//                 subject
//                 description
//                 created_by { id name email created_at updated_at }
//                 updated_by { id name email created_at updated_at }
//                 created_at
//                 updated_at
//                 deleted_at
//                 messages { 
//                     id
//                     message
//                     created_by { id name email created_at updated_at }
//                     updated_by { id name email created_at updated_at }
//             }
//         }
//     }
// `;

// const DELETE_TOPIC = gql`
//     mutation deleteTopic($token: String!, $topic_id: ID!) {
//         topic_delete(token: $token, id: $topic_id)
//     }
// `;


// interface Props {
//     title: string;
// }


// export const Topics = ({ title }: Props) => {
//     const { data, loading, error, refetch } = useQuery<
//         TopicData, TopicDataVariables
//     >(TOPICS, { variables: { token } });
//     const [
//         deleteTopic,
//         {
//             loading: deleteTopicLoading,
//             error: deleteTopicError
//         }
//     ] = useMutation<
//         DeleteTopicData,
//         DeleteTopicDataVariables
//     >(DELETE_TOPIC);

//     const handleDeleteTopic = async (topic_id: string) => {
//         await deleteTopic( { variables: { topic_id, token } });
//         refetch();
//     };
//     const topics = data ? data.topics : null;
//     console.log(topics);
//     const topicList = topics ? (
//             <List
//                 itemLayout="horizontal"
//                 dataSource={topics} 
//                 renderItem={(topic) => (
//                     <List.Item
//                         actions={[
//                             <Button
//                                 type="primary"
//                                 onClick={() =>
//                                     handleDeleteTopic(topic!.id)
//                                 }
//                             >
//                                 Delete
//                             </Button>]}>
//                         <List.Item.Meta
//                             title={topic?.subject}
//                             description={topic?.description}
//                             avatar={<Avatar
//                                         src="https://www.gravatar.com/avatar/"
//                                         shape="square"
//                                         size={48}
//                                     />}
//                             />
//                     </List.Item>
//                 )}
                
//             />
//         ) : null

//     if (loading) {
//         return <div className="topics">
//             <TopicsSkeleton title={title}/>
//         </div>;
//     }

//     if (error) {
//         return <div className="topics">
//             <TopicsSkeleton title={title} error/>
//         </div>;
//     }

//     const deleteTopicErrorAlert = deleteTopicError ? (
//         <Alert
//             type="error"
//             message="Uh oh! Something went wrong - please try again 
//             later 
//             :("
//             className="topics__alert"
//         />
//     ) : null;

//     return <div className="topics">
//         <Spin spinning={deleteTopicLoading}>
//             {deleteTopicErrorAlert}
//             <h2>{title}</h2>
//             {topicList}
//         </Spin>
//     </div>
// };
