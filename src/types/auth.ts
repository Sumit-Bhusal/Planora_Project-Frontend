export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles?: string[];
  username: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface DecodedToken {
  email: string;
  name: string;
  roles: string[];
  exp: number;
  iat: number;
  sub: string;
}
