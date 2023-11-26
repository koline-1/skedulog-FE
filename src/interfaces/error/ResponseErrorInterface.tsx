import { GraphQLErrorInterface } from "./GraphQLErrorInterface";

export interface ResponseErrorInterface {
    graphQLErrors: [GraphQLErrorInterface];
    networkError: any;
    forward: Function;
    operation: any;
}