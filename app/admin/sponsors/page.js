import { getSponsorTiers } from '../actions';
import SponsorsClient from './SponsorsClient';

export const revalidate = 0;

export default async function SponsorsAdminPage() {
  const tiers = await getSponsorTiers();
  return <SponsorsClient initialTiers={tiers} />;
}
