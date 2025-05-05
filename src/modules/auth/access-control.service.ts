import { Injectable } from '@nestjs/common';
import { Role } from './types/role';

interface IsAuthorizedParams {
  currentRole: Role;
  requiredRole: Role;
}

@Injectable()
export class AccessControlService {
  private hierarchy: Map<Role, number> = new Map([
    ['USER', 1],
    ['ADMIN', 2],
  ]);

  public isAuthorized({ currentRole, requiredRole }: IsAuthorizedParams) {
    const priority = this.hierarchy.get(currentRole);
    const requiredPriority = this.hierarchy.get(requiredRole);

    if (priority && requiredPriority && priority >= requiredPriority) {
      return true;
    }

    return false;
  }
}
