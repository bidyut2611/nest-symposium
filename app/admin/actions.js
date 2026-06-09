'use server';

import prisma from '../../lib/prisma.js';
import { isAuthenticated } from '../../lib/auth.js';
import { revalidatePath } from 'next/cache';

async function checkAuth() {
  const authed = await isAuthenticated();
  if (!authed) throw new Error('Unauthorized');
}

// Speakers
export async function getSpeakers() {
  return prisma.speaker.findMany({ orderBy: { order: 'asc' } });
}

export async function saveSpeaker(data) {
  await checkAuth();
  if (data.id) {
    await prisma.speaker.update({ where: { id: data.id }, data });
  } else {
    await prisma.speaker.create({ data });
  }
  revalidatePath('/speakers');
  revalidatePath('/');
}

export async function deleteSpeaker(id) {
  await checkAuth();
  await prisma.speaker.delete({ where: { id } });
  revalidatePath('/speakers');
  revalidatePath('/');
}

// Events
export async function getEvents() {
  return prisma.event.findMany({ orderBy: [{ date: 'asc' }, { startTime: 'asc' }] });
}

export async function saveEvent(data) {
  await checkAuth();
  if (data.id) {
    await prisma.event.update({ where: { id: data.id }, data });
  } else {
    await prisma.event.create({ data });
  }
  revalidatePath('/schedule');
  revalidatePath('/program');
}

export async function deleteEvent(id) {
  await checkAuth();
  await prisma.event.delete({ where: { id } });
  revalidatePath('/schedule');
  revalidatePath('/program');
}

// Content Blocks
export async function getContentBlocks() {
  return prisma.contentBlock.findMany({ orderBy: { title: 'asc' } });
}

export async function saveContentBlock(data) {
  await checkAuth();
  await prisma.contentBlock.update({ where: { id: data.id }, data });
  revalidatePath('/');
  revalidatePath('/accommodation');
  revalidatePath('/program');
  revalidatePath('/sponsorship');
  revalidatePath('/contact');
  revalidatePath('/register');
}

// Sponsor Tiers
export async function getSponsorTiers() {
  return prisma.sponsorTier.findMany({ orderBy: { order: 'asc' } });
}

export async function saveSponsorTier(data) {
  await checkAuth();
  if (data.id) {
    await prisma.sponsorTier.update({ where: { id: data.id }, data });
  } else {
    delete data.id;
    await prisma.sponsorTier.create({ data });
  }
  revalidatePath('/sponsorship');
}

export async function deleteSponsorTier(id) {
  await checkAuth();
  await prisma.sponsorTier.delete({ where: { id } });
  revalidatePath('/sponsorship');
}

// Accommodation Options
export async function getAccommodationOptions() {
  return prisma.accommodationOption.findMany({ orderBy: { order: 'asc' } });
}

export async function saveAccommodationOption(data) {
  await checkAuth();
  if (data.id) {
    await prisma.accommodationOption.update({ where: { id: data.id }, data });
  } else {
    delete data.id;
    await prisma.accommodationOption.create({ data });
  }
  revalidatePath('/accommodation');
}

export async function deleteAccommodationOption(id) {
  await checkAuth();
  await prisma.accommodationOption.delete({ where: { id } });
  revalidatePath('/accommodation');
}
