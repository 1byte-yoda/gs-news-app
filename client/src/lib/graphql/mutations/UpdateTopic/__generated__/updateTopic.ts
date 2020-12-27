/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateTopic
// ====================================================

export interface updateTopic_topic_update_created_by {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface updateTopic_topic_update_updated_by {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface updateTopic_topic_update_messages_created_by {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface updateTopic_topic_update_messages_updated_by {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface updateTopic_topic_update_messages {
  __typename: "Message";
  id: string;
  message: string;
  created_by: updateTopic_topic_update_messages_created_by;
  updated_by: updateTopic_topic_update_messages_updated_by;
}

export interface updateTopic_topic_update {
  __typename: "Topic";
  id: string;
  subject: string | null;
  description: string | null;
  created_by: updateTopic_topic_update_created_by;
  updated_by: updateTopic_topic_update_updated_by;
  created_at: string;
  updated_at: string;
  messages: (updateTopic_topic_update_messages | null)[] | null;
}

export interface updateTopic {
  topic_update: updateTopic_topic_update | null;
}

export interface updateTopicVariables {
  token: string;
  topic_id: string;
  subject: string;
  description: string;
}
