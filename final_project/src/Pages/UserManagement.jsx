import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';
import FormError from '../components/FormError.jsx';
import useApi from '../hooks/useApi.js';

function UserManagement() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'sales_agent',
    branch: 'Maganjo',
  });
  const [formErrors, setFormErrors] = useState([]);
  const { data, loading, error, fetchData } = useApi('http://localhost:5000/api/users');

  useEffect(() => {
    if (data) setUsers(data);
  }, [data]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = [];
    if (!formData.username) errors.push('Username is required');
    if (!formData.password || formData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    if (!formData.role) errors.push('Role is required');
    if (!formData.branch) errors.push('Branch is required');
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/users', formData);
      setFormData({ username: '', password: '', role: 'sales_agent', branch: 'Maganjo' });
      setFormErrors([]);
      fetchData();
    } catch (err) {
      setFormErrors([err.response?.data?.message || 'User creation failed']);
    }
  }

  async function handleDelete(userId) {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      fetchData();
    } catch (err) {
      setFormErrors([err.response?.data?.message || 'User deletion failed']);
    }
  }

  if (user?.role !== 'ceo') {
    return <p className="card-subtext">Access denied. Only CEOs can manage users.</p>;
  }

  return (
    <div>
      <div className="form-container">
        <h2>User Management</h2>
        <FormError errors={formErrors} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Role:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="sales_agent">Sales Agent</option>
              <option value="manager">Manager</option>
              <option value="ceo">CEO</option>
            </select>
          </div>
          <div className="form-group">
            <label>Branch:</label>
            <select name="branch" value={formData.branch} onChange={handleChange}>
              <option value="Maganjo">Maganjo</option>
              <option value="Matugga">Matugga</option>
            </select>
          </div>
          <button type="submit" className="form-button">
            Add User
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Existing Users</h3>
        {loading && <p className="card-subtext">Loading users...</p>}
        {error && <p className="card-subtext">{error}</p>}
        {users.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Branch</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(function(user) {
                return (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>{user.branch}</td>
                    <td>
                      <button className="form-button" onClick={() => handleDelete(user.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="card-subtext">No users found.</p>
        )}
      </div>
    </div>
  );
}

export default UserManagement;