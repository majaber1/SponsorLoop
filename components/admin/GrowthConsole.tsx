'use client';

import { useMemo, useState } from 'react';
import type { GrowthDashboard, GrowthLead, GrowthLeadStatus, OutreachStatus } from '@/lib/growth-engine';
import styles from './GrowthConsole.module.css';

type Props = { initial: GrowthDashboard; ar: boolean };

const money = (value: number) => new Intl.NumberFormat('en-SA', { maximumFractionDigits: 0 }).format(value || 0);
const compact = (value: number) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value || 0);

export default function GrowthConsole({ initial, ar }: Props) {
  const [data, setData] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [side, setSide] = useState<'creator' | 'brand'>('creator');

  const t = (a: string, e: string) => (ar ? a : e);
  const creators = data.leads.filter((x) => x.side === 'creator');
  const brands = data.leads.filter((x) => x.side === 'brand');
  const qualified = data.leads.filter((x) => ['qualified', 'invited', 'joined'].includes(x.status)).length;
  const joined = data.leads.filter((x) => x.status === 'joined').length;
  const approvedOutreach = data.outreach.filter((x) => ['approved', 'sent', 'replied', 'joined'].includes(x.status)).length;

  const connectorRows = useMemo(() => [
    ['TikTok Discovery', data.connectors.tiktokDiscovery],
    ['TikTok Messaging', data.connectors.tiktokMessaging],
    ['AI Copy', data.connectors.aiCopy],
    ['Mawthooq', data.connectors.mawthooq],
    ['Auto Send', data.connectors.autoSend],
  ], [data.connectors]);

  async function mutate(payload: Record<string, unknown>, key: string) {
    setBusy(key); setError('');
    try {
      const response = await fetch('/api/admin/growth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Request failed');
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed');
    } finally { setBusy(null); }
  }

  async function createLead(form: HTMLFormElement) {
    const fd = new FormData(form);
    const list = (name: string) => String(fd.get(name) || '').split(',').map((x) => x.trim()).filter(Boolean);
    const number = (name: string) => Number(fd.get(name) || 0);
    const payload = {
      action: 'createLead', side,
      name: String(fd.get('name') || ''), handle: String(fd.get('handle') || '') || undefined,
      platform: String(fd.get('platform') || 'tiktok'), profileUrl: String(fd.get('profileUrl') || '') || undefined,
      source: 'manual', city: String(fd.get('city') || '') || undefined,
      categories: list('categories'), audience: list('audience'), followers: number('followers'), avgViews: number('avgViews'), engagementRate: number('engagementRate'),
      rateMin: side === 'creator' ? number('min') : 0, rateMax: side === 'creator' ? number('max') : 0,
      budgetMin: side === 'brand' ? number('min') : 0, budgetMax: side === 'brand' ? number('max') : 0,
      mawthooqStatus: side === 'brand' ? 'not_required' : 'unknown', notes: String(fd.get('notes') || '') || undefined,
    };
    await mutate(payload, 'create');
    form.reset();
  }

  function verifyLead(lead: GrowthLead) {
    const reference = window.prompt(t('أدخل مرجع/رقم تحقق موثوق أو رابط التحقق', 'Enter Mawthooq verification reference or verification URL'), lead.mawthooqReference || '');
    if (!reference) return;
    mutate({ action: 'updateLead', id: lead.id, mawthooqStatus: 'verified', mawthooqReference: reference }, `verify:${lead.id}`);
  }

  function setLeadStatus(id: string, status: GrowthLeadStatus) {
    mutate({ action: 'updateLead', id, status }, `lead:${id}:${status}`);
  }

  function outreach(id: string, status: OutreachStatus) {
    mutate({ action: 'updateOutreach', id, status }, `out:${id}:${status}`);
  }

  return <div className={styles.shell} dir={ar ? 'rtl' : 'ltr'}>
    <section className={styles.hero}>
      <div>
        <span className={styles.eyebrow}>SponsorLoop Growth Engine</span>
        <h1>{t('مركز اكتساب الرعاة وصناع المحتوى', 'Sponsor & creator acquisition control center')}</h1>
        <p>{t('اكتشاف، تأهيل، تواصل، مطابقة وامتثال في مسار واحد. الإرسال الخارجي يبقى بموافقة بشرية حتى يتم ربط TikTok Business APIs رسميًا.', 'Discover, qualify, outreach, match and verify in one workflow. External sending stays human-approved until official TikTok Business APIs are connected.')}</p>
      </div>
      <div className={styles.heroBadge}><b>{data.connectors.tiktokDiscovery === 'connected' ? t('TikTok متصل','TikTok connected') : t('TikTok API بانتظار الربط','TikTok API gated')}</b><small>{t('لا يوجد scraping أو إرسال عشوائي','No scraping or blind outreach')}</small></div>
    </section>

    {error && <div className={styles.error}>{error}</div>}

    <section className={styles.kpis}>
      <Kpi label={t('مبدعون','Creators')} value={creators.length} />
      <Kpi label={t('رعاة محتملون','Brand leads')} value={brands.length} />
      <Kpi label={t('مؤهلون','Qualified')} value={qualified} />
      <Kpi label={t('انضموا','Joined')} value={joined} />
      <Kpi label={t('رسائل جاهزة/مرسلة','Outreach active')} value={approvedOutreach} />
      <Kpi label={t('أفضل تطابق','Top match')} value={data.matches[0] ? `${data.matches[0].score}%` : '—'} />
    </section>

    <section className={styles.agentGrid}>
      {data.agents.map((agent) => <article key={agent.id} className={styles.agentCard}><div className={styles.agentTop}><strong>{agent.name}</strong><span data-state={agent.status}>{agent.status}</span></div><p>{agent.purpose}</p></article>)}
    </section>

    <section className={styles.twoCol}>
      <article className={styles.panel}>
        <div className={styles.panelHead}><div><span className={styles.eyebrow}>{t('الموصلات','Connectors')}</span><h2>{t('جاهزية القنوات','Channel readiness')}</h2></div></div>
        <div className={styles.connectorList}>{connectorRows.map(([name, state]) => <div key={name}><span>{name}</span><b data-state={state}>{state}</b></div>)}</div>
      </article>
      <article className={styles.panel}>
        <div className={styles.panelHead}><div><span className={styles.eyebrow}>Funnel</span><h2>{t('قمع النمو','Growth funnel')}</h2></div></div>
        <div className={styles.funnel}>{Object.entries(data.funnel).map(([key, value]) => <div key={key}><b>{value}</b><span>{key}</span></div>)}</div>
      </article>
    </section>

    <section className={styles.panel}>
      <div className={styles.panelHead}><div><span className={styles.eyebrow}>{t('إدخال مرشح','Lead intake')}</span><h2>{t('أضف مبدعًا أو راعيًا محتملاً','Add a creator or sponsor lead')}</h2></div><div className={styles.segment}><button className={side === 'creator' ? styles.active : ''} onClick={() => setSide('creator')}>{t('مبدع','Creator')}</button><button className={side === 'brand' ? styles.active : ''} onClick={() => setSide('brand')}>{t('راعي','Brand')}</button></div></div>
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); createLead(e.currentTarget); }}>
        <input name="name" required placeholder={t('الاسم','Name')} />
        <input name="handle" placeholder="@handle" />
        <select name="platform" defaultValue="tiktok"><option value="tiktok">TikTok</option><option value="instagram">Instagram</option><option value="youtube">YouTube</option><option value="linkedin">LinkedIn</option><option value="other">Other</option></select>
        <input name="profileUrl" type="url" placeholder="https://..." />
        <input name="city" placeholder={t('المدينة','City')} />
        <input name="categories" placeholder={t('القطاعات: gaming, food','Categories: gaming, food')} />
        <input name="audience" placeholder={t('الجمهور: 18-34, Riyadh','Audience: 18-34, Riyadh')} />
        <input name="followers" type="number" min="0" placeholder={t('المتابعون','Followers')} />
        <input name="avgViews" type="number" min="0" placeholder={t('متوسط المشاهدات','Avg views')} />
        <input name="engagementRate" type="number" min="0" max="100" step="0.1" placeholder={t('التفاعل %','Engagement %')} />
        <input name="min" type="number" min="0" placeholder={side === 'creator' ? t('أقل سعر','Minimum rate') : t('أقل ميزانية','Minimum budget')} />
        <input name="max" type="number" min="0" placeholder={side === 'creator' ? t('أعلى سعر','Maximum rate') : t('أعلى ميزانية','Maximum budget')} />
        <input name="notes" placeholder={t('ملاحظات','Notes')} />
        <button disabled={busy === 'create'}>{busy === 'create' ? t('جاري الحفظ...','Saving...') : t('إضافة وتأهيل','Add & qualify')}</button>
      </form>
    </section>

    <section className={styles.panel}>
      <div className={styles.panelHead}><div><span className={styles.eyebrow}>Scout Queue</span><h2>{t('المرشحون المكتشفون','Discovered leads')}</h2></div><small>{t('الدرجة تجمع النشاط، التفاعل، الملاءمة التجارية والامتثال','Score combines activity, engagement, commercial fit and compliance')}</small></div>
      <div className={styles.tableWrap}><table><thead><tr><th>{t('الحساب','Lead')}</th><th>{t('نوع','Side')}</th><th>{t('مؤشرات','Signals')}</th><th>{t('سعر/ميزانية','Rate / budget')}</th><th>{t('موثوق','Mawthooq')}</th><th>{t('درجة','Score')}</th><th>{t('حالة','Status')}</th><th>{t('إجراء','Action')}</th></tr></thead><tbody>{data.leads.map((lead) => <tr key={lead.id}><td><strong>{lead.name}</strong><small>{lead.handle || lead.profileUrl || lead.platform}</small></td><td>{lead.side}</td><td><span>{compact(lead.followers)} followers</span><small>{compact(lead.avgViews)} views · {lead.engagementRate}% ER</small></td><td>{lead.side === 'creator' ? `${money(lead.rateMin)}–${money(lead.rateMax)} SAR` : `${money(lead.budgetMin)}–${money(lead.budgetMax)} SAR`}</td><td><span className={styles.status} data-state={lead.mawthooqStatus}>{lead.mawthooqStatus}</span></td><td><b className={styles.score}>{lead.qualificationScore}</b></td><td><span className={styles.status} data-state={lead.status}>{lead.status}</span></td><td><div className={styles.actions}>{lead.side === 'creator' && lead.mawthooqStatus !== 'verified' && <button onClick={() => verifyLead(lead)} disabled={Boolean(busy)}>{t('تحقق موثوق','Verify')}</button>}<button onClick={() => mutate({ action: 'draftOutreach', leadId: lead.id, channel: lead.platform === 'linkedin' ? 'linkedin' : lead.platform === 'tiktok' ? 'tiktok' : 'manual' }, `draft:${lead.id}`)} disabled={Boolean(busy)}>{t('صياغة تواصل','Draft')}</button>{lead.status === 'discovered' && <button onClick={() => setLeadStatus(lead.id, 'qualified')}>{t('تأهيل','Qualify')}</button>}</div></td></tr>)}</tbody></table></div>
    </section>

    <section className={styles.twoCol}>
      <article className={styles.panel}>
        <div className={styles.panelHead}><div><span className={styles.eyebrow}>Outreach Copilot</span><h2>{t('طابور التواصل','Outreach queue')}</h2></div><small>{t('لا يتم الإرسال آليًا من هذه النسخة','No automatic sending in this release')}</small></div>
        <div className={styles.stack}>{data.outreach.length === 0 && <Empty text={t('أنشئ مسودة من أحد المرشحين','Draft outreach from any lead')} />}{data.outreach.map((item) => <div key={item.id} className={styles.outreach}><div><strong>{item.leadName}</strong><span className={styles.status} data-state={item.status}>{item.status}</span></div><p>{ar ? item.messageAr : item.messageEn}</p><small>{item.channel}</small><div className={styles.actions}>{item.status === 'draft' && <button onClick={() => outreach(item.id, 'approved')}>{t('اعتماد','Approve')}</button>}{item.status === 'approved' && <button onClick={() => outreach(item.id, 'sent')}>{t('تأكيد تم الإرسال','Mark sent')}</button>}{item.status === 'sent' && <button onClick={() => outreach(item.id, 'replied')}>{t('ردّ','Replied')}</button>}{['approved','sent','replied'].includes(item.status) && <button onClick={() => outreach(item.id, 'joined')}>{t('انضم للمنصة','Joined')}</button>}</div></div>)}</div>
      </article>

      <article className={styles.panel}>
        <div className={styles.panelHead}><div><span className={styles.eyebrow}>Matchmaker</span><h2>{t('أفضل التطابقات','Best matches')}</h2></div><small>{t('الميزانية + القطاع + الجمهور + الموقع + الامتثال','Budget + category + audience + geography + compliance')}</small></div>
        <div className={styles.stack}>{data.matches.slice(0, 12).map((match) => <div key={match.id} className={styles.match}><div className={styles.matchTop}><strong>{match.brandName} ↔ {match.creatorName}</strong><b>{match.score}%</b></div><div className={styles.budget}>{t('الميزانية المقترحة','Suggested budget')}: <strong>{money(match.suggestedBudget)} SAR</strong></div><ul>{(ar ? match.reasonsAr : match.reasonsEn).map((r) => <li key={r}>{r}</li>)}</ul></div>)}</div>
      </article>
    </section>

    <section className={styles.policy}>
      <strong>{t('قاعدة التشغيل','Operating rule')}</strong>
      <p>{t('الـAgents يكتشفون ويصنفون ويكتبون ويقترحون. أي دعوة خارجية تبقى بموافقة بشرية، وأي Creator يدخل حملة في السعودية يمر عبر بوابة التحقق من متطلبات موثوق والإفصاح الإعلاني قبل التفعيل.', 'Agents discover, qualify, draft and recommend. External outreach stays human-approved, and Saudi creator activations pass a Mawthooq/electronic-ad compliance gate before activation.')}</p>
    </section>
  </div>;
}

function Kpi({ label, value }: { label: string; value: number | string }) { return <div className={styles.kpi}><small>{label}</small><strong>{value}</strong></div>; }
function Empty({ text }: { text: string }) { return <div className={styles.empty}>{text}</div>; }
