import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import "./AdminPage.css";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [tasksByStatus, setTasksByStatus] = useState([]);
    const [tasksByCategory, setTasksByCategory] = useState([]);
    const [filesPerTask, setFilesPerTask] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10; 

    const token = localStorage.getItem("auth_token");

    useEffect(() => {
        const fetchOptions = {
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        fetch("http://localhost:8000/api/users", fetchOptions)
            .then(res => res.json())
            .then(data => setUsers(data));

        fetch("http://localhost:8000/api/admin/stats/tasks-by-status", fetchOptions)
            .then(res => res.json())
            .then(data => setTasksByStatus(data));

        fetch("http://localhost:8000/api/admin/stats/tasks-by-category", fetchOptions)
            .then(res => res.json())
            .then(data => setTasksByCategory(data));

        fetch("http://localhost:8000/api/admin/stats/files-per-task", fetchOptions)
            .then(res => res.json())
            .then(data => setFilesPerTask(data));
    }, [token]);

    const handleRoleChange = (id, role) => {
        fetch(`http://localhost:8000/api/users/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ role }),
        }).then(() => {
            setUsers(users.map(user => (user.id === id ? { ...user, role } : user)));
        });
    };

    const colors = ["#0088FE", "#00C49F", "#FFBB28"];

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(users.length / usersPerPage);

    return (
        <div className="admin-container">
            <h2 className="admin-title">Admin Panel</h2>

            {/* Korisnici */}
            <div className="admin-card">
                <h3 className="admin-title">Korisnici</h3>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Ime</th>
                            <th>Email</th>
                            <th>Uloga</th>
                            <th>Akcija</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="manager">Manager</option>
                                        <option value="member">Member</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Navigacija za paginaciju */}
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button 
                            key={index} 
                            onClick={() => setCurrentPage(index + 1)} 
                            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Statistika */}
            <h3 className="admin-title">Statistika</h3>
            <div className="admin-stats">
                
                {/* Zadaci po statusu */}
                <div className="admin-stat-card">
                    <h4 className="admin-stat-title">Zadaci po statusu</h4>
                    <PieChart width={300} height={300}>
                        <Pie data={tasksByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                            {tasksByStatus.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>

                {/* Zadaci po kategorijama */}
                <div className="admin-stat-card">
                    <h4 className="admin-stat-title">Zadaci po kategorijama</h4>
                    <BarChart width={300} height={300} data={tasksByCategory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="tasks_count" fill="#82ca9d" />
                    </BarChart>
                </div>

                {/* Fajlovi po zadacima */}
                <div className="admin-stat-card">
                    <h4 className="admin-stat-title">Fajlovi po zadacima</h4>
                    <BarChart width={300} height={300} data={filesPerTask}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="title" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="files_count" fill="#FF8042" />
                    </BarChart>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
