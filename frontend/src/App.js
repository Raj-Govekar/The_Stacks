import "./App.css";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from "./components/ui/sonner";
import Login from "./pages/Login";
import Home from "./pages/Home";
import LibraryDetail from "./pages/LibraryDetail";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Libraries from "./pages/admin/Libraries";
import Books from "./pages/admin/Books";
import Inventory from "./pages/admin/Inventory";

export default function App(){
 return <div className="App"><AuthProvider><BrowserRouter><Routes>
   <Route path="/login" element={<Login/>}/>
   <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
   <Route path="/libraries/:id" element={<ProtectedRoute><LibraryDetail/></ProtectedRoute>}/>
   <Route path="/admin" element={<AdminRoute><AdminLayout/></AdminRoute>}>
     <Route index element={<Dashboard/>}/>
     <Route path="libraries" element={<Libraries/>}/>
     <Route path="books" element={<Books/>}/>
     <Route path="inventory" element={<Inventory/>}/>
   </Route>
 </Routes></BrowserRouter><Toaster position="top-right" richColors/></AuthProvider></div>;
}
