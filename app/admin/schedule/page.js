import { getEvents } from '../actions';
import ScheduleClient from './ScheduleClient';

export const revalidate = 0;

export default async function SchedulePage() {
  const events = await getEvents();
  return <ScheduleClient initialEvents={events} />;
}
