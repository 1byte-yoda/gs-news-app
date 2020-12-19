import { UserData } from "../Users";
import { MessageData } from "../Messages";

export interface Topic { 
    id: string;
    subject: string;
    created_by: UserData;
    updated_by: UserData;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    messages: MessageData[];
}

export interface TopicData {
    topics: Topic[];
}

export interface TopicDataVariables {
    token: string;
}


export interface DeleteTopicData {
    topic_delete: Boolean;
}

export interface DeleteTopicDataVariables {
    topic_id: string;
    token: string;
}