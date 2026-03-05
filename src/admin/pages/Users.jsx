import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import "./Products.css";
const API = process.env.REACT_APP_API_URL;
export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetch(API + "/users", { headers: { Authorization: "Bearer " + token } })
      .then((r) => r.json()).then((d) => setUsers(Array.isArray(d) ? d : d.users || []))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div>
      <h1 className="admin-page-title">Users</h1>
      {loading ? <p>Loading...</p> : users.length === 0 ? <p className="empty-msg">No users found.</p> : (
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td><td>{u.email}</td>
                <td><span className={"badge " + (u.isAdmin ? "green" : "yellow")}>{u.isAdmin ? "Admin" : "Customer"}</span></td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
