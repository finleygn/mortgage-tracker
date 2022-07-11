import { logout } from '../utils/session.ts';
import { Handlers } from '$fresh/server.ts'

export const handler: Handlers<any | null> = {
  async GET(request) {
    return logout(request)
  },
};