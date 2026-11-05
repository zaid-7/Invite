const assert = require('node:assert/strict');
const { test } = require('node:test');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { AccommodationSection } = require('./AccommodationSection.tsx');
const { PartnerDetails } = require('./PartnerDetails.tsx');

const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props));

test('accommodation is omitted when disabled, even with saved details', () => {
  assert.equal(render(AccommodationSection, { enabled: false, details: 'Saved hotel details' }), '');
});

test('accommodation never substitutes sample booking details for blank input', () => {
  for (const details of [undefined, '', '   ']) {
    assert.equal(render(AccommodationSection, { enabled: true, details }), '');
  }
});

test('enabled accommodation renders the entered text safely', () => {
  const html = render(AccommodationSection, { enabled: true, details: 'Example Hotel\nBook with <family>' });
  assert.match(html, /id="accommodation-section"/);
  assert.match(html, /Example Hotel\nBook with &lt;family&gt;/);
  assert.doesNotMatch(html, /Grand Palace|WEDDING2026/);
});

test('empty profiles render no default qualifications or professions', () => {
  assert.equal(render(PartnerDetails, { relationship: 'Son of' }), '');
  assert.equal(render(PartnerDetails, { relationship: 'Daughter of', qualification: ' ', profession: ' ' }), '');
});

test('profiles display entered qualifications and jobs without hardcoded degrees', () => {
  const html = render(PartnerDetails, { relationship: 'Son of', parents: 'Example Parents', qualification: 'B.Arch', profession: 'Architect' });
  assert.match(html, /Son of Example Parents/);
  assert.match(html, /B.Arch/);
  assert.match(html, /Architect/);
  assert.doesNotMatch(html, /M.Tech|MBBS|Pediatrician/);
});

test('clearing qualifications preserves parent names without degree lines', () => {
  const html = render(PartnerDetails, { relationship: 'Daughter of', parents: 'Daughter of Example Parents', qualification: '', profession: '' });
  assert.match(html, /Daughter of Example Parents/);
  assert.doesNotMatch(html, /Daughter of Daughter of|MBBS|M.Tech/);
});
