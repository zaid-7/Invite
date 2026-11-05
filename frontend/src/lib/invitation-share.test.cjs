const assert = require('node:assert/strict');
const { test } = require('node:test');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { ImageResponse } = require('next/og');
const { getInvitationShareDetails, getInvitationShareMetadata } = require('./invitation-share.ts');
const { InvitationShareCard } = require('../components/templates/InvitationShareCard.tsx');

const invitation = {
  ogTitle: "Asha & Noor's Wedding Invitation",
  template: { occasionType: 'WEDDING' },
  finalData: {
    groomName: 'Asha',
    brideName: 'Noor',
    includeRsvp: true,
    events: [{ date: '2026-11-19', time: '6:00 pm', venue: 'Example Palace' }],
  },
};

test('share preview reflects saved names and event details', () => {
  const details = getInvitationShareDetails(invitation);
  assert.equal(details.names, 'Asha & Noor');
  assert.equal(details.title, invitation.ogTitle);
  assert.equal(details.date, '19 November 2026');
  assert.equal(details.time, '6:00 pm');
  assert.equal(details.venue, 'Example Palace');
  assert.match(details.description, /19 November 2026 · 6:00 pm · Example Palace/);
  assert.match(details.description, /RSVP/);
});

test('disabled RSVP is not advertised in the shared invitation', () => {
  const details = getInvitationShareDetails({ ...invitation, finalData: { ...invitation.finalData, includeRsvp: false } });
  assert.doesNotMatch(details.description, /RSVP/);
});

test('metadata uses absolute URLs on the actual shared host', () => {
  const metadata = getInvitationShareMetadata(invitation, new URL('https://my-invitation.vercel.app/i/example'));
  assert.equal(metadata.alternates.canonical, 'https://my-invitation.vercel.app/i/example');
  assert.equal(metadata.openGraph.url, 'https://my-invitation.vercel.app/i/example');
  assert.equal(metadata.openGraph.images[0].url, 'https://my-invitation.vercel.app/i/example/share-image');
  assert.equal(metadata.openGraph.images[0].type, 'image/png');
  assert.equal(metadata.openGraph.images[0].width, 1200);
  assert.equal(metadata.openGraph.images[0].height, 630);
  assert.equal(metadata.twitter.card, 'summary_large_image');
});

test('missing or invalid fields do not invent sample dates or names', () => {
  const details = getInvitationShareDetails({ finalData: { events: [{ date: '2026-02-31' }] } });
  assert.equal(details.names, '');
  assert.equal(details.date, '');
  assert.equal(details.time, '');
  assert.equal(details.venue, '');
  assert.doesNotMatch(details.description, /Invalid Date|undefined|Arjun|Pooja|10:30/);
});

test('dates do not shift with the server timezone', () => {
  const previous = process.env.TZ;
  try {
    process.env.TZ = 'America/Los_Angeles';
    assert.equal(getInvitationShareDetails(invitation).date, '19 November 2026');
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
});

test('share image text is escaped instead of interpreted as HTML', () => {
  const details = getInvitationShareDetails({
    ...invitation,
    finalData: { groomName: '<script>alert(1)</script>', brideName: 'Noor & Family' },
  });
  const html = renderToStaticMarkup(React.createElement(InvitationShareCard, details));
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
});

test('invitation preview renders a real 1200x630 PNG using bundled fonts', async () => {
  const response = new ImageResponse(
    React.createElement(InvitationShareCard, getInvitationShareDetails(invitation)),
    { width: 1200, height: 630 },
  );
  const png = Buffer.from(await response.arrayBuffer());
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});
