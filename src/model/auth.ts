
export class LoginRequest {
    username: string;
    password: string;
    verificationCode?: string;
}

export class LoginResponse {
    accountId: string;
    token: string;
    errorDetails?: string;
}


