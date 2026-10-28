// ============================================================
//  UsersPage – user table with search, filters, pagination
// ============================================================
import { useState, useMemo } from 'react';
import { PAGE_SIZE } from '../data/mockData';
import ChangeRoleModal from './ChangeRoleModal';
import { IconSearch, IconUsers, IconUserPlus, IconX } from './Icons';

/* ── helpers ── */
function roleBadgeClass(role) {
  return { Admin: 'badge-admin', Manager: 'badge-manager', Viewer: 'badge-viewer' }[role] ?? 'badge-viewer';
}
function statusDotClass(status) {
  return { Active: 'status-active', Pending: 'status-pending', Suspended: 'status-suspended' }[status] ?? '';
}
function statusBadgeClass(status) {
  return { Active: 'status-badge-active', Pending: 'status-badge-pending', Suspended: 'status-badge-suspended' }[status] ?? '';
}

export default function UsersPage({ users, onInvite, onRoleChange, onToast }) {
  const [search, setSearch]             = useState('');
  const [roleFilter, setRoleFilter]     = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage]                 = useState(1);
  const [roleModal, setRoleModal]       = useState(null);

  const hasActiveFilters = search || roleFilter || statusFilter;

  function clearFilters() {
    setSearch('');
    setRoleFilter('');
    setStatusFilter('');
    setPage(1);
  }

  /* ── filtered + paginated ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return users.filter(u => {
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      if (roleFilter   && u.role   !== roleFilter)   return false;
      if (statusFilter && u.status !== statusFilter) return false;
      return true;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageUsers  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleSearch(e) { setSearch(e.target.value); setPage(1); }
  function handleRoleFilter(e) { setRoleFilter(e.target.value); setPage(1); }
  function handleStatusFilter(e) { setStatusFilter(e.target.value); setPage(1); }

  function handleConfirmRole(userId, newRole) {
    onRoleChange(userId, newRole);
  }

  return (
    <>
      <div className="main-content" id="main-content">
        <header className="page-header">
          <div>
            <h1 className="page-title">Users</h1>
            <p className="page-subtitle">Manage team members and their application access.</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={onInvite}
            id="users-invite-btn"
            aria-label="Invite a new user"
          >
            <IconUserPlus size={15} />
            Invite user
          </button>
        </header>

        <div className="page-body">
          {/* Toolbar */}
          <div className="toolbar" role="search" aria-label="Filter users">
            <div className="search-wrap">
              <span className="search-icon" aria-hidden="true"><IconSearch size={15} /></span>
              <input
                id="user-search"
                className="search-input"
                type="search"
                placeholder="Search by name or email"
                value={search}
                onChange={handleSearch}
                aria-label="Search users by name or email"
              />
            </div>

            <label htmlFor="role-filter" className="sr-only">Filter by role</label>
            <select
              id="role-filter"
              className="filter-select"
              value={roleFilter}
              onChange={handleRoleFilter}
            >
              <option value="">All roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Viewer">Viewer</option>
            </select>

            <label htmlFor="status-filter" className="sr-only">Filter by status</label>
            <select
              id="status-filter"
              className="filter-select"
              value={statusFilter}
              onChange={handleStatusFilter}
            >
              <option value="">All statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>

            {hasActiveFilters && (
              <button
                className="btn btn-ghost btn-sm clear-filters-btn"
                onClick={clearFilters}
                id="clear-filters-btn"
                aria-label="Clear all filters"
              >
                <IconX size={13} />
                Clear filters
              </button>
            )}

            <span className="count-badge" aria-live="polite" aria-atomic="true">
              {filtered.length} user{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Table */}
          <div className="table-wrap">
            {filtered.length === 0 ? (
              <div className="empty-state" role="status" aria-live="polite">
                <IconUsers size={40} />
                <div className="empty-state-title">No users found</div>
                <div className="empty-state-sub">
                  {hasActiveFilters
                    ? 'No users match your current search or filters.'
                    : 'No users yet. Invite someone to get started.'}
                </div>
                {hasActiveFilters ? (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={clearFilters}
                    style={{ marginTop: 12 }}
                    id="empty-clear-filters-btn"
                  >
                    Clear filters
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={onInvite}
                    style={{ marginTop: 12 }}
                    id="empty-invite-btn"
                  >
                    <IconUserPlus size={14} />
                    Invite user
                  </button>
                )}
              </div>
            ) : (
              <table aria-label="Users table">
                <thead>
                  <tr>
                    <th scope="col">User</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="col-last-activity">Last activity</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div
                            className="avatar-initials"
                            style={{ background: user.color }}
                            aria-hidden="true"
                          >
                            {user.initials}
                          </div>
                          <div>
                            <div className="user-primary">{user.name}</div>
                            <div className="user-secondary">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${roleBadgeClass(user.role)}`}>{user.role}</span>
                      </td>
                      <td>
                        <span className={`badge ${statusBadgeClass(user.status)}`}>
                          <span className={`status-dot ${statusDotClass(user.status)}`} aria-hidden="true" />
                          {user.status}
                        </span>
                      </td>
                      <td className="col-last-activity" style={{ color: 'var(--neutral-400)', fontSize: 13 }}>
                        {user.lastActivity}
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setRoleModal(user)}
                          disabled={user.status === 'Suspended'}
                          id={`change-role-${user.id}`}
                          aria-label={`Change role for ${user.name}`}
                          title={user.status === 'Suspended' ? 'Cannot change role of a suspended user' : 'Change role'}
                        >
                          Change role
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination */}
            <div className="pagination" role="navigation" aria-label="Table pagination">
              <span className="pagination-info">
                {filtered.length === 0
                  ? '0 users'
                  : `Showing ${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} of ${filtered.length} user${filtered.length !== 1 ? 's' : ''}`
                }
              </span>
              <div className="pagination-btns">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  id="pagination-prev"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  id="pagination-next"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role change modal */}
      {roleModal && (
        <ChangeRoleModal
          user={roleModal}
          onClose={() => setRoleModal(null)}
          onConfirm={handleConfirmRole}
        />
      )}
    </>
  );
}
