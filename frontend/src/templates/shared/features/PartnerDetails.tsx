interface PartnerDetailsProps {
  parents?: string;
  qualification?: string;
  profession?: string;
  relationship: 'Son of' | 'Daughter of';
}

export function PartnerDetails({ parents, qualification, profession, relationship }: PartnerDetailsProps) {
  const parentNames = parents?.trim();
  const degree = qualification?.trim();
  const job = profession?.trim();
  if (!parentNames && !degree && !job) return null;

  return (
    <div style={{
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
      fontSize: '0.85rem',
      color: '#F5F3ED',
      lineHeight: 1.4,
      marginBottom: relationship === 'Son of' ? '0.6rem' : '1rem',
    }}>
      {parentNames && (
        <div>{parentNames.toLowerCase().startsWith(relationship.toLowerCase()) ? parentNames : `${relationship} ${parentNames}`}</div>
      )}
      {degree && <div style={{ fontSize: '0.75rem', opacity: 0.88 }}>{degree}</div>}
      {job && <div style={{ fontSize: '0.75rem', opacity: 0.88 }}>{job}</div>}
    </div>
  );
}
