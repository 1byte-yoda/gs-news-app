/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTopic
// ====================================================

export interface getTopic_topic_created_by {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface getTopic_topic_updated_by {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface getTopic_topic_messages_created_by {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface getTopic_topic_messages_updated_by {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface getTopic_topic_messages {
  __typename: "Message";
  id: string;
  message: string;
  created_by: getTopic_topic_messages_created_by;
  updated_by: getTopic_topic_messages_updated_by;
}

export interface getTopic_topic {
  __typename: "Topic";
  id: string;
  subject: string | null;
  description: string | null;
  created_by: getTopic_topic_created_by;
  updated_by: getTopic_topic_updated_by;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  messages: (getTopic_topic_messages | null)[] | null;
}

export interface getTopic {
  topic: getTopic_topic | null;
}

export interface getTopicVariables {
  topic_id: string;
  token: string;
}
