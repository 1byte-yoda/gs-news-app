/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getMessages
// ====================================================

export interface getMessages_messages_data_created_by {
  __typename: "User";
  id: string;
  avatar: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface getMessages_messages_data_updated_by {
  __typename: "User";
  id: string;
  avatar: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface getMessages_messages_data {
  __typename: "Message";
  id: string;
  message: string;
  created_by: getMessages_messages_data_created_by;
  updated_by: getMessages_messages_data_updated_by;
  created_at: string;
  updated_at: string;
}

export interface getMessages_messages {
  __typename: "MessagesResponse";
  has_next: boolean | null;
  next_num: number | null;
  data: (getMessages_messages_data | null)[] | null;
}

export interface getMessages {
  messages: getMessages_messages | null;
}

export interface getMessagesVariables {
  token: string;
  page: number;
  topic_id: string;
}
