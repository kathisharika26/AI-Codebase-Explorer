import DashboardCard from "./DashboardCard";

function DashboardGrid() {
  return (
    <div className="dashboard-grid">
      <DashboardCard
        title="Projects"
        value={0}
        icon="📂"
      />

      <DashboardCard
        title="Files"
        value={0}
        icon="📄"
      />

      <DashboardCard
        title="AI Chats"
        value={0}
        icon="🤖"
      />

      <DashboardCard
        title="Documentation"
        value={0}
        icon="📚"
      />
    </div>
  );
}

export default DashboardGrid;