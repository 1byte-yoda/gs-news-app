import { UserData } from "../Users"

export interface MessageData {
    id: string
    message: string
    created_by: UserData
    updated_by: UserData
    created_at: string
    updated_at: string
}
