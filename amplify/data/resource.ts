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
