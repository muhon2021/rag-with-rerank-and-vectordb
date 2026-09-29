import { config } from '../config.js';

/**
 * Fetches aggregated operational statistics for the admin dashboard.
 * Uses mock/derived data suitable for MVP and local development.
 *
 * @returns {Promise<{members:number,roles:number,totalVectors:number,backendStatus:'ok'|'warning'|'error',lastIngestAt?:string}>}
 */
export async function getAdminStats() {
  // Derive a basic backendStatus indicator from environment
  const hasOpenAI = Boolean(config?.openaiApiKey || process.env.OPENAI_API_KEY);
  const hasPinecone = Boolean(config?.pineconeApiKey || process.env.PINECONE_API_KEY);

  let backendStatus = 'ok';
  if (!hasOpenAI || !hasPinecone) backendStatus = 'warning';
  if (process.env.MOCK_BACKEND_ERROR === 'true') backendStatus = 'error';

  // Provide stable mock numbers for MVP
  const members = 1234;
  const roles = 12;
  const totalVectors = Number(process.env.MOCK_TOTAL_VECTORS || 56789);
  const lastIngestAt = new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(); // 5h ago

  return { members, roles, totalVectors, backendStatus, lastIngestAt };
}

/**
 * Returns up to `limit` recent admin activity events (mock data for MVP).
 *
 * @param {number} limit
 * @returns {Promise<Array<{id:string,type:string,actor:string,message:string,timestamp:string,details?:object}>>}
 */
export async function getRecentActivity(limit = 20) {
  const now = Date.now();
  const events = [
    { id: 'evt_001', type: 'member.create', actor: 'admin@example.com', message: 'Created new member John Doe', timestamp: new Date(now - 1000 * 60 * 50).toISOString(), details: { memberId: 'm_john' } },
    { id: 'evt_002', type: 'role.update', actor: 'admin@example.com', message: 'Updated permissions for Role: Editor', timestamp: new Date(now - 1000 * 60 * 80).toISOString(), details: { roleId: 'r_editor' } },
    { id: 'evt_003', type: 'ingest.start', actor: 'system', message: 'Started document ingestion process', timestamp: new Date(now - 1000 * 60 * 120).toISOString() },
    { id: 'evt_004', type: 'member.delete', actor: 'admin@example.com', message: 'Deleted member Jane Smith', timestamp: new Date(now - 1000 * 60 * 180).toISOString(), details: { memberId: 'm_jane' } },
    { id: 'evt_005', type: 'backend.health_check', actor: 'system', message: 'Backend health check passed', timestamp: new Date(now - 1000 * 60 * 240).toISOString() },
    { id: 'evt_006', type: 'member.login', actor: 'user1@example.com', message: 'User logged in', timestamp: new Date(now - 1000 * 60 * 300).toISOString() },
    { id: 'evt_007', type: 'role.create', actor: 'admin@example.com', message: 'Created new Role: Viewer', timestamp: new Date(now - 1000 * 60 * 360).toISOString(), details: { roleId: 'r_viewer' } },
    { id: 'evt_008', type: 'ingest.complete', actor: 'system', message: 'Document ingestion completed successfully', timestamp: new Date(now - 1000 * 60 * 420).toISOString() },
    { id: 'evt_009', type: 'member.update', actor: 'admin@example.com', message: 'Updated member profile for Alice', timestamp: new Date(now - 1000 * 60 * 480).toISOString(), details: { memberId: 'm_alice' } },
    { id: 'evt_010', type: 'backend.error', actor: 'system', message: 'Database connection lost', timestamp: new Date(now - 1000 * 60 * 540).toISOString(), details: { error: 'DB_CONN_FAIL' } },
    { id: 'evt_011', type: 'member.create', actor: 'admin@example.com', message: 'Created new member Bob', timestamp: new Date(now - 1000 * 60 * 600).toISOString(), details: { memberId: 'm_bob' } },
    { id: 'evt_012', type: 'role.delete', actor: 'admin@example.com', message: 'Deleted Role: Guest', timestamp: new Date(now - 1000 * 60 * 660).toISOString(), details: { roleId: 'r_guest' } },
    { id: 'evt_013', type: 'ingest.fail', actor: 'system', message: 'Document ingestion failed due to Pinecone error', timestamp: new Date(now - 1000 * 60 * 720).toISOString(), details: { error: 'PINECONE_UPSERT_FAIL' } },
    { id: 'evt_014', type: 'member.login', actor: 'user2@example.com', message: 'User logged in', timestamp: new Date(now - 1000 * 60 * 780).toISOString() },
    { id: 'evt_015', type: 'backend.health_check', actor: 'system', message: 'Backend health check passed', timestamp: new Date(now - 1000 * 60 * 840).toISOString() },
    { id: 'evt_016', type: 'member.create', actor: 'admin@example.com', message: 'Created new member Charlie', timestamp: new Date(now - 1000 * 60 * 900).toISOString(), details: { memberId: 'm_charlie' } },
    { id: 'evt_017', type: 'role.update', actor: 'admin@example.com', message: 'Updated permissions for Role: Admin', timestamp: new Date(now - 1000 * 60 * 960).toISOString(), details: { roleId: 'r_admin' } },
    { id: 'evt_018', type: 'ingest.start', actor: 'system', message: 'Started document ingestion process', timestamp: new Date(now - 1000 * 60 * 1020).toISOString() },
    { id: 'evt_019', type: 'member.delete', actor: 'admin@example.com', message: 'Deleted member David', timestamp: new Date(now - 1000 * 60 * 1080).toISOString(), details: { memberId: 'm_david' } },
    { id: 'evt_020', type: 'backend.health_check', actor: 'system', message: 'Backend health check passed', timestamp: new Date(now - 1000 * 60 * 1140).toISOString() }
  ];

  // Newest first
  const sorted = events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return sorted.slice(0, Math.max(1, Math.min(100, limit)));
}
