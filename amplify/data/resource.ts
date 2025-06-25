import { defineData } from "@aws-amplify/backend";

export const OvertimeRequest = defineData({
  fields: {
    employeeId: "string",
    employeeName: "string",
    teamLeaderId: "string",
    hours: "number",
    reason: "string",
    date: "datetime",
    managerStatus: { type: "string", default: "pending" },
    hrStatus: { type: "string", default: "pending" },
    finalStatus: { type: "string", default: "pending" },
  },
  authorization: {
    default: "allow",
  },
});
