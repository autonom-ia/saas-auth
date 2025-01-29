const mockUsers = [
  {
    id: '8d43c7e9-2e9d-4abc-b57b-ebca03ccb1a4',
    name: 'Admin',
    email: 'admin@autonomia.site',
    password: '$2a$10$YourHashedPasswordHere', // @ut0n0m1@
    access_type: 'A',
    created_at: '2025-01-27T14:23:31.000Z',
    last_access: '2025-01-27T14:23:31.000Z'
  },
  {
    id: '9f43c7e9-2e9d-4abc-b57b-ebca03ccb1a5',
    name: 'Test User',
    email: 'test@example.com',
    password: '$2a$10$YourHashedPasswordHere', // test123
    access_type: 'U',
    created_at: '2025-01-27T14:23:31.000Z',
    last_access: '2025-01-27T14:23:31.000Z'
  }
];

module.exports = {
  mockUsers
};
