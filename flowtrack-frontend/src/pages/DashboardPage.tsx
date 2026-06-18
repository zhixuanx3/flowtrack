import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <div style={{ maxWidth: 600, margin: '100px auto', padding: '0 16px' }}>
      <h1>Dashboard</h1>
      <p>You are logged in.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
