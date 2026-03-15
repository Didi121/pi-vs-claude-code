// Role-based access control configuration
export const PERMISSIONS = {
  EMPLOYEE: {
    // Admin can perform all operations
    CREATE: ['admin', 'hr'],
    READ: ['admin', 'hr', 'manager', 'employee'],
    UPDATE: ['admin', 'hr', 'manager'],
    DELETE: ['admin', 'hr'],
    SOFT_DELETE: ['admin', 'hr'],
    LIST_ALL: ['admin', 'hr', 'manager', 'employee'],
  },
  
  AUTH: {
    // Everyone can register and login
    REGISTER: ['admin', 'hr', 'manager', 'employee'],
    LOGIN: ['admin', 'hr', 'manager', 'employee'],
    REFRESH_TOKEN: ['admin', 'hr', 'manager', 'employee'],
    VIEW_PROFILE: ['admin', 'hr', 'manager', 'employee'],
    UPDATE_PROFILE: ['admin', 'hr', 'manager', 'employee'],
  },
  
  USER_MANAGEMENT: {
    // Only admins can manage users
    CREATE: ['admin'],
    READ: ['admin'],
    UPDATE: ['admin'],
    DELETE: ['admin'],
    LIST_USERS: ['admin'],
  },
};

export function hasPermission(role: string, permission: string | string[]): boolean {
  const permissions = Array.isArray(permission) ? permission : [permission];
  return permissions.includes(role);
}

export function getRoleHierarchy(role: string): string[] {
  const hierarchy = {
    admin: ['admin'],
    hr: ['admin', 'hr'],
    manager: ['admin', 'hr', 'manager'],
    employee: ['admin', 'hr', 'manager', 'employee'],
  };
  
  return hierarchy[role as keyof typeof hierarchy] || [];
}