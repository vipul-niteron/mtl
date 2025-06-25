"use client";
import { useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export default function SubmitPage() {
  const [employeeName, setEmployeeName] = useState("");
  const [hours, setHours] = useState(0);
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await client.models.OvertimeRequest.create({
      employeeName,
      hours,
      reason,
      date: new Date(date),
      // employeeId and teamLeaderId should be set from auth user info in a real app
    });
    setSuccess(true);
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Submit Overtime Request</h2>
      {success ? (
        <p style={{ color: "green" }}>Overtime request submitted!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>Employee Name:<br/>
            <input value={employeeName} onChange={e => setEmployeeName(e.target.value)} required />
          </label><br/>
          <label>Hours:<br/>
            <input type="number" value={hours} onChange={e => setHours(Number(e.target.value))} required min={1} />
          </label><br/>
          <label>Reason:<br/>
            <input value={reason} onChange={e => setReason(e.target.value)} required />
          </label><br/>
          <label>Date:<br/>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </label><br/>
          <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
        </form>
      )}
    </main>
  );
} 