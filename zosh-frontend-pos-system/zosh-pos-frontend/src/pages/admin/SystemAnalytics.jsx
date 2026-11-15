import { useState } from "react";
import {
  Server,
  Database,
  Cpu,
  Activity,
  CheckCircle2,
  ShieldCheck,
  Zap,
  HardDrive,
} from "lucide-react";
import { StatCard } from "../../components/common/StatCard";
import { Badge } from "../../components/common/Badge";

export function SystemAnalytics() {
  const [metrics] = useState({
    serverUptime: "99.98%",
    apiLatency: "42 ms",
    dbConnections: "18 / 100",
    storageUsed: "2.4 GB / 50 GB",
  });

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Platform Infrastructure & Health Analytics
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Monitor Spring Boot microservices, MySQL database health, memory load, and API response latency
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <Badge variant="success" size="lg">
            All Systems Operational
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Platform Uptime"
          value={metrics.serverUptime}
          subtitle="Past 30 days availability"
          icon={Activity}
          color="emerald"
        />
        <StatCard
          title="API Response Latency"
          value={metrics.apiLatency}
          subtitle="Spring Boot average response"
          icon={Zap}
          color="blue"
        />
        <StatCard
          title="MySQL Connections"
          value={metrics.dbConnections}
          subtitle="Active connection pool"
          icon={Database}
          color="purple"
        />
        <StatCard
          title="Disk & Cloud Storage"
          value={metrics.storageUsed}
          subtitle="Cloudinary & MySQL backups"
          icon={HardDrive}
          color="amber"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Backend Microservice Status
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <Server className="size-4 text-emerald-600" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  Spring Boot REST API (Port 5000)
                </span>
              </div>
              <Badge variant="success" size="sm">ONLINE</Badge>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <Database className="size-4 text-blue-600" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  MySQL 8.0 Cluster (storeSystem)
                </span>
              </div>
              <Badge variant="success" size="sm">HEALTHY</Badge>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="size-4 text-purple-600" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  Spring Security JWT Validator
                </span>
              </div>
              <Badge variant="success" size="sm">ACTIVE</Badge>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <Zap className="size-4 text-amber-500" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  Payment Webhooks (Razorpay & Stripe)
                </span>
              </div>
              <Badge variant="success" size="sm">READY</Badge>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Architecture Specifications
          </h3>

          <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
            <div className="p-3 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
              <h5 className="font-bold text-gray-900 dark:text-white mb-1">
                Java 21 Virtual Threads
              </h5>
              <p className="text-[11px] text-gray-400">
                Lightweight threads handle concurrent checkout requests with minimal memory overhead.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
              <h5 className="font-bold text-gray-900 dark:text-white mb-1">
                Multi-Tenant Isolation
              </h5>
              <p className="text-[11px] text-gray-400">
                Data partition by `store_id` and `branch_id` across all relational entities.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
              <h5 className="font-bold text-gray-900 dark:text-white mb-1">
                Stateless JWT Authentication
              </h5>
              <p className="text-[11px] text-gray-400">
                24-hour token expiration with automatic bearer header injection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemAnalytics;
