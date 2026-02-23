import { useEffect, useState } from "react";
import API from "../api/axios";

const Profile = () => {
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await API.get("/employees/me/");
                setEmployee(response.data);
            } catch (err) {
                setError(err.response?.data?.detail || "Failed to load profile. Please ensure you have an employee record.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return (
        <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ borderTopColor: 'var(--primary)', borderLeftColor: 'var(--primary)', margin: '0 auto 1rem' }}></div>
            Retrieving profile information...
        </div>
    );

    if (error) return (
        <div style={{ padding: '2rem', backgroundColor: 'var(--danger-light)', borderRadius: 'var(--radius-lg)', border: '1px solid #fee2e2', color: 'var(--danger)', maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
            <svg style={{ width: '3rem', height: '3rem', marginBottom: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 style={{ margin: 0 }}>Access Denied</h3>
            <p style={{ marginTop: '0.5rem' }}>{error}</p>
        </div>
    );

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="card" style={{ boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ height: '160px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        bottom: '-50px',
                        left: '40px',
                        width: '120px',
                        height: '120px',
                        borderRadius: 'var(--radius-xl)',
                        backgroundColor: 'white',
                        padding: '6px',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        <div style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 'calc(var(--radius-xl) - 4px)',
                            backgroundColor: 'var(--primary-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            fontWeight: '900',
                            color: 'var(--primary)'
                        }}>
                            {employee.name?.charAt(0)}
                        </div>
                    </div>
                </div>

                <div style={{ padding: '70px 40px 40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>{employee.name}</h1>
                            <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: '500' }}>{employee.position}</p>
                        </div>
                        <div style={{ padding: '0.5rem 1rem', borderRadius: '2rem', backgroundColor: 'var(--success-light)', color: 'var(--success)', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Verified Employee
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '3rem' }}>
                        <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Role</span>
                            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.5rem' }}>{employee.position}</div>
                        </div>
                        <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Annual Earning</span>
                            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.5rem' }}>${parseInt(employee.salary).toLocaleString()}</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '2.5rem', padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(rgba(79, 70, 229, 0.05), rgba(79, 70, 229, 0.02))', border: '1px dashed var(--primary)' }}>
                        <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>Organization Information</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.75rem', lineHeight: 1.6 }}>
                            This information is managed by the HR department. If you notice any biological or administrative errors, please contact the support team. Your access permissions are synchronized with your active directory credentials.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
