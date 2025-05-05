import { Role } from './role';

export interface TokenPayload {
  userId: string;
  role: Role;
}
