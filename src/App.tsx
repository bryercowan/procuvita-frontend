import React from 'react';
import { useStore } from './store/useStore';
import Dashboard from './components/Dashboard';
import LoginForm from './components/LoginForm';
import AuthProvider from './components/AuthProvider';

function App() {
  const user = useStore(state => state.user);

  return (
    <AuthProvider>
      {user ? <Dashboard /> : <LoginForm />}
    </AuthProvider>
  );
}

export default App;