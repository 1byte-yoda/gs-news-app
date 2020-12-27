/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUser
// ====================================================

export interface getUser_user {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
  email: string;
  created_at: string;
  updated_at: string;
  total_topics: number;
  total_messages: number;
}

export interface getUser {
  user: getUser_user | null;
}

export interface getUserVariables {
  token: string;
  id: string;
}
