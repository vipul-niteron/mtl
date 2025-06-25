import { defineAuth } from "@aws-amplify/backend-auth";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ["TeamLeader", "Manager", "HR"],
});
