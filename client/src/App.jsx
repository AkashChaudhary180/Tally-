import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import GroupDetail from "./pages/GroupDetail.jsx";

// A small wrapper: if there's no logged-in user, redirect to /login
// instead of rendering the protected page. This is a common React
// pattern — a component whose only job is to gate access.
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-paper">
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:id"
          element={
            <ProtectedRoute>
              <GroupDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;