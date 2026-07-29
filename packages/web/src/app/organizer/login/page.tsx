import { redirect } from 'next/navigation';

export default function OrganizerLoginPage() {
  redirect('/auth/login?redirect=/organizer/dashboard');
}
