import Link from "next/link";
import { HeroPlanner } from "@/components/hero-planner";
import { OpportunityCard } from "@/components/opportunity-card";
import { SuccessStories } from "@/components/success-stories";
import { Arrow, Building, Chart, Check, Handshake, Megaphone, Shield, Sparkles, Star, TrendingUp, Wallet } from "@/components/icons";
import { isLocale, localePath } from "@/lib/i18n";
import { listOpportunities } from "@/lib/repository";
import { demoSuccessStories } from "@/lib/demo-data";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw }=await params; if(!isLocale(raw)) return null; const locale=raw; const ar=locale==="ar";
  const opportunities=(await listOpportunities()).slice(0,6);
  return <>
    <section className="hero-section"><div className="hero-orb hero-orb-one"/><div className="hero-orb hero-orb-two"/><div className="container hero-grid">
      <div className="hero-copy"><div className="eyebrow hero-eyebrow"><span className="pulse-dot"/>{ar?"أول سوق ذكي للرعاية والإعلان مصمم للسعودية":"Saudi-first intelligent sponsorship & advertising marketplace"}</div>
        <h1>{ar?<>من <em>الفرصة</em> إلى صفقة<br/>يمكن قياس أثرها.</>:<>From <em>opportunity</em> to<br/>a measurable partnership.</>}</h1>
        <p>{ar?"اكتشف الفعاليات وصناع المحتوى والبودكاست والرياضيين والأندية والهاكاثونات والمنصات الرقمية والمساحات الإعلانية، أو دع SponsorLoop AI يبني لك المزيج الأنسب لميزانيتك وجمهورك.":"Discover events, creators, podcasts, athletes, clubs, hackathons, digital platforms and media inventory — or let SponsorLoop AI build the right mix for your audience and budget."}</p>
        <div className="hero-actions"><Link className="button button-primary large" href={localePath(locale,"marketplace")}>{ar?"أبحث عن رعاية أو إعلان":"Find sponsorship & media"}<Arrow/></Link><Link className="button button-secondary large" href={localePath(locale,"opportunities/new")}>{ar?"لدي فرصة أريد بيعها":"I have inventory to sell"}</Link></div>
        <div className="hero-proof"><span><Check size={16}/>{ar?"فرص موثقة":"Verified inventory"}</span><span><Check size={16}/>{ar?"تقييم قابل للتفسير":"Explainable matching"}</span><span><Check size={16}/>{ar?"عربي / English":"Arabic / English"}</span></div>
      </div>
      <div className="hero-visual"><div className="visual-stack"><div className="floating-card fc-one"><div className="mini-icon"><Sparkles/></div><div><small>AI Match</small><strong>94%</strong></div></div><div className="floating-card fc-two"><div className="mini-icon"><Chart/></div><div><small>{ar?"الوصول المتوقع":"Est. reach"}</small><strong>420K</strong></div></div><div className="hero-dashboard panel-glass"><div className="mock-top"><span/><span/><span/></div><div className="mock-heading"><small>{ar?"خطة إطلاق منتج تقني":"Tech product launch"}</small><strong>50,000 SAR</strong></div><div className="mock-bars"><div><span style={{width:"94%"}}/><b>Podcast</b><em>94</em></div><div><span style={{width:"89%"}}/><b>LinkedIn</b><em>89</em></div><div><span style={{width:"84%"}}/><b>Event</b><em>84</em></div></div><div className="mock-bottom"><span>{ar?"3 فرص موصى بها":"3 recommended"}</span><b>{ar?"ضمن الميزانية":"Within budget"}</b></div></div></div></div>
    </div><div className="container"><HeroPlanner locale={locale}/></div></section>

    <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">{ar?"فرص مختارة":"Curated inventory"}</span><h2>{ar?"ابدأ من السوق، أو دع AI يختصر عليك البحث":"Start from the market, or let AI narrow the search"}</h2></div><Link className="text-link" href={localePath(locale,"marketplace")}>{ar?"عرض كل الفرص":"View all opportunities"}<Arrow size={17}/></Link></div><div className="opportunity-grid">{opportunities.map(x=><OpportunityCard key={x.id} locale={locale} item={x}/>)}</div></div></section>

    {/* Reverse Marketplace CTA */}
    <section className="section section-reverse-marketplace"><div className="container"><div className="reverse-marketplace-banner panel">
      <div className="rm-content">
        <Megaphone size={28}/>
        <div>
          <h2>{ar?"عندك جمهور وتبحث عن رعاة؟":"Have an audience and seeking sponsors?"}</h2>
          <p>{ar?"أنشئ طلب رعاية ودع العلامات التجارية تجدك. سوق عكسي يربط أصحاب الحقوق بالرعاة المناسبين.":"Create a sponsorship request and let brands find you. A reverse marketplace connecting rights holders with the right sponsors."}</p>
        </div>
      </div>
      <div className="rm-actions">
        <Link className="button button-primary" href={localePath(locale,"requests")}>{ar?"استعرض الطلبات":"Browse Requests"}<Arrow size={16}/></Link>
        <Link className="button button-secondary" href={localePath(locale,"requests/new")}>{ar?"أنشئ طلب رعاية":"Post a Request"}</Link>
      </div>
    </div></div></section>

    <section className="section section-tint"><div className="container"><div className="section-head centered"><div><span className="eyebrow">{ar?"رحلة واحدة واضحة":"One clear workflow"}</span><h2>{ar?"من Brief بسيط إلى تنفيذ وقياس":"From a simple brief to delivery and measurement"}</h2><p>{ar?"بدل عشرات الإيميلات والملفات المنفصلة، كل خطوة لها مكان وحالة ومسؤولية واضحة.":"Replace scattered emails and files with one workflow, one status and clear ownership."}</p></div></div><div className="journey-grid">
      {[{i:<Sparkles/>,n:"01",ar:"حدّد هدفك",en:"Set your goal",dar:"الميزانية والجمهور والمدينة والهدف.",den:"Budget, audience, location and objective."},{i:<Chart/>,n:"02",ar:"احصل على المطابقة",en:"Get matched",dar:"تقييم قابل للتفسير لكل فرصة.",den:"Explainable fit score for every opportunity."},{i:<Handshake/>,n:"03",ar:"فاوض واعتمد",en:"Negotiate & approve",dar:"العروض والموافقات والعقد في Deal Room.",den:"Proposals, approvals and contract in one Deal Room."},{i:<Wallet/>,n:"04",ar:"نفّذ وقِس",en:"Deliver & measure",dar:"الأدلة ومؤشرات الأداء وسجل التسليم.",den:"Evidence, KPIs and delivery acceptance."}].map(x=><div className="journey-card" key={x.n}><div className="journey-icon">{x.i}</div><span>{x.n}</span><h3>{ar?x.ar:x.en}</h3><p>{ar?x.dar:x.den}</p></div>)}</div></div></section>

    {/* Success Stories */}
    <section className="section"><div className="container"><div className="section-head centered"><div><span className="eyebrow"><Star size={16}/>{ar?"قصص نجاح":"Success Stories"}</span><h2>{ar?"شركاء حققوا نتائج حقيقية عبر SponsorLoop":"Partners who achieved real results through SponsorLoop"}</h2></div></div><SuccessStories locale={locale} stories={demoSuccessStories}/></div></section>

    <section className="section"><div className="container split-feature"><div><span className="eyebrow"><Shield size={16}/>{ar?"الثقة جزء من المنتج":"Trust is product infrastructure"}</span><h2>{ar?"لا يكفي أن تكون الفرصة جذابة. يجب أن تكون قابلة للتحقق.":"Good inventory is not enough. It has to be verifiable."}</h2><p>{ar?"SponsorLoop يفصل بين بيانات الجهة، الترخيص، الجمهور، الأسعار، الأداء وأدلة التنفيذ بحيث تعرف الشركة ما الذي تم التحقق منه وما الذي ما زال تصريحًا من البائع.":"SponsorLoop separates organization, licensing, audience, pricing, performance and fulfillment evidence so buyers know what is verified and what is seller-declared."}</p><Link className="button button-secondary" href={localePath(locale,"compliance")}>{ar?"افتح مركز الثقة والامتثال":"Open Trust & Compliance"}<Arrow/></Link></div><div className="trust-panel panel"><div className="trust-row"><span className="trust-icon success"><Building/></span><div><strong>{ar?"توثيق المنشأة":"Organization verification"}</strong><small>{ar?"بيانات الكيان والممثل المخول":"Entity & authorized representative"}</small></div><b>✓</b></div><div className="trust-row"><span className="trust-icon success"><Shield/></span><div><strong>{ar?"متطلبات الإعلان":"Advertising compliance"}</strong><small>{ar?"حقول موثوق عند انطباقها":"Mawthooq fields when applicable"}</small></div><b>✓</b></div><div className="trust-row"><span className="trust-icon"><Chart/></span><div><strong>{ar?"أدلة الجمهور والأداء":"Audience & performance evidence"}</strong><small>{ar?"مصدر البيانات وتاريخ آخر تحقق":"Source and last verification date"}</small></div><b>→</b></div></div></div></section>

    {/* Market Intelligence CTA */}
    <section className="section section-tint"><div className="container"><div className="section-head centered"><div><span className="eyebrow"><TrendingUp size={16}/>{ar?"ذكاء السوق":"Market Intelligence"}</span><h2>{ar?"بيانات ورؤى حيّة من سوق الرعاية السعودي":"Live data & insights from the Saudi sponsorship market"}</h2><p>{ar?"متوسطات الأسعار، توزيع الفئات، البيانات الجغرافية وأكثر — كلها مبنية على بيانات حقيقية من المنصة.":"Average prices, category distribution, geographic data and more — all built on real platform data."}</p></div></div><div style={{textAlign:"center"}}><Link className="button button-primary large" href={localePath(locale,"insights")}>{ar?"استعرض رؤى السوق":"View Market Insights"}<Arrow/></Link></div></div></section>

    <section className="cta-section"><div className="container cta-panel"><div><span className="eyebrow">SponsorLoop</span><h2>{ar?"عندك ميزانية؟ خلّها تذهب للفرصة الأنسب.":"Have a budget? Put it into the best-fit opportunity."}</h2><p>{ar?"ابدأ بدون عقود طويلة أو مشروع إعداد معقد.":"Start without a long implementation project."}</p></div><div className="cta-actions"><Link className="button button-light large" href={localePath(locale,"campaigns/new")}>{ar?"أنشئ أول حملة":"Create first campaign"}</Link><Link className="button button-outline-light large" href={localePath(locale,"opportunities/new")}>{ar?"أضف فرصة":"List inventory"}</Link></div></div></section>
  </>;
}
