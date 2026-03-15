// src/app/admin/dashboard/page.tsx
import { sql } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { Droplet, AlertTriangle, Users, Clock, CheckCircle, XCircle, BarChart2, Settings, ChevronRight } from "lucide-react";
import Link from "next/link";

interface StatRow {
  count: string;
}

interface ActivityRow {
  type: "donor" | "request";
  name: string;
  blood_group: string;
  district: string;
  status: string;
  created_at: string;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    fulfilled: "bg-blue-100 text-blue-800",
  };
  const labels: Record<string, string> = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    fulfilled: "Fulfilled",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-700"}`}>
      {labels[status] ?? status}
    </span>
  );
}

export const revalidate = 0;

export default async function AdminDashboardPage() {
   const [
    approvedDonorsResult,
    pendingDonorsResult,
    totalRequestsResult,
    fulfilledRequestsResult,
    rejectedRequestsResult,
    activityResult,
  ] = await Promise.all([
    sql`SELECT COUNT(*)::text AS count FROM donors WHERE status = 'approved'` as unknown as Promise<StatRow[]>,
    sql`SELECT COUNT(*)::text AS count FROM donors WHERE status = 'pending'` as unknown as Promise<StatRow[]>,
    sql`SELECT COUNT(*)::text AS count FROM blood_requests` as unknown as Promise<StatRow[]>,
    sql`SELECT COUNT(*)::text AS count FROM blood_requests WHERE status = 'fulfilled'` as unknown as Promise<StatRow[]>,
    sql`SELECT COUNT(*)::text AS count FROM blood_requests WHERE status = 'rejected'` as unknown as Promise<StatRow[]>,
    sql`
      SELECT type, name, blood_group, district, status, created_at
      FROM (
        SELECT
          'donor'    AS type,
          full_name  AS name,
          blood_group,
          district,
          status,
          created_at
        FROM donors
        UNION ALL
        SELECT
          'request'    AS type,
          patient_name AS name,
          blood_group,
          district,
          status,
          created_at
        FROM blood_requests
      ) combined
      ORDER BY created_at DESC
      LIMIT 20
    ` as unknown as Promise<ActivityRow[]>,
  ]);

  const stats = {
    approvedDonors: parseInt(approvedDonorsResult[0]?.count ?? "0", 10),
    pendingDonors: parseInt(pendingDonorsResult[0]?.count ?? "0", 10),
    totalRequests: parseInt(totalRequestsResult[0]?.count ?? "0", 10),
    fulfilledRequests: parseInt(fulfilledRequestsResult[0]?.count ?? "0", 10),
    rejectedRequests: parseInt(rejectedRequestsResult[0]?.count ?? "0", 10),
  };

  const statCards = [
    {
      label: "Approved Donors",
      value: stats.approvedDonors,
      icon: Users,
      color: "bg-green-50 text-green-600",
      border: "border-green-200",
    },
    {
      label: "Pending Donors",
      value: stats.pendingDonors,
      icon: Clock,
      color: "bg-yellow-50 text-yellow-600",
      border: "border-yellow-200",
    },
    {
      label: "Total Requests",
      value: stats.totalRequests,
      icon: BarChart2,
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-200",
    },
    {
      label: "Fulfilled Requests",
      value: stats.fulfilledRequests,
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-200",
    },
    {
      label: "Rejected Requests",
      value: stats.rejectedRequests,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
      border: "border-red-200",
    },
  ];

  const quickActions = [
    { label: "Manage Donors", href: "/admin/donors", icon: Users, description: "Approve, reject, or view donor registrations" },
    { label: "Manage Requests", href: "/admin/requests", icon: AlertTriangle, description: "Review and fulfil blood requests" },
    { label: "Site Settings", href: "/admin/settings", icon: Settings, description: "Update content, colors, and configuration" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of Roktho Bondhon platform activity.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`bg-white rounded-xl border ${card.border} shadow-sm p-5 flex items-center gap-4`}
            >
              <div className={`p-2 rounded-lg ${card.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-tight">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-xs text-gray-500 mt-0.5">Last 20 submissions across donors and requests</p>
          </div>

          {activityResult.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-gray-400">No activity yet.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {activityResult.map((row, i) => {
                const isDonor = row.type === "donor";
                const timeAgo = formatDistanceToNow(new Date(row.created_at), { addSuffix: true });
                return (
                  <div key={i} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                    {/* Type icon */}
                    <div className={`shrink-0 p-1.5 rounded-full ${isDonor ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-500"}`}>
                      {isDonor ? <Droplet size={14} /> : <AlertTriangle size={14} />}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-800 truncate">{row.name}</span>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-semibold ${
                          row.blood_group.includes("A") && !row.blood_group.includes("B")
                            ? "bg-red-100 text-red-700"
                            : row.blood_group.includes("B") && !row.blood_group.includes("A")
                            ? "bg-blue-100 text-blue-700"
                            : row.blood_group.includes("AB")
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {row.blood_group}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-400">{row.district}</span>
                        <span className="text-gray-200 text-xs">•</span>
                        <span className="text-xs text-gray-400">{isDonor ? "Donor" : "Request"}</span>
                        <span className="text-gray-200 text-xs">•</span>
                        <span className="text-xs text-gray-400">{timeAgo}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="shrink-0">
                      <StatusBadge status={row.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{action.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-tight">{action.description}</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Summary card */}
          <div className="bg-[var(--color-primary)] rounded-xl p-5 text-white">
            <h3 className="text-sm font-semibold opacity-90">Platform Summary</h3>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="opacity-75">Donor approval rate</span>
                <span className="font-semibold">
                  {stats.approvedDonors + stats.pendingDonors > 0
                    ? Math.round((stats.approvedDonors / (stats.approvedDonors + stats.pendingDonors)) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-75">Request fulfilment rate</span>
                <span className="font-semibold">
                  {stats.totalRequests > 0
                    ? Math.round((stats.fulfilledRequests / stats.totalRequests) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-75">Pending donor reviews</span>
                <span className="font-semibold">{stats.pendingDonors}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}