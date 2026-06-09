import { getContentBlocks } from '../actions';
import ContentClient from './ContentClient';

export const revalidate = 0;

export default async function ContentPage() {
  const content = await getContentBlocks();
  return <ContentClient initialContent={content} />;
}
