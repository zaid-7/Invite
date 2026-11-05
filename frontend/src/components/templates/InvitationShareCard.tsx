import type { getInvitationShareDetails } from '../../lib/invitation-share';

type Props = ReturnType<typeof getInvitationShareDetails>;

export function InvitationShareCard({ names, occasion, date, time, venue }: Props) {
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', padding: 28,
      background: '#f3ebdc', color: '#29251f', fontFamily: 'Noto Sans',
    }}>
      <div style={{
        width: '100%', height: '100%', display: 'flex', position: 'relative',
        border: '2px solid #b49150', padding: 12,
      }}>
        <div style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', border: '1px solid #d5c3a0',
          padding: '28px 72px', textAlign: 'center',
        }}>
          <svg width="46" height="40" viewBox="0 0 24 24" fill="none" stroke="#b49150" strokeWidth="1.3">
            <path d="M12 21s-9-5.7-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.3-9 12-9 12Z" />
          </svg>
          <div style={{ marginTop: 16, fontSize: 22, letterSpacing: '0.18em', color: '#8d6b32', textTransform: 'uppercase' }}>
            {occasion}
          </div>
          <div style={{
            marginTop: 22, maxWidth: 920,
            fontSize: names.length > 55 ? 48 : 68, lineHeight: 1.15,
          }}>
            {names || 'You are invited'}
          </div>
          <div style={{ marginTop: 22, fontSize: 24, color: '#685d4c' }}>
            You are cordially invited to celebrate with us
          </div>
          {(date || time) && (
            <div style={{ marginTop: 26, fontSize: 26, color: '#29251f' }}>
              {[date, time].filter(Boolean).join(' · ')}
            </div>
          )}
          {venue && (
            <div style={{ marginTop: 12, maxWidth: 900, fontSize: 22, color: '#685d4c' }}>{venue}</div>
          )}
          <div style={{ marginTop: 28, fontSize: 17, letterSpacing: '0.12em', color: '#8d6b32', textTransform: 'uppercase' }}>
            Open your invitation · InviteCraft
          </div>
        </div>
      </div>
    </div>
  );
}
