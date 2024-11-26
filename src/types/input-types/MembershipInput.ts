export type MembershipInput = {
    MembershipName?: string | null;
    PricePerMonth?: number | null; // Assuming `Decimal` maps to `number` in your application; otherwise, adjust as needed
    AccessLevel?: string | null;
    Duration?: string | null;
    MaxClassBookings?: number | null;
    Description?: string | null;
  };
  