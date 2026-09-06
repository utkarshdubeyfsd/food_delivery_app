interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: string;
  colorScheme?: "green" | "amber" | "blue" | "purple";
}

export function StatCard({
  label,
  value,
  subtext,
  icon,
  colorScheme = "green",
}: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {subtext && <span className="stat-subtext">{subtext}</span>}
      </div>
      <div className={`stat-icon-wrapper ${colorScheme}`}>
        <span>{icon}</span>
      </div>
    </div>
  );
}
