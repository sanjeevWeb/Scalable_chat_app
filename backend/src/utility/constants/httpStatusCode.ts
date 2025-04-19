export interface IHttpStatusCode {
    OK: number;
    CREATED: number;
    ACCEPTED: number;
    NO_CONTENT: number;
    MOVE_PERMANENT: number;
    FOUND: number;
    SEE_OTHER: number;
    NOT_MODIFIED: number;
    TEMP_REDIRECT: number;
    BAD_REQUEST: number;
    UNAUTHORIZED: number;
    FORBIDDEN: number;
    NOT_FOUND: number;
    METHOD_NOT_ALLOW: number;
    NOT_ACCEPTABLE: number;
    PRECONDITION_FAIL: number;
    UNSUPPORT_MEDIA_TYPE: number;
    UNPROCESSABLE_ENTITY: number;
    INTERNAL_SERVER: number;
    NOT_IMPLEMENT: number;
}

const HTTP_STATUS_CODE: IHttpStatusCode = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    MOVE_PERMANENT: 301,
    FOUND: 302,
    SEE_OTHER: 303,
    NOT_MODIFIED: 304,
    TEMP_REDIRECT: 307,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOW: 405,
    NOT_ACCEPTABLE: 406,
    PRECONDITION_FAIL: 412,
    UNSUPPORT_MEDIA_TYPE: 415,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER: 500,
    NOT_IMPLEMENT: 501
};

export default HTTP_STATUS_CODE;
