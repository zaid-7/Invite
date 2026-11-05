const assert = require('node:assert/strict');
const { test } = require('node:test');
const { statSync } = require('node:fs');
const path = require('node:path');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { MusicPlayer } = require('./MusicPlayer.tsx');
const { musicTracks } = require('../../../lib/music.ts');

const render = trackUrl => renderToStaticMarkup(React.createElement(MusicPlayer, { trackUrl }));

test('silent invitations have neither an audio element nor a music control', () => {
  assert.equal(render(undefined), '');
  assert.equal(render(''), '');
});

test('all three music choices resolve to nonempty deployed MP3 assets', () => {
  assert.equal(musicTracks.length, 3);
  assert.equal(new Set(musicTracks.map(track => track.value)).size, 3);
  for (const track of musicTracks) {
    assert.ok(track.label);
    assert.match(track.value, /^\/music\/[\w-]+\.mp3$/);
    const asset = path.join(__dirname, '../../../../public', track.value);
    assert.ok(statSync(asset).size > 0);
  }
});

test('selected music loops and does not eagerly download an unused track', () => {
  for (const track of musicTracks) {
    const html = render(track.value);
    assert.match(html, new RegExp(`src="${track.value}"`));
    assert.match(html, /loop=""/);
    assert.match(html, /preload="none"/);
    assert.equal((html.match(/<audio /g) || []).length, 1);
    assert.equal((html.match(/<button /g) || []).length, 1);
  }
});

test('music control starts in a truthful, accessible not-playing state', () => {
  const html = render(musicTracks[0].value);
  assert.match(html, /type="button"/);
  assert.match(html, /data-music-control="true"/);
  assert.match(html, /aria-label="Play background music"/);
  assert.match(html, /aria-pressed="false"/);
});
