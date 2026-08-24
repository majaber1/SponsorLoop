import { demoDealMessages, demoDeals, demoNotifications, demoOpportunities, demoReviews, demoSponsorshipRequests } from "./demo-data";
import type { CampaignInput, Deal, DealMessage, Notification, Opportunity, Review, SponsorshipRequest } from "./types";

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
    sponsorshipRequests: structuredClone(demoSponsorshipRequests)
  };

if (!globalForDemo.sponsorLoopDemo) globalForDemo.sponsorLoopDemo = demoState;

export function resetDemoState() {
  demoState.opportunities = structuredClone(demoOpportunities);
  demoState.campaigns = [];
  demoState.deals = structuredClone(demoDeals);
  demoState.notifications = structuredClone(demoNotifications);
  demoState.messages = structuredClone(demoDealMessages);
  demoState.reviews = structuredClone(demoReviews);
  demoState.favorites = [];
  demoState.sponsorshipRequests = structuredClone(demoSponsorshipRequests);
}
