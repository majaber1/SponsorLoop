import { demoDealMessages, demoDeals, demoNotifications, demoOpportunities, demoPackages, demoReviews, demoSponsorshipRequests } from "./demo-data";
import type { CampaignInput, Deal, DealMessage, Notification, Opportunity, PackageTier, Review, SponsorshipRequest } from "./types";

type DemoCampaign = CampaignInput & { id: string; createdAt: string; status: string };

type DemoState = {
  opportunities: Opportunity[];
  campaigns: DemoCampaign[];
  deals: Deal[];
  notifications: Notification[];
  messages: DealMessage[];
  reviews: Review[];
  favorites: string[];
  sponsorshipRequests: SponsorshipRequest[];
  packages: PackageTier[];
};

const globalForDemo = globalThis as unknown as { sponsorLoopDemo?: DemoState };

export const demoState: DemoState =
  globalForDemo.sponsorLoopDemo ?? {
    opportunities: structuredClone(demoOpportunities),
    campaigns: [],
    deals: structuredClone(demoDeals),
    notifications: structuredClone(demoNotifications),
    messages: structuredClone(demoDealMessages),
    reviews: structuredClone(demoReviews),
    favorites: [],
    sponsorshipRequests: structuredClone(demoSponsorshipRequests),
    packages: structuredClone(demoPackages)
  };

if (!globalForDemo.sponsorLoopDemo) globalForDemo.sponsorLoopDemo = demoState;
