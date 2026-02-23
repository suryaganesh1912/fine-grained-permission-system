import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../auth/AuthContext";

const EmployeeList = () => {
    const { hasPermission } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [formData, setFormData] = useState({
        user: "",
        name: "",
        position: "",
        salary: "",
        email: "",
        username: "",
        password: ""
    });

    const fetchEmployees = async (p) => {
        try {
            setLoading(true);
            const response = await API.get(`/employees/?page=${p}`);
            setEmployees(response.data.results);
            setTotalPages(Math.ceil(response.data.count / 5));
        } catch (error) {
            console.error("Failed to fetch employees:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await API.get("/users/");
            setUsers(response.data.results || response.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    useEffect(() => {
        fetchEmployees(page);
        fetchUsers();
    }, [page]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await API.delete(`/employees/${id}/`);
                fetchEmployees(page);
            } catch (error) {
                alert("Deletion failed: " + (error.response?.data?.detail || "Unknown error"));
            }
        }
    };

    const handleOpenModal = (employee = null) => {
        if (employee) {
            setIsEditing(true);
            setSelectedEmployee(employee);
            setFormData({
                user: employee.user,
                name: employee.name,
                position: employee.position,
                salary: employee.salary
            });
        } else {
            setIsEditing(false);
            setSelectedEmployee(null);
            setFormData({
                user: "",
                name: "",
                position: "",
                salary: "",
                email: "",
                username: "",
                password: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = { ...formData };
            
            if (!isEditing && !dataToSend.user) {
                delete dataToSend.user;
            }

            if (isEditing) {
                await API.put(`/employees/${selectedEmployee.id}/`, dataToSend);
            } else {
                await API.post("/employees/", dataToSend);
            }
            setIsModalOpen(false);
            alert(isEditing ? "Employee updated" : "Employee registered successfully");
            fetchEmployees(page);
        } catch (error) {
            alert("Operation failed: " + JSON.stringify(error.response?.data || "Unknown error"));
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--text-main)', margin: '0' }}>Employees</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Manage your workforce and their roles</p>
                </div>
                {hasPermission("CREATE_EMPLOYEE") && (
                    <button onClick={() => handleOpenModal()} className="btn btn-primary">
                        <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Employee
                    </button>
                )}
            </div>

            <div className="card">
                {loading ? (
                    <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <div className="spinner" style={{ borderTopColor: 'var(--primary)', borderLeftColor: 'var(--primary)', margin: '0 auto 1rem' }}></div>
                        Loading employee data...
                    </div>
                ) : (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-main)' }}>
                                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Position</th>
                                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Salary</th>
                                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((emp) => (
                                        <tr key={emp.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(248, 250, 252, 0.5)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{emp.name}</div>
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{emp.position}</td>
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <span style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: '600' }}>
                                                    ${parseInt(emp.salary).toLocaleString()}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                    {hasPermission("EDIT_EMPLOYEE") && (
                                                        <button onClick={() => handleOpenModal(emp)} className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                                                            Edit
                                                        </button>
                                                    )}
                                                    {hasPermission("DELETE_EMPLOYEE") && (
                                                        <button onClick={() => handleDelete(emp.id)} className="btn btn-danger" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {employees.length === 0 && (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No employees found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', borderTop: '1px solid var(--border)' }}>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`btn ${page === p ? 'btn-primary' : 'btn-outline'}`}
                                    style={{ minWidth: '2.5rem', padding: '0.5rem' }}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
                    <div className="card animate-fade-in" style={{ maxWidth: '480px', width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>{isEditing ? "Edit Employee" : "Add New Employee"}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {!isEditing && (
                                <>
                                    <div style={{ padding: '0.75rem', backgroundColor: 'rgba(79, 70, 229, 0.05)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px dashed var(--primary)' }}>
                                        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 1: Account Credentials</p>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Username</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. jdoe"
                                            className="input-field"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="e.g. john@example.com"
                                            className="input-field"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Initial Password</label>
                                        <input
                                            required
                                            type="password"
                                            placeholder="••••••••"
                                            className="input-field"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '1.5rem 0' }}></div>
                                    <div style={{ padding: '0.75rem', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px dashed var(--border)' }}>
                                        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 2: Employee Profile</p>
                                    </div>
                                </>
                            )}
                            <div className="input-group">
                                <label className="input-label">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    className="input-field"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Position</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Senior Software Engineer"
                                    className="input-field"
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Annual Salary ($)</label>
                                <input
                                    required
                                    type="number"
                                    placeholder="e.g. 85000"
                                    className="input-field"
                                    value={formData.salary}
                                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    {isEditing ? "Save Changes" : "Register Employee"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
