import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
// Removed import of 'data' due to missing export

defineBackend({
  auth,
});
