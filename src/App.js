import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Marketplace from "./pages/Marketplace";
import CreateItem from "./pages/CreateItem";
import MyListings from "./pages/MyListings";
import EditItem from "./pages/EditItem";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 text-slate-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<Marketplace />} />
            <Route
              path="/create"
              element={
                <RequireAuth>
                  <CreateItem />
                </RequireAuth>
              }
            />
            <Route
              path="/my-listings"
              element={
                <RequireAuth>
                  <MyListings />
                </RequireAuth>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <RequireAuth>
                  <EditItem />
                </RequireAuth>
              }
            />
            <Route
              path="/chat/:conversationId"
              element={
                <RequireAuth>
                  <Chat />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
