/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: userLogin
// ====================================================

export interface userLogin_user_login {
  __typename: "LogInResponse";
  token: string | null;
  id: string | null;
  avatar: string | null;
}

export interface userLogin {
  user_login: userLogin_user_login | null;
}

export interface userLoginVariables {
  email: string;
  password: string;
}
