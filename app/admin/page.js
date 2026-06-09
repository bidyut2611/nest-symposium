import { isAuthenticated } from '../../lib/auth.js';
import AdminClient from './AdminClient';

export const revalidate = 0;

export default async function AdminPage() {
  const isAuthed = await isAuthenticated();
  return <AdminClient isAuthed={isAuthed} />;
}
