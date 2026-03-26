import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GoalsPage from "./features/goals/GoalsPage";
import TasksPage from "./features/tasks/TasksPage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* PUBLIC ROUTES */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* PROTECTED ROUTES */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/goals"
                        element={
                            <ProtectedRoute>
                                <GoalsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/goals/:goalId"
                        element={
                            <ProtectedRoute>
                                <TasksPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
