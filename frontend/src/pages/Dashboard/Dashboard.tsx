import DashboardGrid from "../../components/dashboard/DashboardGrid";
import UploadCard from "../../components/upload/UploadCard";

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to AI Codebase Explorer.</p>

     <>
  <DashboardGrid />
  <UploadCard />
</>
    </div>
  );
}

export default Dashboard;