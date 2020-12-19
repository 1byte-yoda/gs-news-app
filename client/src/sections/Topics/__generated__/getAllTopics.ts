/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllTopics
// ====================================================

export interface getAllTopics_topics_created_by {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface getAllTopics_topics_updated_by {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface getAllTopics_topics_messages_created_by {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface getAllTopics_topics_messages_updated_by {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface getAllTopics_topics_messages {
  __typename: "Message";
  id: string;
  message: string;
  created_by: getAllTopics_topics_messages_created_by;
  updated_by: getAllTopics_topics_messages_updated_by;
}

export interface getAllTopics_topics {
  __typename: "Topic";
  id: string;
  subject: string | null;
  created_by: getAllTopics_topics_created_by;
  updated_by: getAllTopics_topics_updated_by;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  messages: (getAllTopics_topics_messages | null)[] | null;
}

export interface getAllTopics {
  topics: (getAllTopics_topics | null)[] | null;
}

export interface getAllTopicsVariables {
  token: string;
}
