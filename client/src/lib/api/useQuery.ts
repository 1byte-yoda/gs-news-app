import { useReducer, useEffect, useCallback } from "react";
import { server } from "./server";

interface State<TData> {
    data: TData | null;
    loading: boolean;
    error: boolean;
}

type Action<TData> = 
| { type: "FETCH" }
| { type: "FETCH_SUCCESS", payload: TData }
| { type: "FETCH_ERROR" } 

interface QueryResults<TData, TVariables> extends State<TData> {
    refetch: () => void;
}

const reducer = <TData>() => (
    state: State<TData>, 
    action: Action<TData>
): State<TData> => {
    switch (action.type) {
        case "FETCH":
            return { ...state, loading: true }
        case "FETCH_SUCCESS":
            return {
                data: action.payload,
                loading: false,
                error: false
            }
        case "FETCH_ERROR":
            return {
                ...state,
                loading: false,
                error: true
            }
        default:
            throw new Error();
    }
};

export const useQuery = <TData = any, TVariables = any>(
        query: string
    ): QueryResults<TData, TVariables> => {
        const fetchReducer = reducer<TData>();
        const [state, dispatch] = useReducer(fetchReducer, {
            data: null,
            loading: false,
            error: false
        });

        const fetch = useCallback((variables?: TVariables) => {
            const fetchGql = async (variables?: TVariables) => {
                try {
                    dispatch({ type: "FETCH" });
                    const { data, errors } = await server.fetch<TData>({
                        query, variables
                    });

                    if (errors && errors.length) {
                        throw new Error(errors[0].message);
                    }
                    dispatch({ type: "FETCH_SUCCESS", payload: data});
                } catch(err) {
                    dispatch({ type: "FETCH_ERROR" });
                    throw console.error(err)
                }
            };
            fetchGql(variables);
        }, [query]);

        useEffect(() => {
            fetch();
        }, [fetch]);
        return {...state, refetch: fetch};
};
