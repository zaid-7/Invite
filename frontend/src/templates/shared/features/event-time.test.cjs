const assert = require('node:assert/strict');
const { test } = require('node:test');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { parseEventTime } = require('../../../lib/event-time.ts');

test('entered clock times normalize correctly for countdowns', () => {
  for (const [input, expected] of [
    ['6:00 pm', '18:00'],
    [' 06:00 PM ', '18:00'],
    ['6 PM', '18:00'],
    ['18:00', '18:00'],
    ['05:00 PM onwards', '17:00'],
    ['12:00 AM', '00:00'],
    ['12:00 PM', '12:00'],
    ['00:00', '00:00'],
    ['11:59 pm', '23:59'],
  ]) {
    assert.equal(parseEventTime(input), expected, input);
  }
});

test('missing, descriptive, or invalid clock times do not invent a countdown time', () => {
  for (const input of ['', ' ', 'Evening', '24:00', '13:00 PM', '00:00 AM', '6:60 PM', '6:00 PM - 8:00 PM']) {
    assert.equal(parseEventTime(input), null, input);
  }
});

const data = {
  id: 'time-regression',
  coupleNames: { partnerOne: 'Example Groom', partnerTwo: 'Example Bride' },
  weddingDateTimeISO: '2026-11-19T18:00:00',
  events: [{ label: 'Wedding', venueName: 'Example Venue', address: 'Example Address', time: '6:00 pm' }],
  gallery: [],
  sections: { scratchReveal: true, countdown: false, gallery: false, rsvp: false, accommodation: false, map: false, musicPlayer: false },
};

for (const templateId of ['royal-imperial', 'royal-prestige', 'royal-heritage', 'royal-elegance-royal']) {
  const Template = require(`../../royal/${templateId}/index.tsx`).default;

  test(`${templateId} displays the entered time in the date reveal, not a fixed time`, () => {
    const html = renderToStaticMarkup(React.createElement(Template, { data: { ...data, templateId }, mode: 'preview' }));
    const revealStart = html.indexOf('id="date-scratch-section"');
    assert.ok(revealStart >= 0, 'Date-reveal section must be present');
    const dateReveal = html.slice(revealStart, html.indexOf('</section>', revealStart));
    assert.match(dateReveal, /6:00 pm/);
    assert.doesNotMatch(html, /10:30 AM/);
  });

  test(`${templateId} countdown targets the selected evening hour`, t => {
    t.mock.method(Date, 'now', () => new Date('2026-11-19T17:00:00').getTime());
    const html = renderToStaticMarkup(React.createElement(Template, {
      data: { ...data, templateId, sections: { ...data.sections, countdown: true } },
      mode: 'preview',
    }));
    const countdownStart = html.indexOf('id="countdown-section"');
    const countdown = html.slice(countdownStart, html.indexOf('</section>', countdownStart));
    assert.match(countdown, />01<\/div><span[^>]+>Hours<\/span>/);
  });
}
