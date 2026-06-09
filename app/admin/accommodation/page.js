import { getAccommodationOptions } from '../actions';
import AccommodationClient from './AccommodationClient';

export const revalidate = 0;

export default async function AccommodationAdminPage() {
  const options = await getAccommodationOptions();
  return <AccommodationClient initialOptions={options} />;
}
