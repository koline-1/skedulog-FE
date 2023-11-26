import { ApolloError } from "@apollo/client";
import { message } from "antd";
import { removeStoredMemberData } from "./UtilityHandlers.tsx";
import { GraphQLErrorInterface } from "../interfaces/error/GraphQLErrorInterface.tsx";

export const handleGraphQLError = (error: ApolloError) => {

  const gqlError = (error.graphQLErrors[0] as unknown) as GraphQLErrorInterface;
  const code = gqlError.extensions.http.code;
  const status = gqlError.extensions.http.status;
  // const message  = gqlError.extensions.http.message;

  if (['ACCESS_TOKEN_NOT_PROVIDED', 'INVALID_ACCESS_TOKEN', 'EXPIRED_ACCESS_TOKEN', 'UNAUTHORIZED_REFRESH_TOKEN'].includes(code)) {
    message.error('로그인이 만료되었습니다.');
    return removeStoredMemberData();
  }

  switch (status) {
    case 400: 
      if (code === "VALIDATION_FAILURE") {
          const validationResult = gqlError.extensions.http.validationResult;
          for (let err of validationResult ?? []) {
            message.error(err.error.message);
          }
      } else if (code === "MAX_DEPTH_EXCEEDED") {
        message.error('허용된 스케줄 생성 뎁스(5)를 초과하셨습니다.', 2);
      }
      break;
    case 401:
      message.error('스케줄, 로그 및 단위를 작성/수정하시려면 로그인하여 주세요.', 2);
      break;
    case 403:
      message.error('자신의 스케줄에만 스케줄, 로그 및 단위를 작성/수정하실 수 있습니다.', 2);
      break;
    case 404:
      if (code === "LOG_IN_FAILURE") {
        message.error('아이디 또는 비밀번호를 잘못 입력했습니다.', 2);
      }
  }
}