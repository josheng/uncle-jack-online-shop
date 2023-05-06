import "./useractivity.css"
import Table from 'react-bootstrap/Table';
import React, { useState, useEffect } from 'react';

const UserActivity = () => {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    async function fetchActivity() {
      const response = await fetch('http://127.0.0.1:5000/user_activity');
      const data = await response.json();
      setActivity(data);
    }
    fetchActivity();
  }, []);

  return (
    <div>
      <h1>User Activity</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Activity Type</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {activity.map((act) => (
            <tr key={act.id}>
              <td>{act.id}</td>
              <td>
                {act.activity_type}
              </td>
              <td>
                {act.timestamp}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default UserActivity;
