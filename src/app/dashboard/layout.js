
import "../styles/dashboard.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
    <div className="con">
     <Sidebar/>
      {/* Main Content */}
      <main className="content">
     <Navbar/>
        {children}
      </main>
    </div>
    </ProtectedRoute>
  );
}
