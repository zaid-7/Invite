// templates/types.ts
// The single data contract every template — Classic or Royal — renders from.
// Your dashboard form writes this shape; templates never know about your DB.

export interface VenueDetail {
  label: string;        // "Ceremony", "Reception"
  venueName: string;
  address: string;
  time: string;         // display string, e.g. "5:00 PM onwards"
  mapUrl?: string;      // Google Maps embed or share link
}

export interface GalleryImage {
  url: string;
  alt?: string;
}

export interface InvitationSections {
  scratchReveal: boolean;
  countdown: boolean;
  gallery: boolean;
  rsvp: boolean;
  map: boolean;
  musicPlayer: boolean;
}

export interface InvitationData {
  id: string;
  templateId: string;               // must match an id in manifest.ts

  coupleNames: {
    partnerOne: string;
    partnerTwo: string;
  };

  weddingDateTimeISO: string;       // "2027-02-14T17:00:00"
  tagline?: string;                 // "Together with their families..."

  events: VenueDetail[];
  dressCode?: string;

  gallery: GalleryImage[];
  heroImageUrl?: string;            // used by Classic templates
  heroVideoUrl?: string;            // used by Royal templates (cinematic hero)
  heroPosterUrl?: string;           // poster frame shown before video loads

  musicTrackUrl?: string;

  languages?: string[];             // for multi-language toggle, e.g. ["en", "hi"]

  sections: InvitationSections;
}
