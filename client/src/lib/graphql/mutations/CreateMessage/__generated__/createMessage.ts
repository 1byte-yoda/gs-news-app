/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createMessage
// ====================================================

export interface createMessage_message_create_created_by {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface createMessage_message_create_updated_by {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface createMessage_message_create {
  __typename: "Message";
  id: string;
  message: string;
  created_by: createMessage_message_create_created_by;
  updated_by: createMessage_message_create_updated_by;
  created_at: string;
  updated_at: string;
}

export interface createMessage {
  message_create: createMessage_message_create | null;
}

export interface createMessageVariables {
  token: string;
  topic_id: string;
  message: string;
}
