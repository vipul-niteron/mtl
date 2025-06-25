"use client";
import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export default function ManagerPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.models.OvertimeRequest.list({ filter: { managerStatus: { eq: "pending" } } })
      .then(res => setRequests(res.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setLoading(true);
    if (action === "approve") {
      await client.models.OvertimeRequest.update({ id, managerStatus: "approved" });
    } else {
      await client.models.OvertimeRequest.update({ id, finalStatus: "rejected" });
    }
    // Refresh list
    const res = await client.models.OvertimeRequest.list({ filter: { managerStatus: { eq: "pending" } } });
    setRequests(res.data ?? []);
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Manager Approval</h2>
      {loading ? <p>Loading...</p> : (
        <table border={1} cellPadding={8} style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Employee</th><th>Hours</th><th>Reason</th><th>Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td>{req.employeeName}</td>
                <td>{req.hours}</td>
                <td>{req.reason}</td>
                <td>{new Date(req.date).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleAction(req.id, "approve")}>Approved</button>
                  <button onClick={() => handleAction(req.id, "reject")}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
} 