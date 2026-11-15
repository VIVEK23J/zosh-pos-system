export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  color = "emerald",
}) {
  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40",
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-100 dark:border-blue-900/40",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-100 dark:border-amber-900/40",
    purple: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-100 dark:border-purple-900/40",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-100 dark:border-rose-900/40",
  };

  const iconColor = colorMap[color] || colorMap.emerald;

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {title}
        </span>
        {Icon && (
          <div className={`size-10 rounded-xl flex items-center justify-center border ${iconColor}`}>
            <Icon className="size-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {value}
        </h3>
        {trend && (
          <span
            className={`text-xs font-semibold flex items-center ${
              trendPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}

export default StatCard;
