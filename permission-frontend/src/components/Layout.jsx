import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Layout = ({ children }) => {
    const { logout, hasPermission, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navItems = [
        {
            path: "/employees", label: "Employees", permission: "VIEW_EMPLOYEE", icon: (
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        {
            path: "/profile", label: "My Profile", permission: "VIEW_SELF", icon: (
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            path: "/permissions", label: "Permissions", permission: "ASSIGN_PERMISSION", icon: (
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )
        },
    ];

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* Sidebar */}
            <div style={{
                width: '280px',
                backgroundColor: '#1e293b',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
                zIndex: 50
            }}>
                <div style={{
                    padding: '2rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div style={{ width: '2rem', height: '2rem', background: 'var(--primary)', borderRadius: '0.5rem' }}></div>
                    <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>ShieldCore</span>
                </div>

                <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map((item) => (
                        hasPermission(item.permission) && (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    textDecoration: 'none',
                                    color: location.pathname === item.path ? 'white' : 'rgba(255,255,255,0.6)',
                                    backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    transition: 'all 0.2s',
                                    fontWeight: location.pathname === item.path ? '600' : '400'
                                }}
                                onMouseEnter={(e) => { if (location.pathname !== item.path) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)' }}
                                onMouseLeave={(e) => { if (location.pathname !== item.path) e.currentTarget.style.backgroundColor = 'transparent' }}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        )
                    ))}
                </nav>

                <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Logged in as</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'white', marginTop: '0.25rem', wordBreak: 'break-all' }}>
                            {user?.email || "User Account"}
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn btn-danger"
                        style={{ width: '100%', border: 'none' }}
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <main style={{ flex: 1, position: 'relative', overflowY: 'auto', backgroundColor: 'var(--bg-main)' }}>
                <header style={{
                    height: '64px',
                    backgroundColor: 'white',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 2rem',
                    justifyContent: 'flex-end',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '700' }}>{user?.username}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Portal User</div>
                        </div>
                        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <div style={{ padding: '2rem' }}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
