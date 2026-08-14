-- Optional seed skeleton. V2 already contains built-in demo data when DATABASE_URL is empty.
-- Run schema.sql first. For a real environment, create users through /api/auth/sign-up so passwords are hashed by the application.

INSERT INTO organizations (id,name_ar,name_en,org_type,city,verification_status)
VALUES
('11111111-1111-1111-1111-111111111111','بودكاست مدار التقنية','Tech Orbit Podcast','media','Riyadh','verified'),
('22222222-2222-2222-2222-222222222222','ملتقى التقنية والأمن','Technology & Security Forum','rights_holder','Riyadh','verified')
ON CONFLICT (id) DO NOTHING;

INSERT INTO opportunities (id,organization_id,category,title_ar,title_en,description_ar,description_en,city,starting_price,estimated_reach,audience_json,format_json,verification_status,status,featured,trust_score,availability_score,performance_score)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','podcasts','رعاية 4 حلقات في بودكاست تقني سعودي','Sponsor 4 episodes of a Saudi technology podcast','حزمة صوتية ورقمية لصناع القرار التقنيين.','Audio and digital package for technology decision makers.','Riyadh',24000,92000,'["Technology","Professionals","Founders"]','["Host-read","Social clip","Newsletter"]','verified','published',true,92,95,90),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','22222222-2222-2222-2222-222222222222','events','شريك رئيسي لملتقى الأمن السيبراني 2026','Cybersecurity Forum 2026 — Main Partner','رعاية رئيسية بحضور تنفيذي وحقوق ظهور.','Main sponsorship with executive audience and brand rights.','Riyadh',85000,24000,'["CIO","CISO","IT Leaders","Government"]','["Stage","Booth","Branding","Leads"]','verified','published',true,96,88,84)
ON CONFLICT (id) DO NOTHING;
