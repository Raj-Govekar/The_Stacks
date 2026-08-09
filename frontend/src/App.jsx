import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import LibraryDetail from "./pages/LibraryDetail";
import Login from "./pages/Login";

import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Books from "./pages/admin/Books";
import Libraries from "./pages/admin/Libraries";
import Inventory from "./pages/admin/Inventory";

import "./App.css";

function App() {
  return (
    <BrowserRouter basename="/The_Stacks">
      <AuthProvider>
        <Navbar />

        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/libraries/:id" element={<LibraryDetail />} />

          {/* Admin section */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="books" element={<Books />} />
            <Route path="libraries" element={<Libraries />} />
            <Route path="inventory" element={<Inventory />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;