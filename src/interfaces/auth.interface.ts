export interface IAuthLogin {
    email: string;
    password: string;
  }
  
  export interface IAuthTokenPayload {
    id: string;
    email: string;
    role: string;
  }
  
  export interface IAuthChangePassword {
    oldPassword: string;
    newPassword: string;
  }