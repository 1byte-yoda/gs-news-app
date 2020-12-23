/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createTopic
// ====================================================

export interface createTopic_topic_create_created_by {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface createTopic_topic_create_updated_by {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface createTopic_topic_create_messages_created_by {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface createTopic_topic_create_messages_updated_by {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface createTopic_topic_create_messages {
  __typename: "Message";
  id: string;
  message: string;
  created_by: createTopic_topic_create_messages_created_by;
  updated_by: createTopic_topic_create_messages_updated_by;
}

export interface createTopic_topic_create {
  __typename: "Topic";
  id: string;
  subject: string | null;
  created_by: createTopic_topic_create_created_by;
  updated_by: createTopic_topic_create_updated_by;
  created_at: string;
  updated_at: string;
  messages: (createTopic_topic_create_messages | null)[] | null;
}

export interface createTopic {
  topic_create: createTopic_topic_create | null;
}

export interface createTopicVariables {
  token: string;
  subject: string;
  description: string;
}
