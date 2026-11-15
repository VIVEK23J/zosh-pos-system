import { CountUp } from "../fx/CountUp";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
export function StatCard({ title, value, subtitle, icon: Icon, trend, trendPositive = true }) {
  const TrendIcon = trendPositive ? ArrowUpRight : ArrowDownRight;
  return <div className="metric-cell"><div className="metric-label">{title}{Icon && <Icon className="size-4" strokeWidth={1.6} />}</div><div className="metric-value"><CountUp value={value} /></div><div className="metric-detail">{trend && <span className={trendPositive ? "text-primary" : "text-destructive"}><TrendIcon className="size-3" />{trend}</span>}{subtitle && <p>{subtitle}</p>}</div></div>;
}
export default StatCard;
