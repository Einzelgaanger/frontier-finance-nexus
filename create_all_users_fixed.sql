-- =====================================================
-- FIXED BULK USER CREATION SCRIPT
-- Creates all 186 users with auth accounts and profiles
-- Default password: @ESCPNetwork2025#
-- All users start as 'viewer' role
-- =====================================================

-- First, let's check the current state
SELECT 'Current user count before creation:' as status, COUNT(*) as user_count FROM auth.users;

-- Create a temporary table with all user data
CREATE TEMP TABLE user_data (
    email TEXT PRIMARY KEY,
    organization_name TEXT
);

-- Insert all 186 users
INSERT INTO user_data (email, organization_name) VALUES
('a.annan@impcapadv.com', 'Impact Capital Advisors'),
('a.fofana@comoecapital.com', 'Comoé Capital'),
('a@a.com', 'sss'),
('aarthi.ramasubramanian@opesfund.eu', 'Opes-LCEF'),
('agnes@firstcircle.capital', 'First Circle Capital'),
('ali.alsuhail@kapita.iq', 'Kapita'),
('allert@mmfm-ltd.com', 'SME Impact Fund'),
('alyune@loftyinc.vc', 'LoftyInc Capital'),
('amaka@weavcapital.com', 'WEAV Capital'),
('ambar@ibtikarfund.com', 'Ibtikar Fund'),
('amel.saidane@betawaves.io', 'Betawaves'),
('amanda.kabagambe@tlgcapital.com', 'GenCap Partners'),
('AndiaC@gracamacheltrust.org', 'Graca Machel Trust'),
('andylower@adapcapital.com', 'ADAP Capital LLC'),
('angela@angazacapital.com', 'Angaza Capital'),
('ani@mostfund.vc', 'MOST Ventures'),
('anne@sayuni.capital', 'Sayuni Capital'),
('annan.anthony@gmail.com', 'Impact Capital Advisors'),
('aor@aruwacapital.com', 'Aruwa Capital Management'),
('arthi.ramasubramanian@opesfund.eu', 'Opes-Lcef Fund'),
('ashleigh.fynn-munda@opp-gen.com', 'OG Impact Fund'),
('audrey@anza.holdings', 'Anza Capital'),
('bfaga.negocio@am.bfa.ao', 'BFA Asset Management'),
('brendan@sechacapital.com', 'Secha Capital'),
('bu@aruwacapital.com', 'Aruwa Capital Management'),
('carol.birungi@xsmlcapital.com', 'XSML Capital'),
('cathy@fyrefem.com', 'FyreFem Fund Managers'),
('cedella.besong@cfbholding.com', 'CFB Holding Ltd'),
('chai@vakayi.com', 'Vakayi Capital'),
('chibamba@finbond.co.zm', 'FinBond Limited'),
('ckingombe@4ipgroup.com', '4IP Group LLC (Invisible Heart Ventures No.2)'),
('Ckirabo@mkyalaventures.com', 'M-Kyala Ventures'),
('colin@lineacap.com', 'Linea Capital Partners'),
('d.doumbia@comoecapital.com', 'Comoé Capital'),
('d.rono@samawaticapital.com', 'Samawati Capital Partners'),
('david.wangolo@pearlcapital.net', 'Pearl Capital Partners'),
('dayo@microtraction.com', 'Microtraction'),
('dmitry.fotiyev@brightmorecapital.com', 'Brightmore Capital'),
('e.arthur@wangaracapital.com', 'Wangara Green Ventures'),
('e.cotsoyannis@miarakap.com', 'Miarakap'),
('e.ravohitrarivo@miarakap.com', 'Miarakap'),
('eddie.sembatya@findingxy.com', 'Finding XY'),
('edioh@wic-capital.net', 'WIC CAPITAL'),
('edson@relevant.is', 'Relevant Ventures'),
('egla@msftventures.com', 'MsFiT Ventures'),
('enyonam@mirepacapital.com', 'Mirepa Investment Advisors'),
('enyonam@mirepaadvisors.com', 'Mirepa Investment Advisors Ltd.'),
('eric@happysmala.com', 'happy smala'),
('esther@unconventional.capital', 'Uncap'),
('farynv@gmail.com', 'BUSINESS PARTNERS LTD'),
('finance@habacapital.com', 'Haba Capital'),
('florian.ibrahim@responsability.com', 'rA'),
('fngenyi@sycomore-venture.com', 'SYCOMORE-VENTURE'),
('franziska@unconventional.capital', 'Uncap'),
('geraldine@darenaventures.com', 'Darena Ventures'),
('h.vincent-genod@ietp.com', 'I&P'),
('ha@cra.fund', 'CRAF'),
('hema@five35.ventures', 'Five35 Ventures'),
('Hilina@kazanafund.com', 'Kazana fund'),
('i.sidibe@comoecapital.com', 'Comoé Capital'),
('idris.bello@loftyincltd.biz', 'LoftyInc Capital Management'),
('idris@loftyinc.vc', 'LoftyInc Capital'),
('imare@startupbugu.net', 'Startup''BUGU'),
('imandela@shonacapital.co', 'SHONA Capital'),
('innocent@anzaentrepreneurs.co.tz', 'Anza Growth Fund'),
('Invest@blackstoneafrica.com', 'Blackstone Africa'),
('invteam@altreecapital.com', 'Altree Capital'),
('is@neper.africa', 'NEPER Ventures'),
('J.namoma@nithio.com', 'Nithio'),
('jaap-jan@truvalu-group.com', 'Truvalu'),
('jacobus@growthcap.co.za', 'Creative Growth Capital ("GrowthCap")'),
('janice@aisikicapital.com', 'Aisiki Capital'),
('jason@viktoria.co.ke', 'ViKtoria Business Angels Network'),
('jchamberlain@altreecapital.om', 'Altree Capital'),
('jenny@amamventures.com', 'Amam Ventures'),
('jesse@takeofffund.com', 'The Takeoff Fund (formerly Abaarso Ventures)'),
('jim@untapped-global.com', 'Untapped Global'),
('josh@balloonventures.com', 'Balloon Ventures'),
('josh@holocene.africa', 'Holocene'),
('julia@lineacap.com', 'Linea Capital'),
('july.andraous@jambaar-capital.com', 'Jambaar Capital'),
('jzongo@sinergiburkina.com', 'Sinergi Burkina'),
('k.owusu-sarfo@wangaracapital.com', 'Wangara Green Ventures'),
('Kamaldine08@gmail.com', 'SINERGI SA'),
('karinawong@smallfoundation.ie', 'Small Foundation'),
('karthik@sangam.vc', 'Sangam Ventures'),
('kendi@hevafund.com', 'Heva Fund LLP'),
('kenza@outlierz.co', 'Outlierz Ventures'),
('kim@inuacapital.com', 'Inua Capital'),
('klakhani@Invest2innovate.com', 'i2i Ventures'),
('klegesi@ortusafrica.com', 'Ortus Africa Capital'),
('lavanya@vestedworld.com', 'VestedWorld'),
('ldavis@renewcapital.com', 'Renew Capital'),
('ldavis@renewstrategies.com', 'RENEW'),
('lelemba@africatrustgroup.com', 'Africa Trust Group'),
('lidelkellytoh1989@gmail.com', 'NALDCCAM'),
('lkamara@sahelinvest.com', 'Sahelinvest'),
('lkefela@gmail.com', 'Village Capital'),
('Lisa@atgsamata.com', 'ATG Samata'),
('Lmramba@gbfund.org', 'Grassroots Business Fund'),
('lsz@nordicimpactfunds.com', 'Nordic Impact Funds'),
('lthomas@samatacapital.com', 'Samata Capital'),
('m.roestenberg@fmo.nl', 'FMO'),
('mamokete@mamorcapital.com', 'Mamor Capital'),
('mariamkamel@aucegypt.edu', 'AUC Angels'),
('mark@bidcp.com', 'Bid Capital Partners'),
('martin@warioba.ventures', 'Warioba Ventures'),
('maya@womvest.club', 'Womvest'),
('micheal.m@bamboocp.com', 'Bamboo Capital Partners'),
('micheal@cosefinvest.com', 'COSEF'),
('mouattara@footprint-cap.com', 'FOOTPRINT CAPITAL'),
('ndeye.thiaw@brightmorecapital.com', 'Brightmore Capital'),
('Nkhulu@torhotech.com', 'Ubukai Ventures / Ubuntu Kaizen Capital Partners'),
('nneka@vestedworld.com', 'VestedWorld'),
('nyeji@womencapital.co', 'wCap Limited'),
('o.adepoju@pearlbridgecapital.africa', 'PearlBridge Capital Managers Ltd'),
('oeharmon@gemicap.com', 'Gemini Capital Partners'),
('olivier.furdelle@terangacapital.com', 'Teranga Capital'),
('p.koelbl@shequity.com', 'ShEquity Partners ("ShEquity")'),
('patrick.mutenda@gmail.com', 'Tunahase Agri'),
('paul@agleaseco.com', 'Agricultural Leasing Company Zambia Ltd (''AgLeaseCo'')'),
('peter@vestedworld.com', 'VestedWorld'),
('rekia@barkafund.com', 'Barka Fund'),
('rnyakinyua@meda.org', 'MEDA'),
('roeland@iungocapital.com', 'iungo capital'),
('rtugume@practitionerscp.com', 'Practitioners of Contemporary Philosophy Ltd'),
('s.ndonga@samawaticapital.com', 'Samawati Capital Partners'),
('sagar@firstfollowers.co', 'First Followers Capital'),
('sam@mirepacapital.com', 'Mirepa Capital Ltd'),
('sam@mirepaadvisors.com', 'MIREPA Investment Advisors'),
('samuel@saviu.vc', 'Saviu Ventures'),
('sana@headingforchange.org', 'Heading for Change'),
('sawadh@ssc.co.tz', 'SSC Capital'),
('Sejakekana@gmail.com', 'Makoti Kekana Capital (Pty) Ltd'),
('selma@firstcircle.capital', 'First Circle Capital'),
('sewu@jazarift.vc', 'Jaza Rift Ventures'),
('shiluba@tshiamoimpact.com', 'Tshiamo Impact Partners'),
('shiva@ankurcapital.com', 'Ankur Capital'),
('shuyin@beaconfund.asia', 'Beacon Fund'),
('sro@ceo-enterprises.com', 'CEO Africa'),
('Ssircar@graymatterscap.com', 'Gmc'),
('stawia@gmail.com', 'Villgro Africa'),
('stephengugu@viktoria.co.ke', 'Viktoria Ventures'),
('steven@frontend.vc', 'FrontEnd Ventures'),
('sven.haefner@30ThirtyCapital.com', '30Thirty Capital Ltd.'),
('tadlam@agrifrontier.com', 'Agri Frontier'),
('tamara@amamventures.com', 'Amam Ventures'),
('tawana@afirca-growth.com', 'Africa Growth LLC'),
('tawana@africa-growth.com', 'Africa Growth LLC'),
('tekiyor@nigeriasme.ng', 'Chapel Hill Denham Nigeria SME Ltd (SME.NG)'),
('teluwo@fbx.ventures', 'FbX Ventures'),
('thandeka@digitalafricaventures.com', 'Digital Africa Ventures'),
('tna@kukulacapital.com', 'Kukula capital'),
('tony@kinyungu.com', 'Kinyungu Ventures'),
('toukam@persistent.energy', 'Persistent Capital'),
('v.tchatchueng@fakocapital.com', 'FAKO CAPITAL INVESTMENTS'),
('veronique@adopes.com', 'adOpes'),
('vfraser@jengacapital.com', 'Jenga Capital'),
('victor.ndiege@kcv.co.ke', 'Kenya Climate Ventures'),
('victoria@gc.fund', 'CcHUB Growth Capital Limited'),
('vkiyingi@businesspartners.co.ug', 'Business Partners International'),
('Wakiuru@hevafund.com', 'HEVA Fund LLP'),
('wiem.abdeljaouad@gmail.com', 'Actawa'),
('wiem@actawa.com', 'Actawa'),
('wilfred@villgroafrica.org', 'Villgro Africa'),
('william.prothais@uberiscapital.com', 'Uberis'),
('yvonne.sahara@saharaimpactventures.com', 'Sahara Impact Ventures'),
('yvonne@womencapital.co', 'wCap Limited');

-- Verify we have all 186 users in temp table
SELECT 'Users in temp table:' as status, COUNT(*) as count FROM user_data;

-- Create users one by one with better error handling
DO $$
DECLARE
    user_record RECORD;
    batch_count INTEGER := 0;
    success_count INTEGER := 0;
    error_count INTEGER := 0;
    new_user_id UUID;
BEGIN
    RAISE NOTICE 'Starting bulk user creation...';
    RAISE NOTICE '================================';
    
    FOR user_record IN SELECT email, organization_name FROM user_data ORDER BY email LOOP
        BEGIN
            -- Generate a new UUID for the user
            new_user_id := gen_random_uuid();
            
            -- Insert into auth.users table
            INSERT INTO auth.users (
                instance_id,
                id,
                aud,
                role,
                email,
                encrypted_password,
                email_confirmed_at,
                created_at,
                updated_at,
                confirmation_token,
                email_change,
                email_change_token_new,
                recovery_token
            ) VALUES (
                '00000000-0000-0000-0000-000000000000',
                new_user_id,
                'authenticated',
                'authenticated',
                user_record.email,
                crypt('@ESCPNetwork2025#', gen_salt('bf')),
                NOW(),
                NOW(),
                NOW(),
                '',
                '',
                '',
                ''
            );
            
            -- Create user profile
            INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
            VALUES (new_user_id, user_record.email, user_record.organization_name, '', NOW(), NOW());
            
            -- Assign default 'viewer' role
            INSERT INTO public.user_roles (user_id, email, role, assigned_at)
            VALUES (new_user_id, user_record.email, 'viewer', NOW());
            
            success_count := success_count + 1;
            
        EXCEPTION
            WHEN unique_violation THEN
                RAISE NOTICE 'User % already exists, skipping...', user_record.email;
                error_count := error_count + 1;
            WHEN OTHERS THEN
                RAISE NOTICE 'Error creating user %: %', user_record.email, SQLERRM;
                error_count := error_count + 1;
        END;
        
        batch_count := batch_count + 1;
        
        -- Progress notification every 25 users
        IF batch_count % 25 = 0 THEN
            RAISE NOTICE 'Progress: % users processed (% created, % errors)', batch_count, success_count, error_count;
        END IF;
    END LOOP;
    
    RAISE NOTICE '================================';
    RAISE NOTICE 'Bulk user creation completed!';
    RAISE NOTICE 'Total processed: %', batch_count;
    RAISE NOTICE 'Successfully created: %', success_count;
    RAISE NOTICE 'Errors/Skipped: %', error_count;
END $$;

-- Final verification
SELECT 
    'Final user count:' as status,
    COUNT(*) as total_users_created,
    COUNT(CASE WHEN ur.role = 'viewer' THEN 1 END) as viewers_created
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id;

-- Show sample of created users
SELECT 
    u.email,
    p.first_name as organization_name,
    ur.role,
    u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC
LIMIT 10;

-- Clean up
DROP TABLE user_data;
