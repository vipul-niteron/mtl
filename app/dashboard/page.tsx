"use client";

import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import { a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  OvertimeRequest: a
    .model({
      employeeId: a.string(),
      employeeName: a.string(),
      teamLeaderId: a.string(),
      hours: a.integer(),
      reason: a.string(),
      date: a.date(),
      managerStatus: a.string().default("pending"),
      hrStatus: a.string().default("pending"),
      finalStatus: a.string().default("pending"),
    })
    .authorization((allow) => [allow.user()]),
});

export const data = defineData({ schema });

const client = generateClient<any>();

function getFlag(status: string) {
  if (status === "approved") return "🟢";
  if (status === "rejected") return "🔴";
  return "🟡";
}

function statusLabel(status: string) {
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  return "Pending";
}

export default function DashboardPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    client.models.OvertimeRequest.list({})
      .then((res: any) => setRequests(res.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = requests.filter((r) => {
    const matchesStatus = filter ? r.finalStatus === filter : true;
    const matchesSearch = search
      ? r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        r.reason.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const total = requests.length;
  const approved = requests.filter((r) => r.finalStatus === "approved").length;
  const pending = requests.filter((r) => r.finalStatus === "pending").length;
  const rejected = requests.filter((r) => r.finalStatus === "rejected").length;

  return (
    <main className="max-w-5xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4 text-center text-blue-700">Overtime Dashboard</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Total" count={total} color="blue" />
        <SummaryCard title="Approved" count={approved} color="green" />
        <SummaryCard title="Pending" count={pending} color="yellow" />
        <SummaryCard title="Rejected" count={rejected} color="red" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <label className="font-medium">Filter by status:</label>
        <select
          className="border rounded px-2 py-1 w-full sm:w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
        <input
          className="border rounded px-2 py-1 flex-1"
          type="text"
          placeholder="Search by employee or reason..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center">No overtime requests found.</p>
      ) : (
        <>
          <MobileCards data={filtered} />
          <DesktopTable data={filtered} />
        </>
      )}
    </main>
  );
}

function SummaryCard({ title, count, color }: { title: string; count: number; color: string }) {
  return (
    <div className={`bg-${color}-100 rounded-lg p-4 text-center shadow`}>
      <div className="text-lg font-semibold">{title}</div>
      <div className={`text-2xl font-bold text-${color}-700`}>{count}</div>
    </div>
  );
}

function MobileCards({ data }: { data: any[] }) {
  return (
    <div className="sm:hidden space-y-4">
      {data.map((req) => (
        <div
          key={req.id}
          className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 border-l-4"
          style={{
            borderColor:
              req.finalStatus === "approved"
                ? "#22c55e"
                : req.finalStatus === "rejected"
                ? "#ef4444"
                : "#eab308",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getFlag(req.finalStatus)}</span>
            <span className="font-bold text-lg">{req.employeeName}</span>
            <span
              className="ml-auto px-2 py-1 rounded text-xs font-semibold capitalize"
              style={{
                backgroundColor:
                  req.finalStatus === "approved"
                    ? "#bbf7d0"
                    : req.finalStatus === "rejected"
                    ? "#fecaca"
                    : "#fef08a",
                color:
                  req.finalStatus === "approved"
                    ? "#15803d"
                    : req.finalStatus === "rejected"
                    ? "#b91c1c"
                    : "#a16207",
              }}
            >
              {statusLabel(req.finalStatus)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span>
              <b>Hours:</b> {req.hours}
            </span>
            <span>
              <b>Date:</b> {new Date(req.date).toLocaleDateString()}
            </span>
          </div>
          <div className="text-gray-700 text-sm">
            <b>Reason:</b> {req.reason}
          </div>
        </div>
      ))}
    </div>
  );
}

function DesktopTable({ data }: { data: any[] }) {
  return (
    <div className="hidden sm:block overflow-x-auto">
      <table className="min-w-full bg-white border rounded shadow text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Flag</th>
            <th className="p-2">Employee</th>
            <th className="p-2">Hours</th>
            <th className="p-2">Reason</th>
            <th className="p-2">Date</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((req) => (
            <tr key={req.id} className="border-t">
              <td className="p-2 text-xl text-center">{getFlag(req.finalStatus)}</td>
              <td className="p-2 font-semibold">{req.employeeName}</td>
              <td className="p-2">{req.hours}</td>
              <td className="p-2">{req.reason}</td>
              <td className="p-2">{new Date(req.date).toLocaleDateString()}</td>
              <td className="p-2 capitalize font-semibold">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    req.finalStatus === "approved"
                      ? "bg-green-100 text-green-700"
                      : req.finalStatus === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {statusLabel(req.finalStatus)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
