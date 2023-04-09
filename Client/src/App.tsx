import React, { useEffect, useState } from 'react';

type User = {
  first_name: string;
  last_name: string;
  city: string;
  gender: string;
}

const App = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const source = new EventSource(`http://localhost:5000/dashboard`);

    source.addEventListener('open', () => {
      console.log('SSE opened!');
    });

    source.addEventListener('message', (e) => {
      const data: User[] = JSON.parse(e.data);
      console.log("data", data)
      setUsers(data);
    });

    source.addEventListener('error', (e) => {
      console.error('Error: ',  e);
    });

    return () => {
      source.close();
    };
  }, []);

  return (
    <div>
      <h1>Users List</h1>
      <hr/>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Gender</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {
            users.length > 0 && users.map((user, idx) => {
              return <tr>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.gender}</td>
                <td>{user.city}</td>
              </tr>
            })
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;
