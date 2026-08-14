import { demoDealMessages, demoDeals, demoNotifications, demoOpportunities, demoReviews } from "./demo-data";
import type { CampaignInput, Deal, DealMessage, Notification, Opportunity, Review } from "./types";

type DemoCampaign = CampaignInput & { id: string; createdAt: string; status: string };

type DemoState = {
  opportunities: Opportunity[];
  campaigns: DemoCampaign[];
  deals: Deal[];
  notifications: Notification[];
  messages: DealMessage[];
  reviews: Review[];
  favorites: string[];
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
    favorites: []
  };

if (!globalForDemo.sponsorLoopDemo) globalForDemo.sponsorLoopDemo = demoState;
