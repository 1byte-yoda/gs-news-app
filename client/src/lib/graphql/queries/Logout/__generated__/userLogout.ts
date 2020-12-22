/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: userLogout
// ====================================================

export interface userLogout_user_logout {
  __typename: "LogOutMessage";
  message: string;
}

export interface userLogout {
  user_logout: userLogout_user_logout | null;
}

export interface userLogoutVariables {
  token?: string | null;
}
