/**
 * DIGIVAULT i18n.js - Internationalisation Engine
 * Languages: English (en), Kurdish Sorani (ku), Arabic (ar)
 */

/* ── 1. TRANSLATION DICTIONARY ─────────────────────────── */
const TRANSLATIONS = {
  /* SHARED: Navbar */
  'nav.home':              { en:'Home',            ku:'سەرەکی',              ar:'الرئيسية' },
  'nav.features':          { en:'Features',        ku:'تایبەتمەندییەکان',    ar:'المميزات' },
  'nav.howItWorks':        { en:'How It Works',    ku:'چۆن کاردەکات',       ar:'كيف يعمل' },
  'nav.contact':           { en:'Contact',         ku:'پەیوەندی',            ar:'تواصل معنا' },
  'nav.accounts':          { en:'Accounts',        ku:'ئەکاونتەکان',         ar:'الحسابات' },
  'nav.account':           { en:'Account',         ku:'ئەکاونت',             ar:'الحساب' },
  'nav.dashboard':         { en:'My Dashboard',    ku:'داشبۆردەکەم',         ar:'لوحتي' },
  'nav.accounts.arrow':    { en:'Accounts →',      ku:'← ئەکاونتەکان',       ar:'← الحسابات' },

  /* INDEX: Hero */
  'hero.badge':      { en:'#1 Digital Technology Marketplace', ku:'ژمارە ١ی بازاڕی تەکنەلۆجیای دیجیتاڵ', ar:'السوق الرقمي التقني الأول' },
  'hero.title':      { en:'Buy &amp; Sell <span class="highlight">Digital Assets</span> Safely &amp; Easily',
                       ku:'داراییەکانی <span class="highlight">دیجیتاڵ</span> بکڕە و بفرۆشە بە ئاسانی',
                       ar:'اشترِ وبِع <span class="highlight">الأصول الرقمية</span> بكل أمان وسهولة' },
  'hero.desc':       { en:'The most trusted platform for trading game accounts, website templates, and digital assets. Safe transactions, verified listings, and lightning-fast deals — all in one place.',
                       ku:'باوەڕپێکراوترین پلاتفۆرم بۆ مامەڵەی ئەکاونتی یاری، قاڵبی مالپەڕ، و داراییە دیجیتاڵەکان. مامەڵەی پارێزراو، لیستکردنی دڵنیاکراو، و مامەڵەی خێرا — هەموو لەیەک شوێن.',
                       ar:'المنصة الأكثر موثوقية لتداول حسابات الألعاب والقوالب والأصول الرقمية. معاملات آمنة، قوائم موثقة، وصفقات فائقة السرعة — كل ذلك في مكان واحد.' },
  'hero.getStarted': { en:'🚀 Get Started', ku:'🚀 دەستپێبکە',   ar:'🚀 ابدأ الآن' },
  'hero.learnMore':  { en:'Learn More ↓',  ku:'زیاتر بزانە ↓', ar:'اعرف المزيد ↓' },

  /* Mockup */
  'mockup.badge': { en:'⭐ Legendary',          ku:'⭐ ئەفسانەیی',           ar:'⭐ أسطوري' },
  'mockup.title': { en:'Ace Dominator Account', ku:'ئەکاونتی Ace Dominator', ar:'حساب Ace Dominator' },
  'mockup.level': { en:'🏆 Level 82',           ku:'🏆 ئاستی ٨٢',           ar:'🏆 المستوى 82' },
  'mockup.guns':  { en:'🔫 All Items Maxed',    ku:'🔫 هەموو ئایتەمەکان',   ar:'🔫 جميع العناصر محسّنة' },
  'mockup.btn':   { en:'View Account →',        ku:'← بینینی ئەکاونت',       ar:'← عرض الحساب' },
  'mockup.price': { en:'325,000 IQD',           ku:'٣٢٥,٠٠٠ د.ع',            ar:'325,000 د.ع' },

  /* Floating badges */
  'badge.secure':     { en:'Secure Payment',      ku:'پارەدانی پارێزراو', ar:'دفع آمن' },
  'badge.secureDesc': { en:'Escrow protected',    ku:'پارێزراوی Escrow',  ar:'محمي بنظام الضمان' },
  'badge.fast':       { en:'Fast Transfer',       ku:'گواستنەوەی خێرا',   ar:'نقل سريع' },
  'badge.fastDesc':   { en:'Avg. 2 hrs delivery', ku:'بەرەنجامی ٢ کاتژمێر', ar:'متوسط التسليم ٢ ساعة' },

  /* Features */
  'features.tag':   { en:'Why Choose Us',   ku:'بۆچی ئێمە هەڵبژێرە',  ar:'لماذا تختارنا' },
  'features.title': { en:'Built for Buyers,<br>Trusted by Thousands',
                      ku:'دروستکراو بۆ کڕیاران،<br>باوەڕپێکراو لەلایەن هەزاران کەس',
                      ar:'مصمَّم للمشترين،<br>موثوق به من الآلاف' },
  'features.sub':   { en:'Every feature is designed to make your trading experience safe, fast, and completely hassle-free.',
                      ku:'هەر تایبەتمەندییەک دیزاین کراوە بۆ ئەوەی ئەزموونی مامەڵەکەت پارێزراو، خێرا، و بێ کێشە بکات.',
                      ar:'كل ميزة مصمَّمة لجعل تجربة تداولك آمنة وسريعة وخالية تمامًا من المتاعب.' },

  'feature.secure.title':  { en:'Secure Trading',   ku:'مامەڵەی پارێزراو',      ar:'تداول آمن' },
  'feature.secure.desc':   { en:'All transactions are protected by our escrow system. Funds are only released after the buyer confirms a successful account transfer.',
                             ku:'هەموو مامەڵەکان بە سیستەمی escrow پارێزراون. پارە تەنها دەدرێتەوە کاتێک کڕیار گواستنەوەی سەرکەوتووی ئەکاونت دڵنیا دەکاتەوە.',
                             ar:'جميع المعاملات محمية بنظام الضمان. لا يُصرف المال إلا بعد تأكيد المشتري لنجاح نقل الحساب.' },
  'feature.fast.title':    { en:'Fast Listings',    ku:'لیستکردنی خێرا',        ar:'إدراج سريع' },
  'feature.fast.desc':     { en:'Create and publish your account listing in under 2 minutes. Our streamlined form makes selling quick and effortless.',
                             ku:'لیستکردنی ئەکاونتەکەت لە کەمتر لە ٢ خولەک دروست بکە و بڵاوبکەرەوە. فۆرمەکەمان فرۆشتن خێرا و ئاسان دەکات.',
                             ar:'أنشئ قائمة حسابك وانشرها في أقل من دقيقتين. نموذجنا المبسَّط يجعل البيع سريعًا وسهلًا.' },
  'feature.trusted.title': { en:'Trusted Platform', ku:'پلاتفۆرمی باوەڕپێکراو', ar:'منصة موثوقة' },
  'feature.trusted.desc':  { en:'Every seller is verified and every listing is reviewed. Buyer protection and a dispute resolution team always have your back.',
                             ku:'هەموو فرۆشیار پشتڕاستکراوە و هەموو لیستێک پێداچوونەوەی تێدا کراوە. پاراستنی کڕیار و تیمی چارەسەرکردنی کێشە هەمیشە پشتیوانیت دەکەن.',
                             ar:'كل بائع موثَّق وكل قائمة مراجعة. فريق حماية المشترين وحل النزاعات دائمًا في صفّك.' },
  'feature.easy.title':    { en:'Easy to Use',    ku:'ئاسانی بەکارهێنان',  ar:'سهل الاستخدام' },
  'feature.easy.desc':     { en:'A clean, intuitive interface means you can browse, buy, and sell without any friction — on desktop or mobile.',
                             ku:'ڕووکارێکی پاک و ئینتووتیڤ واتایە دەتوانیت بگەڕێیت، بکڕیت، و بفرۆشیت بە هیچ ئازاریەک — لەسەر کۆمپیوتەر یان مۆبایل.',
                             ar:'واجهة نظيفة وبديهية تتيح لك التصفح والشراء والبيع دون أي عوائق — على سطح المكتب أو الجوال.' },

  /* DV Coin */
  'tccoin.tag':    { en:'Platform Currency',   ku:'دراوی پلاتفۆرم',        ar:'عملة المنصة' },
  'tccoin.title':  { en:'Introducing DV Coin', ku:'پێشکەشکردنی DV Coin',    ar:'تقديم DV Coin' },
  'tccoin.sub':    { en:'Use DV Coin to promote your listings and boost visibility. Earn coins by posting, selling, and engaging with the community.',
                     ku:'DV Coin بەکار بهێنە بۆ پرۆمۆتکردنی لیستەکانت و زیادکردنی بینین. کۆین بکۆڵەوە لە ڕێگەی پۆستکردن، فرۆشتن، و بەشداریکردن لە کۆمەڵگا.',
                     ar:'استخدم DV Coin لترويج قوائمك وزيادة ظهورها. اكسب عملات عن طريق النشر والبيع والمشاركة في المجتمع.' },
  'tccoin.feat1.title': { en:'Promote Listings',   ku:'پرۆمۆتکردنی لیستەکان', ar:'ترويج القوائم' },
  'tccoin.feat1.desc':  { en:'Spend 5 DV Coin to feature your listing at the top of search results for 24 hours.',
                          ku:'٥ DV Coin خەرج بکە بۆ ئەوەی لیستەکەت ٢٤ کاتژمێر لەسەر ژوری ئەنجامی گەڕان بخرێتەوە.',
                          ar:'أنفق 5 DV Coin لعرض قائمتك في أعلى نتائج البحث لمدة 24 ساعة.' },
  'tccoin.feat2.title': { en:'Earn by Selling',    ku:'کۆینی کۆبکەرەوە',      ar:'اكسب من البيع' },
  'tccoin.feat2.desc':  { en:'Receive DV Coin rewards automatically after each successful sale on the platform.',
                          ku:'DV Coin خەڵاتی وەربگرە بە شێوەیەکی ئۆتۆماتیکی دوای هەر فرۆشتنی سەرکەوتووی لەسەر پلاتفۆرم.',
                          ar:'احصل على مكافآت DV Coin تلقائيًا بعد كل عملية بيع ناجحة على المنصة.' },
  'tccoin.feat3.title': { en:'Level Up Faster',    ku:'زووتر ئاستبەرز بە',     ar:'ارتقِ بمستواك بسرعة' },
  'tccoin.feat3.desc':  { en:'Higher levels unlock special badges and priority listing placement on the marketplace.',
                          ku:'ئاستی بەرزتر نیشانی تایبەت و شوێنی پێشەکی لیستکردن لە بازاڕدا ئازاد دەکات.',
                          ar:'تفتح المستويات الأعلى شارات خاصة وأولوية وضع القوائم في السوق.' },

  /* How It Works */
  'hiw.tag':         { en:'Simple Process', ku:'پرۆسەیەکی سادە', ar:'عملية بسيطة' },
  'hiw.title':       { en:'How It Works',   ku:'چۆن کاردەکات',   ar:'كيف يعمل' },
  'hiw.sub':         { en:"Three easy steps — whether you're buying or selling.", ku:'سێ هەنگاوی ئاسان — چ بکڕیت یان بفرۆشیت.', ar:'ثلاث خطوات سهلة — سواء كنت مشتريًا أم بائعًا.' },
  'hiw.step1.title': { en:'Create Account', ku:'ئەکاونت دروست بکە', ar:'إنشاء حساب' },
  'hiw.step1.desc':  { en:'Sign up in seconds and complete your profile to start buying or selling immediately.', ku:'لە چرکەکاندا تۆمار بکە و پرۆفایلەکەت تەواو بکە بۆ دەستپێکردن بە کڕین یان فرۆشتن دەستبەجێ.', ar:'سجِّل في ثوانٍ وأكمل ملفك الشخصي لتبدأ الشراء أو البيع فورًا.' },
  'hiw.step2.title': { en:'List or Browse', ku:'لیست بکە یان بگەڕێ', ar:'أدرج أو تصفَّح' },
  'hiw.step2.desc':  { en:'Sellers post their accounts with details and screenshots. Buyers filter by category, level, or price.', ku:'فرۆشیاران ئەکاونتەکانیان بە وردەکاری و ئەکرانشۆت بڵاو دەکەنەوە. کڕیاران بە پۆل، ئاست، یان نرخ فلتەر دەکەن.', ar:'يعرض البائعون حساباتهم بالتفاصيل وصور الشاشة. يقوم المشترون بالفلترة حسب الفئة أو المستوى أو السعر.' },
  'hiw.step3.title': { en:'Safe Transfer',  ku:'گواستنەوەی پارێزراو', ar:'نقل آمن' },
  'hiw.step3.desc':  { en:'Payment is held securely. Seller transfers the account. Buyer confirms, and funds are released instantly.', ku:'پارە بە پارێزراوی گیراوەتەوە. فرۆشیار ئەکاونتەکە دەگوازێتەوە. کڕیار دڵنیا دەکاتەوە، و پارە دەستبەجێ دەدرێتەوە.', ar:'يُحتجز الدفع بأمان. ينقل البائع الحساب. يؤكد المشتري، وتُصرف الأموال على الفور.' },
  'hiw.step4.title': { en:'Leave a Review', ku:'ڕەزامەندی بڵاو بکەرەوە', ar:'اترك تقييمًا' },
  'hiw.step4.desc':  { en:'Help the community by rating your experience. Great sellers get featured on our platform.', ku:'یارمەتی کۆمەڵگا بدە بە هەڵسەنگاندنی ئەزموونەکەت. فرۆشیارە باشەکان لەسەر پلاتفۆرمەکەمان دەخرێنەژێر رووناکی.', ar:'ساعد المجتمع بتقييم تجربتك. يحظى البائعون المتميزون بمكانة بارزة على منصتنا.' },

  /* Contact */
  'contact.tag':          { en:'Get in Touch',               ku:'پەیوەندی بکە',             ar:'تواصل معنا' },
  'contact.title':        { en:"We'd Love to Hear From You", ku:'خۆشمان دێت لێت بیستین',  ar:'يسعدنا سماعك' },
  'contact.desc':         { en:"Have questions about a listing, need help with a transaction, or want to report an issue? Our support team is here around the clock to assist you.", ku:'پرسیارت هەیە دەربارەی لیستێک؟ تیمی پشتگیریمان ٢٤ کاتژمێر لێرەیە بۆ یارمەتیت.', ar:'هل لديك أسئلة حول قائمة؟ فريق الدعم لدينا متاح على مدار الساعة لمساعدتك.' },
  'contact.livechat':     { en:'Live Chat (24/7 available)', ku:'چات زیندو (٢٤/٧ بەردەستە)', ar:'دردشة مباشرة (متاحة 24/7)' },
  'contact.discord':      { en:'Discord Community Server',  ku:'سێرڤەری کۆمەڵگای Discord',  ar:'خادم مجتمع Discord' },
  'contact.telegram':     { en:'Telegram: @TECHWalletSupport', ku:'تێلێگرام: @TECHWalletSupport', ar:'تلغرام: @TECHWalletSupport' },
  'contact.label.name':   { en:'Name',    ku:'ناو',     ar:'الاسم' },
  'contact.label.email':  { en:'Email',   ku:'ئیمەیل', ar:'البريد الإلكتروني' },
  'contact.label.subject':{ en:'Subject', ku:'بابەت',  ar:'الموضوع' },
  'contact.label.message':{ en:'Message', ku:'نامە',   ar:'الرسالة' },
  'contact.ph.name':      { en:'Your name',              ku:'ناوت',                      ar:'اسمك' },
  'contact.ph.email':     { en:'you@email.com',          ku:'ئیمەیلەکەت',                ar:'you@email.com' },
  'contact.ph.subject':   { en:"What's this about?",     ku:'ئەمە دەربارەی چییە؟',        ar:'ما موضوع رسالتك؟' },
  'contact.ph.message':   { en:'Tell us how we can help…', ku:'بیڵێ چۆن دەتوانین یارمەتیت بدین…', ar:'أخبرنا كيف يمكننا مساعدتك…' },
  'contact.send':         { en:'📨 Send Message', ku:'📨 نامە بنێرە', ar:'📨 أرسل الرسالة' },

  /* Footer */
  'footer.tagline':     { en:'The safest and fastest marketplace for buying and selling digital accounts and templates.', ku:'پارێزراوترین و خێراترین بازاڕ بۆ کڕین و فرۆشتنی ئەکاونت و قاڵبی دیجیتاڵ.', ar:'السوق الأكثر أمانًا وسرعة لشراء وبيع الحسابات الرقمية والقوالب.' },
  'footer.col.nav':     { en:'Navigation', ku:'ڕێنیشاندان', ar:'التنقل' },
  'footer.col.support': { en:'Support',    ku:'پشتگیری',     ar:'الدعم' },
  'footer.col.legal':   { en:'Legal',      ku:'یاسایی',      ar:'قانوني' },
  'footer.home':        { en:'Home',              ku:'سەرەکی',              ar:'الرئيسية' },
  'footer.marketplace': { en:'Accounts',           ku:'ئەکاونتەکان',         ar:'الحسابات' },
  'footer.sellAccount': { en:'List Account',       ku:'لیستکردنی ئەکاونت',   ar:'إدراج حساب' },
  'footer.contact':     { en:'Contact',             ku:'پەیوەندی',            ar:'تواصل معنا' },
  'footer.help':        { en:'Help Center',         ku:'مەرکەزی یارمەتی',    ar:'مركز المساعدة' },
  'footer.buyerProt':   { en:'Buyer Protection',    ku:'پاراستنی کڕیار',     ar:'حماية المشتري' },
  'footer.reportScam':  { en:'Report a Scam',       ku:'ڕاپۆرتکردنی مەکرە', ar:'الإبلاغ عن احتيال' },
  'footer.dispute':     { en:'Dispute Resolution',  ku:'چارەسەرکردنی کێشە',  ar:'حل النزاعات' },
  'footer.terms':       { en:'Terms of Service',    ku:'مەرجەکانی خزمەت',   ar:'شروط الخدمة' },
  'footer.privacy':     { en:'Privacy Policy',      ku:'سیاسەتی تایبەتمەندی', ar:'سياسة الخصوصية' },
  'footer.cookie':      { en:'Cookie Policy',       ku:'سیاسەتی کووکی',      ar:'سياسة ملفات الارتباط' },
  'footer.copy':        { en:'© 2025 DIGIVAULT. All rights reserved.',
                          ku:'© ٢٠٢٥ DIGIVAULT. هەموو مافەکان پارێزراون.',
                          ar:'© 2025 DIGIVAULT. جميع الحقوق محفوظة.' },

  /* Market page */
  'market.tag':            { en:'The Marketplace',                    ku:'بازاڕ',                              ar:'السوق' },
  'market.title':          { en:'Browse Digital Assets',              ku:'بگەڕێ بەناو داراییە دیجیتاڵەکان',   ar:'تصفَّح الأصول الرقمية' },
  'market.sub':            { en:'Choose a category to explore thousands of verified listings — or list your own digital asset today.',
                             ku:'پۆلێک هەڵبژێرە بۆ بکاوە هەزاران لیستی دڵنیاکراو — یان داراییە دیجیتاڵەکەی خۆت لیست بکە.',
                             ar:'اختر فئة لاستكشاف آلاف القوائم الموثَّقة — أو أدرج أصلك الرقمي اليوم.' },

  /* Categories */
  'cat.game.title':     { en:'🎮 Game Accounts',       ku:'🎮 ئەکاونتی یاری',        ar:'🎮 حسابات الألعاب' },
  'cat.game.desc':      { en:'Browse top-tier game accounts including PUBG, EA Football, Clash Royale, and Fortnite.',
                          ku:'ئەکاونتی یارییە باشەکان بگەڕێ تێیدا وەک PUBG, EA Football, Clash Royale, و Fortnite.',
                          ar:'تصفح حسابات الألعاب الرائدة بما فيها PUBG وكرة القدم EA وكلاش رويال وفورتنايت.' },
  'cat.web.title':      { en:'🌐 Website Templates',   ku:'🌐 قاڵبی مالپەڕ',         ar:'🌐 قوالب المواقع' },
  'cat.web.desc':       { en:'Professional HTML, WordPress, and React templates for your next web project.',
                          ku:'قاڵبی پیشەیی HTML, WordPress, و React بۆ پرۆژەی مالپەڕی داهاتووت.',
                          ar:'قوالب HTML وWordPress وReact احترافية لمشروع موقعك القادم.' },
  'cat.canva.title':    { en:'🎨 Canva Templates',     ku:'🎨 قاڵبی Canva',           ar:'🎨 قوالب Canva' },
  'cat.canva.desc':     { en:'Premium Canva designs for social media, presentations, branding, and more.',
                          ku:'دیزاینی بەرزی Canva بۆ میدیای کۆمەڵایەتی، پێشکەشکردن، براندنگ، و زیاتر.',
                          ar:'تصاميم Canva المميزة للشبكات الاجتماعية والعروض التقديمية والعلامة التجارية وغيرها.' },

  /* Game sub-filters */
  'cat.game.pubg':      { en:'PUBG',         ku:'PUBG',         ar:'PUBG' },
  'cat.game.ea':        { en:'EA Football',  ku:'EA Football',  ar:'EA Football' },
  'cat.game.cr':        { en:'Clash Royale', ku:'Clash Royale', ar:'Clash Royale' },
  'cat.game.fn':        { en:'Fortnite',     ku:'Fortnite',     ar:'Fortnite' },

  'market.trust.escrow':   { en:'🔒 Escrow Protected', ku:'🔒 پارێزراوی Escrow',       ar:'🔒 محمي بالضمان' },
  'market.trust.verified': { en:'✅ Verified Sellers',  ku:'✅ فرۆشیاری دڵنیاکراو',     ar:'✅ بائعون موثَّقون' },
  'market.trust.delivery': { en:'⚡ Instant Delivery',  ku:'⚡ گەیاندنی دەستبەجێ',      ar:'⚡ تسليم فوري' },
  'market.trust.guarantee':{ en:'🛡️ Buyer Guarantee',  ku:'🛡️ گەرەنتیی کڕیار',        ar:'🛡️ ضمان المشتري' },

  /* Filters */
  'filter.all':        { en:'All',              ku:'هەموو',          ar:'الكل' },
  'filter.ace':        { en:'Ace+',             ku:'Ace+',           ar:'Ace+' },
  'filter.crown':      { en:'Crown',            ku:'Crown',          ar:'Crown' },
  'filter.diamond':    { en:'Diamond',          ku:'Diamond',        ar:'Diamond' },
  'filter.platinum':   { en:'Platinum',         ku:'Platinum',       ar:'Platinum' },
  'filter.ph':         { en:'Search accounts…', ku:'بگەڕێ…',         ar:'ابحث…' },
  'filter.loc.all':    { en:'All Locations',    ku:'هەموو شوێنەکان', ar:'كل المواقع' },
  'filter.loc.erbil':  { en:'Erbil',            ku:'هەولێر',          ar:'أربيل' },
  'filter.loc.sulaymaniyah': { en:'Sulaymaniyah', ku:'سلێمانی',       ar:'السليمانية' },
  'filter.loc.duhok':  { en:'Duhok',            ku:'دهۆک',            ar:'دهوك' },
  'filter.loc.halabja':{ en:'Halabja',          ku:'ھەڵەبجە',         ar:'حلبجة' },
  'filter.price.all':  { en:'All Prices',       ku:'هەموو نرخەکان',   ar:'كل الأسعار' },
  'filter.price.low':  { en:'Under 200K IQD',   ku:'کەمتر لە ٢٠٠,٠٠٠ د.ع', ar:'أقل من 200,000 د.ع' },
  'filter.price.mid':  { en:'200K–500K IQD',    ku:'٢٠٠,٠٠٠–٥٠٠,٠٠٠ د.ع',  ar:'200,000–500,000 د.ع' },
  'filter.price.high': { en:'500K+ IQD',        ku:'٥٠٠,٠٠٠+ د.ع',           ar:'500,000+ د.ع' },

  'market.view':       { en:'View',   ku:'بینین', ar:'عرض' },
  'market.promoted':   { en:'🔥 Promoted', ku:'🔥 پرۆمۆتکراو', ar:'🔥 مُروَّج' },
  'market.featured':   { en:'⭐ Featured Listings', ku:'⭐ لیستی تایبەت', ar:'⭐ القوائم المميزة' },
  'market.userlist':   { en:'Community Listings',   ku:'لیستی کۆمەڵگا',  ar:'قوائم المجتمع' },

  /* Warning */
  'warn.title':  { en:'⚠️ Important Notice',  ku:'⚠️ ئاگادارکردنەوەی گرنگ', ar:'⚠️ تنبيه مهم' },
  'warn.text':   { en:'This platform does not handle direct payment between buyer and seller. All deals are arranged independently and are at your own responsibility. Always verify the seller before completing any transaction.',
                   ku:'ئەم پلاتفۆرمە پارەدانی ڕاستەوخۆ نێوان کڕیار و فرۆشیار بەڕێوە ناچوون. هەموو مامەڵەکان بە سەربەخۆیی ڕێکخراون و بەرپرسیارێتییەکەی خۆتە. هەمیشە فرۆشیار بپشکنە پێش تەواوکردنی هەر مامەڵەیەک.',
                   ar:'لا تتولى هذه المنصة الدفع المباشر بين المشتري والبائع. تُرتَّب جميع الصفقات بشكل مستقل وتقع على مسؤوليتك الخاصة. تحقق دائمًا من البائع قبل إتمام أي معاملة.' },

  /* Sell / Account page */
  'sell.tag':   { en:'Seller Dashboard',   ku:'داشبۆردی فرۆشیار',    ar:'لوحة تحكم البائع' },
  'sell.title': { en:'List Your Account',  ku:'ئەکاونتەکەت لیست بکە', ar:'أدرج حسابك' },
  'sell.sub':   { en:'Fill in your account details below. Listings go live after a quick verification (usually under 30 minutes).',
                  ku:'وردەکاری ئەکاونتەکەت لە خوارەوە پڕ بکەرەوە. لیستەکان دواتر دەچنە ژێر پشتڕاستکردنەوەیەکی خێرا.',
                  ar:'أدخل تفاصيل حسابك أدناه. تصبح القوائم مباشرة بعد التحقق السريع (عادةً أقل من 30 دقيقة).' },
  'sell.prog.info':   { en:'Account Info', ku:'زانیاری ئەکاونت', ar:'معلومات الحساب' },
  'sell.prog.media':  { en:'Media',        ku:'میدیا',            ar:'الوسائط' },
  'sell.prog.review': { en:'Review',       ku:'پێداچوونەوە',      ar:'المراجعة' },
  'sell.sec.details': { en:'📋 Account Details', ku:'📋 وردەکاری ئەکاونت', ar:'📋 تفاصيل الحساب' },
  'sell.sec.pricing': { en:'💰 Pricing (IQD)',   ku:'💰 نرخگوزاری (د.ع)',  ar:'💰 التسعير (د.ع)' },
  'sell.sec.desc':    { en:'📝 Description',     ku:'📝 وەسف',             ar:'📝 الوصف' },
  'sell.sec.media':   { en:'🖼️ Media',           ku:'🖼️ میدیا',           ar:'🖼️ الوسائط' },
  'sell.sec.seller':  { en:'👤 Seller Contact',  ku:'👤 پەیوەندی فرۆشیار', ar:'👤 تواصل البائع' },
  'sell.lbl.id':          { en:'Account ID',          ku:'ناسنامەی ئەکاونت',   ar:'معرف الحساب' },
  'sell.lbl.name':        { en:'Account Name',         ku:'ناوی ئەکاونت',       ar:'اسم الحساب' },
  'sell.lbl.level':       { en:'Account Level',        ku:'ئاستی ئەکاونت',      ar:'مستوى الحساب' },
  'sell.lbl.collections': { en:'Collections (number)', ku:'کۆڵکشن (ژمارە)',     ar:'المجموعات (عدد)' },
  'sell.lbl.price':       { en:'Asking Price (IQD)',   ku:'نرخی داواکراو (د.ع)', ar:'السعر المطلوب (د.ع)' },
  'sell.lbl.negotiable':  { en:'Negotiable?',          ku:'چانەپێوەکراوە؟',      ar:'قابل للتفاوض؟' },
  'sell.lbl.descField':   { en:'Account Description',  ku:'وەسفی ئەکاونت',      ar:'وصف الحساب' },
  'sell.lbl.highlights':  { en:'Key Highlights (comma-separated)', ku:'خاڵە گرنگەکان (بە کۆما جیابکەرەوە)', ar:'أبرز المميزات (مفصولة بفواصل)' },
  'sell.lbl.images':      { en:'Account Screenshots',  ku:'ئەکرانشۆتی ئەکاونت', ar:'صور الشاشة للحساب' },
  'sell.lbl.video':       { en:'Account Video (max 2 min)', ku:'ڤیدیۆی ئەکاونت (زۆرترین ٢ خولەک)', ar:'فيديو الحساب (الحد الأقصى دقيقتان)' },
  'sell.lbl.videoOpt':    { en:'(Optional)',            ku:'(ئارەزووکراو)',         ar:'(اختياري)' },
  'sell.lbl.sellerName':  { en:'Your Name',             ku:'ناوت',                ar:'اسمك' },
  'sell.lbl.sellerEmail': { en:'Email Address',         ku:'ئادرەسی ئیمەیل',      ar:'عنوان البريد الإلكتروني' },
  'sell.lbl.telegram':    { en:'Telegram / Discord (optional)', ku:'تێلێگرام / Discord (ئارەزووکراو)', ar:'تلغرام / Discord (اختياري)' },
  'sell.ph.id':          { en:'e.g. 51234567890',                  ku:'بۆ نموونە: 51234567890',         ar:'مثال: 51234567890' },
  'sell.ph.name':        { en:'e.g. ShadowStrike_X99',             ku:'بۆ نموونە: ShadowStrike_X99',   ar:'مثال: ShadowStrike_X99' },
  'sell.ph.level':       { en:'e.g. 80',                           ku:'بۆ نموونە: ٨٠',                 ar:'مثال: 80' },
  'sell.ph.collections': { en:'e.g. 45',                           ku:'بۆ نموونە: ٤٥',                 ar:'مثال: 45' },
  'sell.ph.price':       { en:'e.g. 450000',                       ku:'بۆ نموونە: ٤٥٠٠٠٠',             ar:'مثال: 450000' },
  'sell.ph.desc':        { en:'Describe your account in detail…',  ku:'ئەکاونتەکەت بە وردی وەسف بکە…', ar:'صف حسابك بالتفصيل…' },
  'sell.ph.highlights':  { en:'e.g. M416 Glacier, 5000+ kills',   ku:'بۆ نموونە: M416 Glacier، ٥٠٠٠+ کوشتن', ar:'مثال: M416 Glacier، 5000+ قتل' },
  'sell.ph.sellerName':  { en:'Display name',                      ku:'ناوی پیشاندان',                 ar:'اسم العرض' },
  'sell.ph.sellerEmail': { en:'you@email.com',                     ku:'ئیمەیلەکەت',                    ar:'you@email.com' },
  'sell.ph.telegram':    { en:'@username or Username#1234',         ku:'@username یان Username#1234',   ar:'@username أو Username#1234' },
  'sell.opt.neg.yes':    { en:'Yes, open to offers', ku:'بەڵێ، ئامادەی پێشنیار', ar:'نعم، مفتوح للعروض' },
  'sell.opt.neg.no':     { en:'No, fixed price',     ku:'نەخێر، نرخی نیشتراو',   ar:'لا، سعر ثابت' },
  'sell.upload.imgStrong':  { en:'Click to upload',                   ku:'کلیک بکە بۆ بارکردن',        ar:'انقر للرفع' },
  'sell.upload.imgSub':     { en:'or drag & drop — PNG, JPG, WEBP up to 10 images (max 5MB each)', ku:'یان بکێشە — PNG, JPG, WEBP تا ١٠ وێنە (٥MB هەریەک)', ar:'أو اسحب وأفلت — PNG, JPG, WEBP حتى 10 صور' },
  'sell.upload.vidStrong':  { en:'Click to upload a video (max 2 minutes)', ku:'کلیک بکە بۆ بارکردنی ڤیدیۆ (زۆرترین ٢ خولەک)', ar:'انقر لرفع فيديو (الحد الأقصى دقيقتان)' },
  'sell.upload.vidSub':     { en:'MP4, MOV, AVI — max 100MB',         ku:'MP4, MOV, AVI — زۆرترین ١٠٠MB', ar:'MP4, MOV, AVI — الحد الأقصى 100 ميغابايت' },
  'sell.terms':  { en:"I confirm that I own this account and agree to DIGIVAULT's Terms of Service and Seller Guidelines.",
                   ku:'دڵنیایم کە خاوەنی ئەم ئەکاونتەم و ڕازییم بە مەرجەکانی خزمەت و ڕێنمایی فرۆشیارانی DIGIVAULT.',
                   ar:'أؤكد أنني مالك هذا الحساب وأوافق على شروط خدمة DIGIVAULT وإرشادات البائع.' },
  'sell.submit': { en:'📤 Submit Listing for Review', ku:'📤 لیست بنێرە بۆ پێداچوونەوە', ar:'📤 أرسل القائمة للمراجعة' },
  'sell.encrypt':{ en:'🔒 Your information is encrypted and never shared with third parties.', ku:'🔒 زانیارییەکانت کۆدکراوە و هەرگیز بە لایەنی سێیەم نادرێت.', ar:'🔒 معلوماتك مشفَّرة ولن تُشارَك أبدًا مع أطراف ثالثة.' },

  /* Tips */
  'tips.title': { en:'💡 Listing Tips', ku:'💡 ئامۆژگاری لیستکردن', ar:'💡 نصائح الإدراج' },
  'tip.1': { en:'Upload clear screenshots of your account — listings with photos get 3× more views.', ku:'ئەکرانشۆتی ڕوون لە ئەکاونتەکەت بارکە — لیستی وێنەدار ٣ قات زیاتر بینراوە دەبێت.', ar:'ارفع صور واضحة لحسابك — القوائم ذات الصور تحصل على 3 مرات أكثر من المشاهدات.' },
  'tip.2': { en:'Check recent sold listings to price competitively in IQD. Overpriced accounts sit unsold for weeks.', ku:'لیستی فرۆشراوی نوێ بپشکنە بۆ نرخگوزاری بەکارا بە د.ع. ئەکاونتی گران هەفتەکان نافرۆشرێت.', ar:'تحقق من القوائم المباعة مؤخرًا للتسعير التنافسي بالدينار العراقي. الحسابات مرتفعة الثمن تظل دون مشترٍ لأسابيع.' },
  'tip.3': { en:'Mention your Account ID, level, and exact number of collections for more trust.', ku:'ناسنامە، ئاست، و ژمارەی تەواوی کۆڵکشنەکانت باسکە بۆ باشترکردنی باوەڕ.', ar:'اذكر معرف حسابك ومستواك والعدد الدقيق لمجموعاتك لمزيد من الثقة.' },
  'tip.4': { en:'Respond to buyer messages within 1 hour to boost your seller level and listing rank.', ku:'لە کەمتر لە ١ کاتژمێر بەڵامی نامەی کڕیار بدەرەوە بۆ باشترکردنی ئاستی فرۆشیار و پلەی لیست.', ar:'رد على رسائل المشتري خلال ساعة لتحسين مستوى البائع وترتيب قائمتك.' },
  'tip.5': { en:"Never share account credentials until the platform confirms the buyer's payment is secured.", ku:'هەرگیز زانیاری ئەکاونت هاوبەش مەکە تا پلاتفۆرم دڵنیایی پارەدانی کڕیار پشتڕاست نەکاتەوە.', ar:'لا تشارك بيانات الحساب أبدًا حتى تؤكد المنصة تأمين دفع المشتري.' },

  /* Preview */
  'preview.card.title': { en:'👁 Live Preview',                    ku:'👁 پێشبینی زیندو',         ar:'👁 معاينة مباشرة' },
  'preview.noTitle':    { en:'Account Name',                       ku:'ناوی ئەکاونت',              ar:'اسم الحساب' },
  'preview.noDesc':     { en:'Your description will appear here…', ku:'وەسفەکەت لێرە دەردەکەوێت…', ar:'سيظهر وصفك هنا…' },

  /* Dashboard */
  'dash.title':     { en:'My Dashboard',  ku:'داشبۆردەکەم',    ar:'لوحتي' },
  'dash.profile':   { en:'Profile',       ku:'پرۆفایل',         ar:'الملف الشخصي' },
  'dash.listings':  { en:'My Listings',   ku:'لیستەکانم',       ar:'قوائمي' },
  'dash.level':     { en:'My Level',      ku:'ئاستەکەم',        ar:'مستواي' },
  'dash.tccoin':    { en:'DV Coins',      ku:'TC کۆینەکانم',    ar:'DV Coins' },
  'dash.lv.bronze': { en:'Bronze Seller', ku:'فرۆشیاری بڕۆنز',  ar:'بائع برونزي' },
  'dash.lv.silver': { en:'Silver Seller', ku:'فرۆشیاری زیو',    ar:'بائع فضي' },
  'dash.lv.gold':   { en:'Gold Seller',   ku:'فرۆشیاری زێڕین',  ar:'بائع ذهبي' },
};

/* ── 2. LANGUAGE METADATA ──────────────────────────────── */
const LANGUAGES = {
  en: { label: 'English',  flag: '🇬🇧', dir: 'ltr', htmlLang: 'en' },
  ku: { label: 'کوردی',   flag: '🇮🇶', dir: 'rtl', htmlLang: 'ku' },
  ar: { label: 'العربية', flag: '🇸🇦', dir: 'rtl', htmlLang: 'ar' },
};
const DEFAULT_LANG = 'en';
const STORAGE_KEY  = 'techwallet_lang';

/* ── 3. ENGINE ─────────────────────────────────────────── */
function t(key, lang) {
  const entry = TRANSLATIONS[key];
  if (!entry) { console.warn('[i18n] Missing key: ' + key); return key; }
  return entry[lang] ?? entry[DEFAULT_LANG] ?? key;
}

function applyTranslations(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'), lang);
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-i18n-html'), lang);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'), lang);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'), lang));
  });
}

function applyDirection(lang) {
  const { dir, htmlLang } = LANGUAGES[lang] ?? LANGUAGES[DEFAULT_LANG];
  document.body.classList.add('lang-transitioning');
  setTimeout(() => {
    document.documentElement.setAttribute('lang', htmlLang);
    document.documentElement.setAttribute('dir',  dir);
    document.body.classList.remove('lang-transitioning');
  }, 200);
}

function updateSwitcherUI(lang) {
  const btn = document.getElementById('langSwitcherBtn');
  if (!btn) return;
  const { flag, label } = LANGUAGES[lang];
  btn.querySelector('.ls-flag').textContent  = flag;
  btn.querySelector('.ls-label').textContent = label;
  document.querySelectorAll('.ls-option').forEach(opt => {
    const active = opt.dataset.lang === lang;
    opt.classList.toggle('active', active);
    opt.setAttribute('aria-checked', active);
  });
}

function setLanguage(lang) {
  if (!LANGUAGES[lang]) lang = DEFAULT_LANG;
  applyDirection(lang);
  setTimeout(() => {
    applyTranslations(lang);
    updateSwitcherUI(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch(_) {}
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }, 210);
}

function getSavedLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGUAGES[saved]) return saved;
  } catch(_) {}
  const browser = (navigator.language || '').split('-')[0].toLowerCase();
  return LANGUAGES[browser] ? browser : DEFAULT_LANG;
}

/* ── 4. SWITCHER WIDGET ────────────────────────────────── */
function buildSwitcher() {
  const wrapper = document.createElement('div');
  wrapper.className = 'lang-switcher';
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-label', 'Language selector');
  wrapper.innerHTML =
    '<button id="langSwitcherBtn" class="ls-btn" type="button"' +
    ' aria-haspopup="listbox" aria-expanded="false" aria-controls="langDropdown" title="Change language">' +
    '<span class="ls-flag" aria-hidden="true">🇬🇧</span>' +
    '<span class="ls-label">English</span>' +
    '<span class="ls-caret" aria-hidden="true"><svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
    '</button>' +
    '<ul id="langDropdown" class="ls-dropdown" role="listbox" aria-label="Select language">' +
    Object.entries(LANGUAGES).map(function(e) {
      var code = e[0], meta = e[1];
      return '<li class="ls-option" role="option" data-lang="' + code + '" tabindex="0" aria-checked="false">' +
             '<span class="ls-opt-flag" aria-hidden="true">' + meta.flag + '</span>' +
             '<span class="ls-opt-label">' + meta.label + '</span>' +
             '<span class="ls-opt-check" aria-hidden="true">✓</span></li>';
    }).join('') + '</ul>';

  document.querySelector('#lang-switcher').appendChild(wrapper);
  _bindEvents(wrapper);
}

function _toggleDD(open, btn, dd) {
  btn.setAttribute('aria-expanded', open);
  dd.classList.toggle('open', open);
}

function _bindEvents(wrapper) {
  var btn = wrapper.querySelector('#langSwitcherBtn');
  var dd  = wrapper.querySelector('#langDropdown');

  btn.addEventListener('click', function() {
    _toggleDD(btn.getAttribute('aria-expanded') !== 'true', btn, dd);
  });

  wrapper.addEventListener('click', function(e) {
    var opt = e.target.closest('.ls-option');
    if (!opt) return;
    setLanguage(opt.dataset.lang);
    _toggleDD(false, btn, dd);
    btn.focus();
  });

  wrapper.addEventListener('keydown', function(e) {
    var opt = e.target.closest('.ls-option');
    var opts = Array.from(wrapper.querySelectorAll('.ls-option'));
    if (opt) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); setLanguage(opt.dataset.lang); _toggleDD(false, btn, dd); btn.focus();
      }
      if (e.key === 'ArrowDown') { e.preventDefault(); var n = opts[opts.indexOf(opt)+1]; if(n) n.focus(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); var p = opts[opts.indexOf(opt)-1]; if(p) p.focus(); }
      if (e.key === 'Escape')    { _toggleDD(false, btn, dd); btn.focus(); }
    }
    if (e.target === btn) {
      if (e.key === 'ArrowDown') { e.preventDefault(); _toggleDD(true,btn,dd); opts[0] && opts[0].focus(); }
      if (e.key === 'Escape')    { _toggleDD(false,btn,dd); }
    }
  });

  document.addEventListener('click', function(e) {
    if (!wrapper.contains(e.target)) _toggleDD(false, btn, dd);
  });
}

/* ── 5. BOOT ───────────────────────────────────────────── */
function init() {
  buildSwitcher();
  var lang = getSavedLanguage();
  var meta = LANGUAGES[lang];
  document.documentElement.setAttribute('lang', meta.htmlLang);
  document.documentElement.setAttribute('dir',  meta.dir);
  setLanguage(lang);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}