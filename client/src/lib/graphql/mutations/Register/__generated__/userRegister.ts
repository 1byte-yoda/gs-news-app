/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: userRegister
// ====================================================

export interface userRegister_user_register {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface userRegister {
  user_register: userRegister_user_register | null;
}

export interface userRegisterVariables {
  email: string;
  name: string;
  password: string;
}
