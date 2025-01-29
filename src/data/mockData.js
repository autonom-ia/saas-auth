const bcrypt = require('bcryptjs');

// Mock data for testing
const mockedUsers = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Test User',
    email: 'test@example.com',
    password: '$2a$10$o9iV8nR2LtUIOTzHvU79luijxwAYkhLiGy4oAcoLwPXtsbHbY9Ww6', // test123
    access_type: 'U',
    created_at: '2025-01-27T14:23:31.000Z',
    last_access: '2025-01-27T14:23:31.000Z'
  },
  {
    id: '8d43c7e9-2e9d-4abc-b57b-ebca03ccb1a4',
    name: 'Admin',
    email: 'admin@autonomia.site',
    password: '$2a$10$YNBvgTKNUzNkQYgFwjAXTOhSYxQxdXzQpBvzHcNyNzKbBL5dOHKDu', // @ut0n0m1@
    access_type: 'A',
    created_at: '2025-01-27T14:23:31.000Z',
    last_access: '2025-01-27T14:23:31.000Z'
  }
];

module.exports = {
  mockedUsers
};
