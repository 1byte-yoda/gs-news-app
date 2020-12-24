/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllTopics
// ====================================================

export interface getAllTopics_topics_data_created_by {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface getAllTopics_topics_data_updated_by {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface getAllTopics_topics_data_messages_created_by {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface getAllTopics_topics_data_messages_updated_by {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface getAllTopics_topics_data_messages {
  __typename: "Message";
  id: string;
  message: string;
  created_by: getAllTopics_topics_data_messages_created_by;
  updated_by: getAllTopics_topics_data_messages_updated_by;
  created_at: string;
  updated_at: string;
}

export interface getAllTopics_topics_data {
  __typename: "Topic";
  id: string;
  subject: string | null;
  description: string | null;
  created_by: getAllTopics_topics_data_created_by;
  updated_by: getAllTopics_topics_data_updated_by;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  messages_count: number | null;
  messages: (getAllTopics_topics_data_messages | null)[] | null;
}

export interface getAllTopics_topics {
  __typename: "TopicsResponse";
  data: (getAllTopics_topics_data | null)[] | null;
  next_num: number | null;
  has_next: boolean | null;
}

export interface getAllTopics {
  topics: getAllTopics_topics | null;
}

export interface getAllTopicsVariables {
  token: string;
  page: number;
}
