import { Inbox } from "lucide-react";

export function EmptyState({
  icon: Icon = Inbox,
  title = "No data available",
  description = "There are no records to display at this time.",
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
      <div className="size-14 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 flex items-center justify-center mb-4 shadow-inner">
        <Icon className="size-7" />
      </div>
      <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
        {title}
      </h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}

export default EmptyState;
