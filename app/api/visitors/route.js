import prisma from '../../../lib/prisma.js';

// Map of NE state names (as returned by ip-api.com) to state codes
const NE_STATE_MAP = {
  'arunachal pradesh': 'AR',
  'assam': 'AS',
  'manipur': 'MN',
  'meghalaya': 'ML',
  'mizoram': 'MZ',
  'nagaland': 'NL',
  'sikkim': 'SK',
  'tripura': 'TR',
};

/**
 * GET /api/visitors
 * Returns all 8 state visitor counts and total
 */
export async function GET() {
  try {
    const states = await prisma.stateVisitorCount.findMany({
      orderBy: { count: 'desc' },
    });

    const total = states.reduce((sum, s) => sum + s.count, 0);

    return Response.json({ states, total });
  } catch (error) {
    console.error('GET /api/visitors error:', error);
    return Response.json(
      { error: 'Failed to fetch visitor counts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/visitors
 * Records a visit: geolocates the IP, deduplicates within 24h, increments count
 */
export async function POST(request) {
  try {
    // 1. Get visitor IP
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    let ip = forwarded ? forwarded.split(',')[0].trim() : realIp || '127.0.0.1';

    // Normalize IPv6 loopback
    if (ip === '::1') ip = '127.0.0.1';

    // 2. Check for duplicate visit within last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const existingVisit = await prisma.visitorLog.findFirst({
      where: {
        ipAddress: ip,
        visitedAt: { gte: twentyFourHoursAgo },
      },
    });

    if (existingVisit) {
      // Already counted — just return current counts
      const states = await prisma.stateVisitorCount.findMany({
        orderBy: { count: 'desc' },
      });
      const total = states.reduce((sum, s) => sum + s.count, 0);
      return Response.json({ states, total, alreadyCounted: true });
    }

    // 3. Geolocate the IP using ip-api.com
    let detectedState = '';
    let stateCode = null;

    // Skip geolocation for localhost/private IPs
    const isPrivate =
      ip === '127.0.0.1' ||
      ip.startsWith('192.168.') ||
      ip.startsWith('10.') ||
      ip.startsWith('172.');

    if (!isPrivate) {
      try {
        const geoRes = await fetch(
          `http://ip-api.com/json/${ip}?fields=status,regionName,countryCode`
        );
        const geoData = await geoRes.json();

        if (geoData.status === 'success' && geoData.countryCode === 'IN') {
          detectedState = geoData.regionName || '';
          stateCode = NE_STATE_MAP[detectedState.toLowerCase()] || null;
        }
      } catch (geoError) {
        console.error('Geolocation error:', geoError);
        // Continue without geolocation — log the visit but don't increment
      }
    }

    // 4. Log the visit
    await prisma.visitorLog.create({
      data: {
        ipAddress: ip,
        detectedState: detectedState,
      },
    });

    // 5. Increment count if NE state detected
    if (stateCode) {
      await prisma.stateVisitorCount.update({
        where: { stateCode: stateCode },
        data: { count: { increment: 1 } },
      });
    }

    // 6. Return updated counts
    const states = await prisma.stateVisitorCount.findMany({
      orderBy: { count: 'desc' },
    });
    const total = states.reduce((sum, s) => sum + s.count, 0);

    return Response.json({
      states,
      total,
      alreadyCounted: false,
      detectedState: detectedState || null,
      counted: !!stateCode,
    });
  } catch (error) {
    console.error('POST /api/visitors error:', error);
    return Response.json(
      { error: 'Failed to record visit' },
      { status: 500 }
    );
  }
}
