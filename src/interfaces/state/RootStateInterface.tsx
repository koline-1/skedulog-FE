import { VerificationStateInterface } from "./VerificationStateInterface";
import { AuthTokenStateInterface } from "./AuthTokenStateInterface";

export interface RootStateInterface {
    authToken: AuthTokenStateInterface;
    verification: VerificationStateInterface;
}