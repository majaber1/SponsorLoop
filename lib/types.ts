export type Locale = "ar" | "en";
export type OpportunityCategory =
  | "events"
  | "creators"
  | "podcasts"
  | "sports"
  | "digital"
  | "ooh"
  | "community"
  | "gaming";

export type Opportunity = {
  id: string;
  organizationId: string;
  organizationNameAr: string;
  organizationNameEn: string;
  category: OpportunityCategory;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  city: string;
  startingPrice: number;
  currency: "SAR";
  estimatedReach: number;
  audience: string[];
  formats: string[];
  verified: boolean;
  featured?: boolean;
  trustScore: number;
  availabilityScore: number;
  performanceScore: number;
};

export type CampaignInput = {
  title: string;
  objective: string;
  budget: number;
  city?: string;
  categories?: OpportunityCategory[];
  audience?: string[];
};

export type MatchResult = {
  opportunity: Opportunity;
  score: number;
  components: {
    audience: number;
    objective: number;
    budget: number;
    geography: number;
    trust: number;
    performance: number;
    availability: number;
    brandSafety: number;
  };
  reasonsAr: string[];
  reasonsEn: string[];
};

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  locale: Locale;
  role: "advertiser" | "owner" | "agency" | "admin";
  organizationId: string;
  organizationName: string;
};

export type Notification = {
  id: string;
  type: "deal_update" | "new_match" | "verification" | "system";
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  read: boolean;
  createdAt: string;
  link?: string;
};

export type DealMessage = {
  id: string;
  dealId: string;
  senderName: string;
  senderRole: "buyer" | "seller" | "system";
  message: string;
  createdAt: string;
};

export type Review = {
  id: string;
  dealId: string;
  rating: number;
  comment: string;
  reviewerName: string;
  createdAt: string;
};

export type DealStage =
  | "request"
  | "negotiation"
  | "approval"
  | "contract"
  | "payment"
  | "delivery"
  | "completed";

export type Deal = {
  id: string;
  opportunityId: string;
  campaignId?: string;
  buyerOrgId: string;
  sellerOrgId: string;
  title: string;
  counterparty: string;
  amount: number;
  currency: "SAR";
  stage: DealStage;
  updatedAt: string;
};
