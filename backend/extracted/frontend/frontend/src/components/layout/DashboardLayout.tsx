import Sidebar from "./Sidebar";
import Header from "./Header";

function DashboardLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "20px" }}>
        <Header />

        <main>
          <h2>Dashboard</h2>

          <p>Welcome to AI Codebase Explorer.</p>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;