import React from 'react';

export const WatermarkOverlay: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      <div className="watermark absolute inset-0 opacity-15" />
      <div className="absolute inset-0 flex flex-col justify-between py-24 select-none opacity-[0.08]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex justify-around text-4xl md:text-6xl font-extrabold tracking-widest uppercase whitespace-nowrap text-maroon-deep select-none"
            style={{
              transform: `rotate(-15deg) translate(${i * 20}px, 0px)`,
            }}
          >
            <span>PREVIEW ONLY • UNLOCK TO SHARE</span>
            <span>PREVIEW ONLY • UNLOCK TO SHARE</span>
          </div>
        ))}
      </div>
    </div>
  );
};
