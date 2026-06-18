import "./DashboardCard.css";

type DashboardCardProps = {
  title: string;
  value: number;
  icon: string;
};

function DashboardCard({
  title,
  value,
  icon,
}: DashboardCardProps) {
  return (
    <div className="dashboard-card">
      <div className="card-icon">{icon}</div>

      <h3>{title}</h3>

      <h1>{value}</h1>
    </div>
  );
}

export default DashboardCard;