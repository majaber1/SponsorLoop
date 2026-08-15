import type { Locale, SuccessStory } from "@/lib/types";
import { Star } from "./icons";

export function SuccessStories({ locale, stories }: { locale: Locale; stories: SuccessStory[] }) {
  const ar = locale === "ar";
  return (
    <div className="stories-grid">
      {stories.map((story) => (
        <div className="story-card panel" key={story.id}>
          <div className="story-metric">
            <strong>{story.metric}</strong>
            <small>{story.metricLabel}</small>
          </div>
          <blockquote>{ar ? story.quoteAr : story.quoteEn}</blockquote>
          <div className="story-footer">
            <div className="story-stars">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} />)}
            </div>
            <div className="story-parties">
              <strong>{ar ? story.brandNameAr : story.brandNameEn}</strong>
              <span>×</span>
              <span>{ar ? story.partnerNameAr : story.partnerNameEn}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
