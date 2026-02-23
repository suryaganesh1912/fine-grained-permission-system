import { useEffect, useState } from "react";
import API from "../api/axios";

const PermissionManager = () => {
    const [users, setUsers] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userPermissions, setUserPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, permsRes] = await Promise.all([
                API.get("/users/"),
                API.get("/permissions/")
            ]);
            setUsers(usersRes.data.results || usersRes.data);
            setPermissions(permsRes.data.results || permsRes.data);
        } catch (error) {
            console.error("Fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setUserPermissions(user.permissions || []);
    };

    const handleTogglePermission = (code) => {
        setUserPermissions((prev) =>
            prev.includes(code) ? prev.filter((p) => p !== code) : [...prev, code]
        );
    };

    const handleSave = async () => {
        if (!selectedUser) return;
        try {
            setSaving(true);
            await API.post("/assign-permissions/", {
                user_id: selectedUser.id,
                permissions: userPermissions,
            });
            alert("Permissions updated successfully");
            await fetchData();
            const updatedUser = users.find(u => u.id === selectedUser.id);
            if (updatedUser) handleUserSelect(updatedUser);
        } catch (error) {
            alert("Failed to update: " + (error.response?.data?.detail || "Error"));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ borderTopColor: 'var(--primary)', borderLeftColor: 'var(--primary)', margin: '0 auto 1rem' }}></div>
            Initializing Permission Manager...
        </div>
    );

    return (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
            {/* User List Pane */}
            <div className="card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
                <div style={{ borderBottom: '1px solid var(--border)', padding: '1.5rem', background: 'var(--bg-main)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Users</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Select a user to edit access</p>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                    {users.map((u) => (
                        <div
                            key={u.id}
                            onClick={() => handleUserSelect(u)}
                            style={{
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                marginBottom: '0.5rem',
                                transition: 'all 0.2s',
                                border: '1px solid transparent',
                                backgroundColor: selectedUser?.id === u.id ? 'var(--primary-light)' : 'transparent',
                                borderLeft: selectedUser?.id === u.id ? '4px solid var(--primary)' : '1px solid transparent'
                            }}
                            onMouseEnter={(e) => { if (selectedUser?.id !== u.id) e.currentTarget.style.backgroundColor = 'rgba(241, 245, 249, 1)' }}
                            onMouseLeave={(e) => { if (selectedUser?.id !== u.id) e.currentTarget.style.backgroundColor = 'transparent' }}
                        >
                            <div style={{ fontWeight: '600', color: selectedUser?.id === u.id ? 'var(--primary)' : 'var(--text-main)' }}>{u.username}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{u.email}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Permissions Pane */}
            <div className="card" style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
                <div style={{ borderBottom: '1px solid var(--border)', padding: '1.5rem', background: 'var(--bg-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Permissions</h2>
                        {selectedUser ? (
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                Explicitly assigned to <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{selectedUser.username}</span>
                            </p>
                        ) : (
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Select a user to see permissions</p>
                        )}
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                    {selectedUser ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {permissions.map((perm) => (
                                <label
                                    key={perm.id}
                                    style={{
                                        padding: '1.25rem',
                                        borderRadius: 'var(--radius-lg)',
                                        border: '1px solid var(--border)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        backgroundColor: userPermissions.includes(perm.code) ? 'var(--success-light)' : 'white',
                                        borderColor: userPermissions.includes(perm.code) ? 'var(--success)' : 'var(--border)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: '700', fontSize: '0.875rem' }}>{perm.name}</span>
                                        <input
                                            type="checkbox"
                                            checked={userPermissions.includes(perm.code)}
                                            onChange={() => handleTogglePermission(perm.code)}
                                            style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary)' }}
                                        />
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{perm.description}</p>
                                    <code style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '10px', backgroundColor: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.05em' }}>{perm.code}</code>
                                </label>
                            ))}
                        </div>
                    ) : (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                            <svg style={{ width: '4rem', height: '4rem', color: 'var(--border)', marginBottom: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <p style={{ fontWeight: '500' }}>No user selected</p>
                        </div>
                    )}
                </div>

                {selectedUser && (
                    <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', background: 'var(--bg-main)' }}>
                        <button
                            disabled={saving}
                            onClick={handleSave}
                            className="btn btn-primary"
                            style={{ minWidth: '200px', height: '3rem' }}
                        >
                            {saving ? <div className="spinner"></div> : "Save Changes"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PermissionManager;
