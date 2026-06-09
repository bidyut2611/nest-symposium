import { getSpeakers } from '../actions';
import SpeakersClient from './SpeakersClient';

export const revalidate = 0;

export default async function SpeakersPage() {
  const speakers = await getSpeakers();
  return <SpeakersClient initialSpeakers={speakers} />;
}
