// Single source of truth for the "book a consultation" destination.
//
// Right now this points at the clinic's existing ClinicCards Online Booking
// widget (real-time slot availability, already configured for abclinic.uz —
// confirmed live via GET /booking-settings on the ClinicCards API). Once the
// in-house AB Cards system grows its own public booking flow, swap this one
// constant (or set BOOKING_URL as an env var) and every "Записаться" button
// on the site follows automatically — no per-page changes needed.
export const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://cliniccards.com/booking/8_F4vNtmwVKKbnlGtKG3EamdeJpXuJFF";
