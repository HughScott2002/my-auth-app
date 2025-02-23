// src/types/auth.ts
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  address: string;
  city: string;
  country: string;
  currency: string;
  state: string;
  postalCode: string;
  dob: string;
  govId: string;
  dataAuthorization: boolean;
}

export interface RegisterResponse {
  session: {
    browser: string;
    deviceInfo: string;
    id: string;
    ipAddress: string;
  };
  user: {
    email: string;
    firstName: string;
    id: string;
    kycStatus: string;
    lastName: string;
  };
}

export interface User {
  email: string;
  firstName: string;
  id: string;
  kycStatus: string;
  lastName: string;
}

export interface Session {
  browser: string;
  deviceInfo: string;
  id: string;
  ipAddress: string;
}
