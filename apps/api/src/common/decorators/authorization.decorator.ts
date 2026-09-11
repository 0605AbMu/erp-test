import { Roles } from '@erp-test/shared';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'authorization';

export const Authorization = (...roles: Roles[]) =>
  SetMetadata(ROLES_KEY, roles);