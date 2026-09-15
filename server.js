const express = require('express');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname);
const PORT = process.env.PORT || 3002;
const app = express();

// Security and parser middlewares
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Explicitly block access to sensitive files and internal directories
const BLOCKED_PATTERNS = [
  /^\/\.git/,
  /^\/\.gitignore/,
  /^\/node_modules/,
  /^\/package.*\.json/,
  /^\/server\.js/,
  /^\/playwright\.config\.js/,
  /^\/test\.spec\.js/,
  /^\/backend/,
  /^\/data/,
  /^\/templates/,
  /^\/test-results/
];

app.use((req, res, next) => {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(req.path)) {
      return res.status(404).send('Not found');
    }
  }
  next();
});

// Mock news data (official Czech Post style)
const mockNews = [
  {
    id: 1,
    title: 'Nové balíkové služby a rozšíření sítě Balíkovna',
    summary: 'Česká pošta rozšiřuje síť výdejních boxů a partnerských míst Balíkovna na více než 9 000 míst po celé ČR.',
    content: 'Pro e-shopy i běžné odesílatele přinášíme ještě rychlejší podání a flexibilnější vyzvednutí zásilek 24/7. Nové samoobslužné boxy umožňují jak vyzvednutí na PIN kód, tak odeslání balíku bez nutnosti čekání u přepážky.',
    category: 'Balíkovna',
    date: new Date(Date.now() - 86400000).toISOString(),
    readTime: '3 min čtení'
  },
  {
    id: 2,
    title: 'Modernizace poboček a zrychlení služeb Czech POINT',
    summary: 'Na vybraných poštách instalujeme novou generaci vyvolávacích systémů a rozšiřujeme možnosti platby kartou.',
    content: 'Díky modernizaci pobočkové sítě se průměrná doba čekání zkrátila na méně než 5 minut. Služby ověřování listin a výpisy z rejstříků Czech POINT jsou nyní dostupné ještě rychleji.',
    category: 'Pobočky',
    date: new Date(Date.now() - 172800000).toISOString(),
    readTime: '2 min čtení'
  },
  {
    id: 3,
    title: 'Příprava na podzimní a předvánoční sezónu 2026',
    summary: 'Doporučené termíny pro odeslání balíků a tipy pro spolehlivé a včasné doručení před svátky.',
    content: 'Přinášíme detailní harmonogram svozů a garantované termíny doručení pro vnitrostátní i mezinárodní zásilky. Využijte včasné podání přes aplikaci se zvýhodněnou cenou poštovného.',
    category: 'Provoz',
    date: new Date(Date.now() - 259200000).toISOString(),
    readTime: '4 min čtení'
  },
  {
    id: 4,
    title: 'Přírodní krásy Jeseníků na nových poštovních známkách',
    summary: 'Česká pošta vydává novou emisi příležitostných poštovních známek věnovanou chráněné krajinné oblasti Jeseníky.',
    content: 'Autorem výtvarného návrhu je přední český grafik. Známky v hodnotě pro vnitrostátní psaní jsou ode dneška v prodeji na všech filatelistických přepážkách a v e-shopu České pošty.',
    category: 'Filatelie',
    date: new Date(Date.now() - 345600000).toISOString(),
    readTime: '2 min čtení'
  }
];

const homeNews = [
  {
    id: 1,
    title: 'Volební leták není reklamou',
    summary: 'Informace k doručování volebních materiálů a k tomu, proč nejde o reklamní zásilku.',
    content: 'Česká pošta doručuje volební letáky v rámci zákonných povinností. Nejde o reklamní zásilku, proto se na ni nevztahuje zákaz vhazování reklamy do schránek označených „reklamu nechci“.\n\nVolební materiály se doručují podle pokynů zadavatele a volebního kalendáře. Pokud leták nedorazil, ověřte přístupnost schránky a jmenovku.\n\nDotazy k obsahu směřujte na zadavatele. Pošta odpovídá za doručení, nikoli za politický obsah.',
    category: 'Aktuality',
    date: '2026-09-14T08:00:00.000Z',
    readTime: '3 min čtení'
  },
  {
    id: 2,
    title: 'Zvířata a rostliny z Jeseníků na známkách',
    summary: 'Nová emise známek představuje přírodu Chráněné krajinné oblasti Jeseníky.',
    content: 'Česká pošta vydává příležitostné známky věnované Jeseníkům. Emise je pro sběratele i běžný provoz.\n\nZnámky koupíte na filatelistických přepážkách a v e-shopu PostFila. K dispozici jsou obálky prvního dne.\n\nNominální hodnoty odpovídají vnitrostátnímu psaní.',
    category: 'Filatelie',
    date: '2026-09-01T08:00:00.000Z',
    readTime: '2 min čtení'
  },
  {
    id: 3,
    title: 'Třinec má novou hlavní poštu. Nabízí delší otevírací dobu a modernější obsluhu klientů',
    summary: 'Nová hlavní pošta v Třinci má delší otvírací dobu a přehlednější přepážky.',
    content: 'V Třinci byla otevřena nová hlavní pošta s delší otevírací dobou, bezbariérovým přístupem a novým vyvolávacím systémem.\n\nK dispozici jsou podání a výdej zásilek, Czech POINT, platba kartou a výběr hotovosti.\n\nAktuální hodiny ověříte ve vyhledávači poboček. Čas si lze rezervovat předem.',
    category: 'Pobočky',
    date: '2026-08-31T08:00:00.000Z',
    readTime: '3 min čtení'
  }
];

mockNews.unshift(...homeNews.map((item, i) => ({ ...item, id: i + 1 })));
mockNews.forEach((item, i) => { item.id = i + 1; });

const mockPages = {
  bezpecnost: { title: 'Bezpečnostní informace', body: 'Česká pošta chrání zásilky, data klientů i provoz poboček. Cenné zásilky podávejte jako evidované a pojištěné.\n\nZtrátu, poškození nebo podezřelé chování nahlaste na infolince nebo na pobočce. PIN k výdeji a hesla k účtům nikomu nesdělujte.' },
  kontakty: { title: 'Kontakty', body: 'Infolinka: 954 211 000 v pracovní dny. Osobní podání vyřídíte na pobočce ve vyhledávači.\n\nU reklamace uveďte číslo zásilky a datum podání. Pro média a smluvní zákazníky použijte specializované kontakty.' },
  profil: { title: 'Profil společnosti', body: 'Česká pošta, s.p., je státní podnik s celostátní sítí poboček, doručovatelů a Balíkoven. Zajišťuje univerzální službu, balíky, platby i eGovernment.\n\nSídlo je v Praze. Podnik se řídí zákonem o státním podniku a poštovními podmínkami.' },
  partner: { title: 'Pošta Partner', body: 'Pošta Partner je partnerská přepážka v obci nebo obchodě. Podáte tu psaní a balíky a často zaplatíte složenku.\n\nHodiny se liší podle partnera — ověřte je před cestou ve vyhledávači poboček.' },
  esg: { title: 'Udržitelnost a ESG', body: 'Snižujeme emise doručování a sledujeme spotřebu energií na pobočkách.\n\nZprávy o udržitelnosti popisují environmentální, sociální a governance cíle.' },
  gdpr: { title: 'Ochrana osobních údajů – GDPR', body: 'Údaje zpracováváme k doručení zásilky, vedení účtu a zákonným povinnostem.\n\nMáte právo na přístup, opravu, výmaz a námitku. Cookies nastavíte v liště souhlasu na webu.' },
  cenik: { title: 'Ceník služeb České pošty', body: 'Ceny psaní, balíků, poukázek a Czech POINT jsou v aktuálním ceníku ke stažení.\n\nOrientační cenu spočítá kalkulátor na úvodní straně. Na přepážce rozhoduje hmotnost a doplňkové služby.' },
  formulare: { title: 'Formuláře a tiskopisy', body: 'Podací lístky, celní prohlášení a žádosti stáhnete v této sekci.\n\nNa pobočku vezměte vyplněný tiskopis a doklad totožnosti.' },
  podminky: { title: 'Poštovní a obchodní podmínky', body: 'Podmínky upravují podání, doručení, reklamace a odpovědnost za zásilku.\n\nObchodní podmínky e-shopu a Balíkovny jsou samostatné. Archiv verzí je ke stažení.' },
  baleni: { title: 'Návody k balení a podání', body: 'Použijte pevnou krabici, výplň a čitelnou adresu s PSČ.\n\nKřehké zboží označte a zvolte pojištění. Nebezpečné věci podléhají omezením.' },
  nedoruceni: { title: 'Když Vás Pošta nezastihla', body: 'Nedoručenou zásilku najdete na výzvě s úložní lhůtou a místem výdeje.\n\nK výdeji potřebujete doklad a kód. Lhůtu lze někdy prodloužit nebo zásilku přesměrovat.' },
  clo: { title: 'Celní řízení', body: 'Zásilky ze zemí mimo EU mohou podléhat clu a DPH.\n\nBez dokončeného řízení zásilku nevydáme. Údaje doplníte podle výzvy v oznámení.' },
  sluzby: { title: 'Široké spektrum služeb', body: 'Nabízíme psaní, balíky, platby, Czech POINT, datové schránky, filatelii a PostSignum.\n\nPřehled je v žlutém pruhu na úvodní straně. Cenu ověříte ceníkem nebo kalkulátorem.' },
  karta: { title: 'Zákaznická karta', body: 'Karta zrychluje podání a výdej a eviduje zásilky.\n\nVydání vyřiďte na pobočce s dokladem. Ztrátu nahlaste.' },
  zakazky: { title: 'Veřejné zakázky', body: 'Zakázky uveřejňujeme podle zákona o zadávání veřejných zakázek.\n\nDokumentace je v profilu zadavatele. Dotazy posílejte jen na kontakt uvedený u zakázky.' },
  studenti: { title: 'Spolupráce školám a studentům', body: 'Školám nabízíme exkurze, praxe a informace o poštovních povoláních.\n\nHromadné návštěvy je nutné domluvit předem.' },
  nemovitosti: { title: 'Prodej a pronájem nemovitostí', body: 'NePotřebné budovy a pozemky nabízíme k prodeji nebo pronájmu.\n\nNabídky a termíny prohlídek jsou v inzerci.' },
  majetek: { title: 'Prodej movitého majetku', body: 'Vyřazená technika a vybavení se prodává ve výběrových řízeních.\n\nPoložky a termíny najdete u jednotlivých výzev.' },
  pristupnost: { title: 'Přístupnost webu', body: 'Web podporuje kontrast, klávesnici a přeskočení na obsah.\n\nBariéru nahlaste přes kontakt. Známá omezení jsou v prohlášení o přístupnosti.' },
  mapa: { title: 'Mapa stránek', body: 'Hlavní celky webu: služby, nástroje, rady, ke stažení, kontakty a o společnosti.\n\nAktuality jsou v archivu. Sledování zásilky a kalkulátor najdete na úvodní straně.' },
  zmena: { title: 'Změna doručení', body: 'U vybraných balíků změníte den, adresu nebo výdejní místo před doručením.\n\nZadáte číslo zásilky a ověřovací údaj. Služba není u všech produktů.' },
  pruzkum: { title: 'Průzkum spokojenosti', body: 'Po doručení vás můžeme požádat o krátké hodnocení.\n\nOdpověď je dobrovolná a nemá vliv na výdej zásilky.' },
  aplikace: { title: 'Mobilní aplikace PoštaOnline', body: 'Aplikace sleduje zásilky, hledá pobočku a ukáže výzvy k vyzvednutí.\n\nStahujte ji z oficiálních obchodů. Přihlášení je stejné jako na webu PoštaOnline.' },
  psani: { title: 'Poštovní psaní a zásilky', body: 'Obyčejné i doporučené psaní, balíky Do ruky, Na poštu a Balíkovna. Sledování zásilky zadáte číslem na úvodní straně.\n\nDo zahraničí použijte příslušnou službu a vyplňte celní údaje, pokud zásilka opouští EU. Cenu odhadnete kalkulátorem, přesnou částku určí hmotnost a doplňkové služby na přepážce.' },
  platby: { title: 'Platby a finance', body: 'Na poště zaplatíte složenku, poukázku a vybrané poplatky. U některých služeb je možný výběr hotovosti kartou.\n\nPoštovní poukázky A, B, C a zahraniční poukázky mají vlastní ceník. Doklad o platbě si uschovejte kvůli reklamaci.' },
  reklama: { title: 'Reklamní zásilky', body: 'Adresné i neadresné reklamní zásilky doručujeme podle objemu a oblasti. Schránky s nápisem „reklamu nechci“ neadresnou reklamu nedostanou.\n\nVolební materiály reklamou nejsou. Obchodní nabídku infoposty poptáte jako firemní zákazník.' },
  online: { title: 'Služby pošty online', body: 'Přes PoštaOnline podáte zásilku, změníte doručení, rezervujete si čas na pobočce a sledujete pohyb balíku.\n\nPřihlášení je stejné jako v mobilní aplikaci. Bez účtu funguje sledování zásilky a vyhledání pobočky.' },
  egovernment: { title: 'Služby eGovernment', body: 'Na poštách s Czech POINT získáte výpisy z rejstříků, ověření podpisu a založení datové schránky.\n\nNěkteré úkony vyžadují doklad totožnosti. Objednávka na konkrétní čas zkrátí čekání u přepážky.' },
  eshopy: { title: 'eShopy České Pošty', body: 'V e-shopech České pošty koupíte známky, dálniční známku, filatelii a vybrané dárkové předměty.\n\nObjednávku zaplatíte online a vyzvednete na pobočce, v boxu nebo necháte doručit. Stav objednávky sledujte v účtu e-shopu.' },
  filatelie: { title: 'Filatelia a PostFila', body: 'PostFila vydává známky, obálky prvního dne a sběratelské soubory. Aktuální emise jsou v aktualitách.\n\nNákup je možný na filatelistické přepážce a v e-shopu. Emisní plány a ankety k známkám zveřejňujeme v této sekci.' },
  dalnice: { title: 'Dálniční známky', body: 'Elektronickou dálniční známku koupíte na webu edalnice.cz, v e-shopu pošty a na vybraných přepážkách.\n\nZnámka je vázaná na registrační značku vozidla. Zkontrolujte stát, SPZ a dobu platnosti před platbou. Papírová kuponová známka se už nepoužívá.' }
};

// Branches and parcel boxes dataset
const mockBranches = [
  {
    id: '11000',
    name: 'Pošta Praha 1 (Hlavní pošta)',
    type: 'posta',
    address: 'Jindřišská 909/14, 110 00 Praha 1',
    city: 'Praha',
    zip: '110 00',
    hours: 'Po-Ne: 06:00 - 22:00',
    czechPoint: true,
    cardPayment: true,
    wheelchairAccess: true,
    nonstop: false,
    phone: '+420 954 211 000'
  },
  {
    id: '12000',
    name: 'Pošta Praha 2 (Vinohrady)',
    type: 'posta',
    address: 'Moravská 1530/9, 120 00 Praha 2',
    city: 'Praha',
    zip: '120 00',
    hours: 'Po-Pá: 08:00 - 19:00, So: 08:00 - 12:00',
    czechPoint: true,
    cardPayment: true,
    wheelchairAccess: true,
    nonstop: false,
    phone: '+420 954 212 000'
  },
  {
    id: 'box-01',
    name: 'Balíkovna-BOX Metro Můstek',
    type: 'box',
    address: 'Václavské náměstí (vestibul metra A/B), 110 00 Praha 1',
    city: 'Praha',
    zip: '110 00',
    hours: 'Nonstop 24/7',
    czechPoint: false,
    cardPayment: true,
    wheelchairAccess: true,
    nonstop: true,
    phone: '+420 210 123 456'
  },
  {
    id: 'box-02',
    name: 'Balíkovna-BOX OC Nový Smíchov',
    type: 'box',
    address: 'Plzeňská 8, 150 00 Praha 5',
    city: 'Praha',
    zip: '150 00',
    hours: 'Nonstop 24/7',
    czechPoint: false,
    cardPayment: true,
    wheelchairAccess: true,
    nonstop: true,
    phone: '+420 210 123 456'
  },
  {
    id: 'bal-01',
    name: 'Balíkovna Tabák Trafika Nádražní',
    type: 'balikovna',
    address: 'Nádražní 114, 150 00 Praha 5 - Smíchov',
    city: 'Praha',
    zip: '150 00',
    hours: 'Po-Pá: 06:30 - 18:30, So: 07:00 - 13:00',
    czechPoint: false,
    cardPayment: true,
    wheelchairAccess: false,
    nonstop: false,
    phone: '+420 954 300 114'
  },
  {
    id: '60200',
    name: 'Pošta Brno 2 (Nádražní)',
    type: 'posta',
    address: 'Nádražní 118/7, 602 00 Brno',
    city: 'Brno',
    zip: '602 00',
    hours: 'Po-Pá: 07:00 - 20:00, So: 08:00 - 13:00',
    czechPoint: true,
    cardPayment: true,
    wheelchairAccess: true,
    nonstop: false,
    phone: '+420 954 260 200'
  },
  {
    id: 'box-brno-01',
    name: 'Balíkovna-BOX Brno Hlavní Nádraží',
    type: 'box',
    address: 'Benešova 4, 602 00 Brno',
    city: 'Brno',
    zip: '602 00',
    hours: 'Nonstop 24/7',
    czechPoint: false,
    cardPayment: true,
    wheelchairAccess: true,
    nonstop: true,
    phone: '+420 210 123 456'
  },
  {
    id: '70200',
    name: 'Pošta Ostrava 2',
    type: 'posta',
    address: 'Wattova 1046/19, 702 00 Ostrava',
    city: 'Ostrava',
    zip: '702 00',
    hours: 'Po-Pá: 08:00 - 18:00',
    czechPoint: true,
    cardPayment: true,
    wheelchairAccess: true,
    nonstop: false,
    phone: '+420 954 270 200'
  }
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    demo: true,
    version: '2.0.0',
    service: 'Česká pošta Portal (Production Demo)',
    uptime: Math.round(process.uptime())
  });
});

// News API endpoint
app.get('/api/news', (req, res) => {
  res.json({ news: mockNews });
});

// Single news item
app.get('/api/news/:id', (req, res) => {
  const item = mockNews.find(n => n.id === parseInt(req.params.id, 10));
  if (!item) return res.status(404).json({ error: 'Zpráva nenalezena' });
  res.json({ item });
});

app.get('/api/pages', (req, res) => {
  res.json({
    pages: Object.entries(mockPages).map(([slug, page]) => ({ slug, title: page.title }))
  });
});

app.get('/api/pages/:slug', (req, res) => {
  const page = mockPages[req.params.slug];
  if (!page) return res.status(404).json({ error: 'Stránka nenalezena' });
  res.json({ slug: req.params.slug, ...page });
});

// Parcel tracking endpoint
app.get('/api/track/:id', (req, res) => {
  const rawId = (req.params.id || '').toUpperCase().trim();
  if (!rawId) {
    return res.status(400).json({ error: 'Zadejte prosím číslo zásilky' });
  }

  // Pre-configured realistic demo shipments
  if (rawId === 'DR123456789CZ') {
    return res.json({
      id: 'DR123456789CZ',
      serviceName: 'Balík Do ruky',
      status: 'delivering',
      statusText: 'Zásilka je v doručování',
      sender: 'E-shop SportovníPotřeby.cz, Brno',
      recipient: 'J** N****, Na Strži 42, Praha 4',
      weight: '2.4 kg',
      codAmount: '0 Kč (uhrazeno předem)',
      estimatedDelivery: 'Dnes 14:00 - 16:00',
      courierPhone: '+420 720 123 456 (Kurýr p. Novotný)',
      progressPercent: 75,
      milestones: [
        { title: 'Podání zásilky odesílatelem', location: 'Depo Brno 71', date: 'Včera 16:45', completed: true },
        { title: 'Přeprava na cílové depo', location: 'Třídicí centrum Praha-Malešice', date: 'Dnes 03:15', completed: true },
        { title: 'Příprava k doručení', location: 'Depo Praha 022', date: 'Dnes 07:30', completed: true },
        { title: 'Zásilka je v doručování kurýrem', location: 'Oblast Praha 4', date: 'Dnes 08:45', current: true, completed: false },
        { title: 'Doručení příjemci', location: 'Cílová adresa', date: 'Očekáváno dnes 14:00 - 16:00', completed: false }
      ]
    });
  }

  if (rawId === 'NP987654321CZ') {
    return res.json({
      id: 'NP987654321CZ',
      serviceName: 'Balík Na poštu',
      status: 'ready_for_pickup',
      statusText: 'Připraveno k vyzvednutí na poště',
      sender: 'Knihy Svět s.r.o., Ostrava',
      recipient: 'M****** K****, Praha 1',
      weight: '1.1 kg',
      codAmount: '389 Kč (lze platit kartou)',
      pickupLocation: 'Pošta Praha 1, Jindřišská 909/14, 110 00 Praha 1',
      pickupPin: '8472',
      storageUntil: '23.09.2026',
      progressPercent: 85,
      milestones: [
        { title: 'Podání zásilky odesílatelem', location: 'Pošta Ostrava 2', date: '12.09.2026 14:20', completed: true },
        { title: 'Meziměstská přeprava', location: 'Centrální třídicí uzel', date: '13.09.2026 01:10', completed: true },
        { title: 'Příjem na cílové poště', location: 'Pošta Praha 1', date: '13.09.2026 10:15', completed: true },
        { title: 'Zásilka uložena k vyzvednutí', location: 'Přepážka č. 8, Pošta Praha 1', date: '13.09.2026 11:00', current: true, completed: true }
      ]
    });
  }

  if (rawId === 'BA456789123CZ' || rawId.startsWith('BA')) {
    return res.json({
      id: rawId,
      serviceName: 'Balíkovna do BOXu',
      status: 'in_box',
      statusText: 'Uloženo v Balíkovna-BOXu',
      sender: 'Elektronika Express a.s., Praha',
      recipient: 'T**** P******, Smíchov',
      weight: '0.8 kg',
      codAmount: '0 Kč',
      pickupLocation: 'Balíkovna-BOX OC Nový Smíchov, Plzeňská 8, Praha 5',
      pickupPin: '5921',
      storageUntil: '18.09.2026 (zbývá 48 hodin)',
      progressPercent: 90,
      milestones: [
        { title: 'Podání zásilky', location: 'Podací místo Praha', date: 'Včera 11:30', completed: true },
        { title: 'Zpracování v depu', location: 'Depo Praha-Malešice', date: 'Včera 22:40', completed: true },
        { title: 'Vložení do Balíkovna-BOXu', location: 'OC Nový Smíchov, box č. 14', date: 'Dnes 06:15', current: true, completed: true }
      ]
    });
  }

  // Dynamic deterministic response for any entered tracking code
  const isDelivered = rawId.endsWith('9') || rawId.endsWith('0');
  const serviceType = rawId.startsWith('NP') ? 'Balík Na poštu' : rawId.startsWith('RR') ? 'Doporučené psaní' : 'Balík Do ruky';

  return res.json({
    id: rawId,
    serviceName: serviceType,
    status: isDelivered ? 'delivered' : 'in_transit',
    statusText: isDelivered ? 'Zásilka byla úspěšně doručena' : 'Zásilka je v přepravě k cílovému depu',
    sender: 'Smluvní odesílatel, Česká republika',
    recipient: 'Ověřený příjemce',
    weight: '1.5 kg',
    codAmount: '0 Kč',
    estimatedDelivery: isDelivered ? 'Doručeno' : 'Následující pracovní den',
    progressPercent: isDelivered ? 100 : 50,
    milestones: [
      { title: 'Převzetí zásilky do přepravy', location: 'Podací pošta', date: '14.09.2026 15:30', completed: true },
      { title: 'Zpracování zásilky na třídicím centru', location: 'Hlavní uzel pošty', date: '15.09.2026 02:20', completed: true, current: !isDelivered },
      { title: 'Výstup z třídicího centra na doručovací depo', location: 'Směrové depo', date: isDelivered ? '15.09.2026 07:15' : 'V přípravě', completed: isDelivered },
      { title: isDelivered ? 'Úspěšně doručeno příjemci' : 'Doručení na adresu', location: 'Cílová adresa', date: isDelivered ? '15.09.2026 12:40' : 'Očekáváno zítra', completed: isDelivered, current: isDelivered }
    ]
  });
});

// Postage rate calculator
app.post('/api/calculate', (req, res) => {
  const { service = 'balikovna', weight = 1, cod = false, fragile = false, insurance = false } = req.body || {};

  const numWeight = parseFloat(weight) || 1;
  let basePrice = 65;
  let serviceName = 'Balíkovna';
  let deliveryTime = '1-2 pracovní dny';

  switch (service) {
    case 'balikovna':
      basePrice = numWeight <= 5 ? 65 : 85;
      serviceName = 'Balíkovna (na výdejní místo / do BOXu)';
      deliveryTime = 'Následující pracovní den';
      break;
    case 'do_ruky':
      basePrice = numWeight <= 2 ? 129 : numWeight <= 10 ? 159 : 219;
      serviceName = 'Balík Do ruky (přímo na adresu)';
      deliveryTime = 'Následující pracovní den (garantováno)';
      break;
    case 'na_postu':
      basePrice = numWeight <= 2 ? 109 : numWeight <= 10 ? 139 : 189;
      serviceName = 'Balík Na poštu (k vyzvednutí na pobočce)';
      deliveryTime = 'Následující pracovní den';
      break;
    case 'doporucene':
      basePrice = numWeight <= 0.5 ? 62 : 72;
      serviceName = 'Doporučené psaní (listovní zásilka)';
      deliveryTime = '1-3 pracovní dny';
      break;
    default:
      basePrice = 99;
      serviceName = 'Standardní balík';
      deliveryTime = '2-3 pracovní dny';
  }

  let extraPrice = 0;
  const breakdown = [{ item: `Základní cena (${serviceName})`, price: basePrice }];

  if (cod) {
    const codPrice = 30;
    extraPrice += codPrice;
    breakdown.push({ item: 'Příplatek za dobírku', price: codPrice });
  }

  if (fragile) {
    const fragilePrice = 45;
    extraPrice += fragilePrice;
    breakdown.push({ item: 'Křehké zboží (zvláštní zacházení)', price: fragilePrice });
  }

  if (insurance) {
    const insurancePrice = 20;
    extraPrice += insurancePrice;
    breakdown.push({ item: 'Pojištění nad standardní limit (do 50 000 Kč)', price: insurancePrice });
  }

  const totalPrice = basePrice + extraPrice;

  res.json({
    service,
    serviceName,
    weight: numWeight,
    basePrice,
    extraPrice,
    totalPrice,
    currency: 'Kč',
    deliveryTime,
    breakdown
  });
});

// Branches API with filtering
app.get('/api/branches', (req, res) => {
  const query = (req.query.query || '').toLowerCase().trim();
  const type = (req.query.type || 'all').toLowerCase();
  const czechPoint = req.query.czechPoint === 'true';
  const cardPayment = req.query.cardPayment === 'true';
  const wheelchairAccess = req.query.wheelchairAccess === 'true';
  const nonstop = req.query.nonstop === 'true';

  let results = mockBranches;

  if (query) {
    results = results.filter(b =>
      b.name.toLowerCase().includes(query) ||
      b.address.toLowerCase().includes(query) ||
      b.city.toLowerCase().includes(query) ||
      b.zip.replace(/\s+/g, '').includes(query.replace(/\s+/g, ''))
    );
  }

  if (type && type !== 'all') {
    results = results.filter(b => b.type === type);
  }

  if (czechPoint) results = results.filter(b => b.czechPoint);
  if (cardPayment) results = results.filter(b => b.cardPayment);
  if (wheelchairAccess) results = results.filter(b => b.wheelchairAccess);
  if (nonstop) results = results.filter(b => b.nonstop);

  res.json({
    count: results.length,
    branches: results
  });
});

// Support and contact inquiry endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Vyplňte prosím jméno, email a text zprávy.' });
  }

  const ticketId = 'CP-' + Math.floor(100000 + Math.random() * 900000);
  console.log(`[contact inquiry] Ticket ${ticketId} from ${name} <${email}>: ${subject || 'Bez předmětu'}`);

  res.json({
    success: true,
    ticketId,
    message: `Váš požadavek byl úspěšně zaevidován pod číslem ${ticketId}. Odpovíme vám do 24 hodin.`
  });
});

// Demo user profile for logged-in portal simulation
app.get('/api/user/profile', (req, res) => {
  res.json({
    authenticated: true,
    user: {
      name: 'Jan Novák',
      username: 'jan.novak',
      email: 'jan.novak@priklad.cz',
      accountNumber: 'CP-9824102',
      activeParcelsCount: 2,
      savedAddresses: ['Na Strži 42, 140 00 Praha 4'],
      parcels: [
        {
          id: 'DR123456789CZ',
          type: 'Balík Do ruky',
          sender: 'SportovníPotřeby.cz',
          status: 'V doručování (dnes 14:00 - 16:00)',
          isIncoming: true
        },
        {
          id: 'NP987654321CZ',
          type: 'Balík Na poštu',
          sender: 'Knihy Svět s.r.o.',
          status: 'Uloženo na poště Praha 1 (PIN: 8472)',
          isIncoming: true
        }
      ]
    }
  });
});

// Anonymous demo analytics endpoint
app.post('/api/track', (req, res) => {
  const event = typeof req.body?.event === 'string' ? req.body.event.slice(0, 80) : 'unknown';
  console.log(`[demo analytics] ${event}`);
  res.status(204).end();
});

// Serve root static demo files strictly
app.get(['/', '/index.html'], (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(path.join(PROJECT_ROOT, 'index.html'));
});

const sendInner = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(path.join(PROJECT_ROOT, 'inner.html'));
};

app.get(['/aktuality', '/aktuality/:id', '/info/:slug'], sendInner);

// Explicit routes for verified front-end assets
const ALLOWED_STATIC_FILES = [
  'styles.css',
  'login.js',
  'inner.js',
  'test-script.js',
  'test-page.png',
  'test.html'
];

ALLOWED_STATIC_FILES.forEach(fileName => {
  app.get(`/${fileName}`, (req, res) => {
    res.sendFile(path.join(PROJECT_ROOT, fileName));
  });
});

// Static assets subdirectory if needed
app.use('/static', express.static(path.join(PROJECT_ROOT, 'static'), {
  dotfiles: 'ignore',
  index: false
}));

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Požadovaná API služba nebyla nalezena.' });
});

// General 404 fallback for any other unhandled paths
app.use((req, res) => {
  const accept = req.headers.accept || '';
  if (accept.includes('text/html')) {
    return res.sendFile(path.join(PROJECT_ROOT, 'index.html'));
  }
  res.status(404).send('Not found');
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`📮 Česká pošta Portal running at http://localhost:${PORT}`);
    console.log(`✅ Safe production demo ready`);
  });
}

module.exports = app;
