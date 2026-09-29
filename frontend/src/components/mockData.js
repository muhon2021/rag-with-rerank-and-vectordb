// In-memory mock data and async-like helpers for Roles and Members
// This simulates a backend API for list/create/edit flows.

let mockRoles = [
  {
    id: 'r1',
    name: 'Admin',
    type: 'system',
    permissions: ['manage_users', 'view_reports', 'manage_roles']
  },
  {
    id: 'r2',
    name: 'Editor',
    type: 'user',
    permissions: ['edit_content', 'publish_content']
  },
  {
    id: 'r3',
    name: 'Viewer',
    type: 'user',
    permissions: ['view_content']
  }
];

let mockMembers = [
  {
    id: 'm1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    roles: ['r1']
  },
  {
    id: 'm2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    roles: ['r2', 'r3']
  },
  {
    id: 'm3',
    name: 'Carol Jones',
    email: 'carol@example.com',
    roles: []
  }
];

const delay = (ms = 200) => new Promise((res) => setTimeout(res, ms));

// Roles API
export async function getRoles() {
  await delay();
  return JSON.parse(JSON.stringify(mockRoles));
}

export async function getRoleById(id) {
  await delay();
  return JSON.parse(JSON.stringify(mockRoles.find((r) => r.id === id) || null));
}

export async function createRole({ name, type, permissions }) {
  await delay();
  const id = `r${Date.now()}`;
  const role = { id, name, type, permissions: Array.isArray(permissions) ? permissions : [] };
  mockRoles.push(role);
  return JSON.parse(JSON.stringify(role));
}

export async function updateRole(id, { name, type, permissions }) {
  await delay();
  const idx = mockRoles.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  mockRoles[idx] = {
    ...mockRoles[idx],
    ...(name !== undefined ? { name } : {}),
    ...(type !== undefined ? { type } : {}),
    ...(permissions !== undefined ? { permissions: Array.isArray(permissions) ? permissions : [] } : {})
  };
  return JSON.parse(JSON.stringify(mockRoles[idx]));
}

export async function deleteRole(id) {
  await delay();
  const before = mockRoles.length;
  mockRoles = mockRoles.filter((r) => r.id !== id);
  // Also remove role references from members
  mockMembers = mockMembers.map((m) => ({ ...m, roles: m.roles.filter((rid) => rid !== id) }));
  return before !== mockRoles.length;
}

// Members API
export async function getMembers() {
  await delay();
  return JSON.parse(JSON.stringify(mockMembers));
}

export async function getMemberById(id) {
  await delay();
  return JSON.parse(JSON.stringify(mockMembers.find((m) => m.id === id) || null));
}

export async function createMember({ name, email, password, roles }) {
  await delay();
  const id = `m${Date.now()}`;
  const member = { id, name, email, roles: Array.isArray(roles) ? roles : [] };
  mockMembers.push(member);
  // password would be handled securely server-side; we're not storing it here.
  return JSON.parse(JSON.stringify(member));
}

export async function updateMember(id, { name, email, password, roles }) {
  await delay();
  const idx = mockMembers.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  mockMembers[idx] = {
    ...mockMembers[idx],
    ...(name !== undefined ? { name } : {}),
    ...(email !== undefined ? { email } : {}),
    ...(roles !== undefined ? { roles: Array.isArray(roles) ? roles : [] } : {})
  };
  // password would be processed server-side; ignored here on update if provided
  return JSON.parse(JSON.stringify(mockMembers[idx]));
}

export async function deleteMember(id) {
  await delay();
  const before = mockMembers.length;
  mockMembers = mockMembers.filter((m) => m.id !== id);
  return before !== mockMembers.length;
}

// Helpers
export async function getRoleNameMap() {
  const roles = await getRoles();
  const map = {};
  roles.forEach((r) => (map[r.id] = r.name));
  return map;
}

export async function getCounts() {
  await delay();
  return { roles: mockRoles.length, members: mockMembers.length };
}
