export type Locale = "ar" | "en";
export type OpportunityCategory =
  | "events"
  | "creators"
  | "podcasts"
  | "sports"
  | "digital"
  | "ooh"
  | "community"
  | "gaming"
  | "athletes"
  | "hackathons"
  | "clubs";

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

export type PackageTier = {
  id: string;
  opportunityId: string;
  nameAr: string;
  nameEn: string;
  price: number;
  currency: "SAR";
  quantity?: number;
  entitlements: string[];
  status: "available" | "sold_out" | "hidden";
};

export type OrganizationProfile = {
  id: string;
  nameAr: string;
  nameEn: string;
  orgType: string;
  countryCode: string;
  city: string;
  verificationStatus: "pending" | "verified" | "rejected" | "suspended";
  commercialRegistration?: string;
  mawthooqLicense?: string;
  bio?: string;
  websiteUrl?: string;
  logoUrl?: string;
  opportunities: Opportunity[];
  stats: {
    totalOpportunities: number;
    totalDeals: number;
    avgRating: number;
    totalReach: number;
  };
};

export type UserSettings = {
  displayName: string;
  email: string;
  locale: Locale;
  organizationName: string;
  notifyDeals: boolean;
  notifyMatches: boolean;
  notifySystem: boolean;
};

export type OnboardingStep = "role" | "organization" | "preferences" | "complete";

export type CategoryInfo = {
  slug: OpportunityCategory;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  count: number;
  totalReach: number;
  avgPrice: number;
};

export type SponsorshipRequest = {
  id: string;
  organizationNameAr: string;
  organizationNameEn: string;
  category: OpportunityCategory;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  city: string;
  budgetRange: string;
  audienceSize: number;
  status: "open" | "matched" | "closed";
  createdAt: string;
};

export type SuccessStory = {
  id: string;
  brandNameAr: string;
  brandNameEn: string;
  partnerNameAr: string;
  partnerNameEn: string;
  category: OpportunityCategory;
  quoteAr: string;
  quoteEn: string;
  metric: string;
  metricLabel: string;
};

export type DealStage =
  | "inquiry"
  | "offer_submitted"
  | "rights_holder_review"
  | "negotiation"
  | "internal_approval"
  | "contract_draft"
  | "seller_approved"
  | "buyer_approved"
  | "signature_pending"
  | "signed"
  | "funding_pending"
  | "funded"
  | "activation_planning"
  | "creative_review"
  | "live"
  | "evidence_submitted"
  | "milestone_approved"
  | "settlement_pending"
  | "settled"
  | "performance_reporting"
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
