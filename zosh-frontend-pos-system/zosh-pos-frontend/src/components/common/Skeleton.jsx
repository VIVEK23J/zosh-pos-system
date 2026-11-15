export function Skeleton({ className = "h-4 w-full" }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg ${className}`}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="space-y-3 p-4">
      <div className="flex gap-4 mb-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-6 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-2 border-t border-gray-100 dark:border-gray-800">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-5 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="size-10 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-4 w-28" />
    </div>
  );
}

export default Skeleton;
