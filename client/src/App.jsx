import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [dbIp, setDbIp] = useState('');
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const fetchTasks = async () => {
    const res = await axios.get('/tasks');
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title.trim()) return;
    await axios.post('/tasks', { title });
    setTitle('');
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const toggleTask = async (id) => {
    await axios.put(`/tasks/${id}/toggle`);
    fetchTasks();
  };

  useEffect(() => {
    axios.get('/get-db-ip')
      .then(response => setDbIp(response.data.dbIp))
      .catch(error => console.error('Error fetching DB IP:', error));
    fetchTasks();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Task Manager</h1>

      <div className="text-center">
      <p><strong>Connected to database:</strong> {dbIp ? dbIp : 'Loading database IP...'}</p>
      </div>

      <div className="mb-3">
      <input
        type="text"
        placeholder="Enter new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="btn btn-primary mt-2" onClick={addTask}>Add</button>
      </div>

      <ul className="list-group">
        {tasks.map(task => (
          <li key={task.id} className={`list-group-item ${task.completed ? 'list-group-item-success' : ''}`}>
            <span
              onClick={() => toggleTask(task.id)}
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                cursor: 'pointer'
              }}
            >
              {task.title}
            </span>
            <div className="float-end">
            <button onClick={() => deleteTask(task.id)} style={{ marginLeft: 10 }}>
              Delete
            </button>
            </div>
          </li>
        ))}
      </ul>
    </div>

    

  );
}

export default App;