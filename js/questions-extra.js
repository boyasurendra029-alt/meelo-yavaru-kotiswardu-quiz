// questions-extra.js — more hand-written questions + generated question families.
// Tier 0 = Q1-10 (easy) ... Tier 4 = Q41-50 (hardest).
// Static format : { q, o:[CORRECT, wrong, wrong, wrong] }
// Generated     : { q, a:CORRECT, d:[pool of wrong answers], cat }   (3 wrong answers are picked randomly)
(function () {
  const E = [[], [], [], [], []];
  const s = (t, q, o) => E[t].push({ q, o });

  // ---------- tier 0 (easy) ----------
  s(0, "'జన గణ మన' జాతీయ గీతాన్ని ఎవరు రాశారు?", ['రవీంద్రనాథ్ ఠాగూర్', 'బంకించంద్ర ఛటర్జీ', 'ఇక్బాల్', 'సుబ్రహ్మణ్య భారతి']);
  s(0, 'ఒక గంటలో ఎన్ని నిమిషాలు ఉంటాయి?', ['60', '100', '30', '90']);
  s(0, 'మన India national bird ఏది?', ['నెమలి (Peacock)', 'చిలుక', 'కాకి', 'హంస']);
  s(0, 'ప్రపంచంలో అతి పెద్ద జంతువు ఏది?', ['Blue Whale', 'ఏనుగు', 'జిరాఫీ', 'Shark']);
  s(0, "Cricket లో 'Duck' అంటే ఏమిటి?", ['Zero (0) కి out అవ్వడం', 'Century కొట్టడం', 'Six కొట్టడం', 'Wicket తీయడం']);
  s(0, 'సూర్యుడు ఏ దిక్కున ఉదయిస్తాడు?', ['తూర్పు', 'పడమర', 'ఉత్తరం', 'దక్షిణం']);
  s(0, 'ఉగాది పచ్చడిలో ఎన్ని రుచులు (షడ్రుచులు) ఉంటాయి?', ['6', '4', '5', '8']);
  s(0, 'India లో ఎక్కువ మంది మొదటి భాషగా మాట్లాడే భాష ఏది?', ['హిందీ', 'తెలుగు', 'తమిళం', 'బెంగాలీ']);
  s(0, "తెలుగు వర్ణమాలలో 'అ' తర్వాత వచ్చే అక్షరం ఏది?", ['ఆ', 'ఇ', 'ఈ', 'ఉ']);
  s(0, 'ఒక రోజులో ఎన్ని గంటలు ఉంటాయి?', ['24', '12', '48', '36']);

  // ---------- tier 1 ----------
  s(1, 'Telangana రాష్ట్రం ఏర్పడిన రోజు (Formation Day) ఏది?', ['2 జూన్', '1 నవంబర్', '15 ఆగస్టు', '26 జనవరి']);
  s(1, 'India లో Republic Day ఎప్పుడు జరుపుకుంటాం?', ['26 జనవరి', '15 ఆగస్టు', '2 అక్టోబర్', '14 నవంబర్']);
  s(1, 'ABO system లో main blood groups ఎన్ని రకాలు?', ['4', '2', '3', '5']);
  s(1, 'లడ్డూ ప్రసాదానికి ప్రపంచ ప్రసిద్ధి చెందిన ఆలయం ఏది?', ['తిరుమల వెంకటేశ్వర ఆలయం', 'శ్రీశైలం', 'సింహాచలం', 'యాదాద్రి']);
  s(1, 'Android operating system ని ఇప్పుడు own చేస్తున్న company ఏది?', ['Google', 'Apple', 'Microsoft', 'Samsung']);
  s(1, 'ప్రపంచంలో అతి పెద్ద ocean ఏది?', ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean']);
  s(1, "'పుష్ప' లోని 'శ్రీవల్లి' పాటకు music director ఎవరు?", ['దేవి శ్రీ ప్రసాద్', 'తమన్', 'M.M. కీరవాణి', 'అనిరుధ్']);
  s(1, 'India లో area ప్రకారం అతి పెద్ద state ఏది?', ['Rajasthan', 'Madhya Pradesh', 'Maharashtra', 'Uttar Pradesh']);
  s(1, 'Hussain Sagar చుట్టూ ఉన్న ప్రసిద్ధ రోడ్డు పేరు ఏమిటి?', ['Necklace Road', 'Ring Road', 'Jubilee Road', 'Pearl Road']);
  s(1, 'Chandrayaan-3 ని ఏ launch vehicle ద్వారా పంపారు?', ['LVM3', 'PSLV', 'GSLV Mk II', 'SSLV']);

  // ---------- tier 2 ----------
  s(2, '2014 Nobel Peace Prize (Malala తో కలిసి) పొందిన Indian ఎవరు?', ['కైలాష్ సత్యార్థి', 'అమర్త్యసేన్', 'వెంకీ రామకృష్ణన్', 'అభిజిత్ బెనర్జీ']);
  s(2, '2019 లో India చేసిన \'Mission Shakti\' ప్రయోగం ఏమిటి?', ['Anti-satellite (ASAT) missile test', 'Moon landing', 'Mars orbiter', 'Nuclear test']);
  s(2, 'Indian Rupee (₹) symbol ని design చేసింది ఎవరు?', ['ఉదయ కుమార్', 'R.K. లక్ష్మణ్', 'రఘురామ్ రాజన్', 'సత్యజిత్ రే']);
  s(2, "తెలుగులో మొదటి talkie సినిమా 'భక్త ప్రహ్లాద' ఏ సంవత్సరంలో వచ్చింది?", ['1931', '1921', '1947', '1951']);
  s(2, 'Warangal ని రాజధానిగా చేసుకుని పాలించిన రాజవంశం ఏది?', ['కాకతీయులు', 'చోళులు', 'పల్లవులు', 'రాష్ట్రకూటులు']);
  s(2, 'రాణి రుద్రమదేవి ఏ వంశానికి చెందినవారు?', ['కాకతీయ వంశం', 'విజయనగర వంశం', 'చాళుక్య వంశం', 'కుతుబ్ షాహీ వంశం']);
  s(2, "Stock market లో 'Sensex' ఏ exchange కి చెందిన index?", ['BSE', 'NSE', 'MCX', 'NASDAQ']);
  s(2, "'Digital India' campaign ని ఏ సంవత్సరంలో ప్రారంభించారు?", ['2015', '2012', '2018', '2010']);
  s(2, "Cricket లో 'DRS' అంటే ఏమిటి?", ['Decision Review System', 'Direct Run Score', 'Double Run System', 'Display Replay Screen']);
  s(2, 'Olympics లో India కి మొదటి individual gold medal తెచ్చిన క్రీడాకారుడు ఎవరు?', ['Abhinav Bindra', 'Neeraj Chopra', 'Sushil Kumar', 'Leander Paes']);

  // ---------- tier 3 ----------
  s(3, 'Tokyo Olympics లో Neeraj Chopra gold medal గెలిచిన event ఏది?', ['Javelin throw', 'Discus throw', 'Long jump', 'Shot put']);
  s(3, 'Hubble Space Telescope ని ఏ సంస్థ launch చేసింది?', ['NASA', 'ISRO', 'ESA', 'JAXA']);
  s(3, 'India లో GST ఏ సంవత్సరంలో అమలులోకి వచ్చింది?', ['2017', '2015', '2019', '2014']);
  s(3, 'తిరుమల ఆలయం పక్కన ఉన్న పవిత్ర కోనేరు పేరు ఏమిటి?', ['స్వామి పుష్కరిణి', 'కపిల తీర్థం', 'గోదావరి కోనేరు', 'మానస సరోవరం']);
  s(3, 'ప్రపంచంలో అత్యంత ఎత్తైన భవనం Burj Khalifa ఏ నగరంలో ఉంది?', ['Dubai', 'Abu Dhabi', 'Doha', 'Riyadh']);
  s(3, 'Amazon company ని ఎవరు founded చేశారు?', ['Jeff Bezos', 'Elon Musk', 'Jack Ma', 'Larry Ellison']);
  s(3, "'Human Computer' గా పేరుపొందిన శకుంతలా దేవి ఏ రంగంలో ప్రసిద్ధి?", ['గణితం (Mental maths)', 'Cricket', 'రాజకీయాలు', 'సినిమా']);
  s(3, "India లో Nuclear Programme కి Father అని ఎవరిని పిలుస్తారు?", ['హోమీ జె. భాభా', 'విక్రమ్ సారాభాయ్', 'APJ అబ్దుల్ కలాం', 'రాజా రామన్న']);
  s(3, 'FIFA World Cup 2022 final లో Argentina penalties లో ఏ team ని ఓడించింది?', ['France', 'Croatia', 'Brazil', 'Morocco']);
  s(3, 'Chandrayaan-1 ఏ సంవత్సరంలో launch అయ్యింది?', ['2008', '2010', '2014', '2003']);

  // ---------- tier 4 (hardest) ----------
  s(4, "'మహాప్రస్థానం' కవితా సంపుటి రచయిత ఎవరు?", ['శ్రీశ్రీ', 'గుర్రం జాషువా', 'దాశరథి', 'సి. నారాయణ రెడ్డి']);
  s(4, "'కన్యాశుల్కం' నాటక రచయిత ఎవరు?", ['గురజాడ అప్పారావు', 'కందుకూరి వీరేశలింగం', 'చిలకమర్తి', 'విశ్వనాథ సత్యనారాయణ']);
  s(4, "'మా తెలుగు తల్లికి మల్లెపూదండ' గీత రచయిత ఎవరు?", ['శంకరంబాడి సుందరాచారి', 'దాశరథి', 'సి. నారాయణ రెడ్డి', 'శ్రీశ్రీ']);
  s(4, "'నా తెలంగాణ కోటి రతనాల వీణ' అన్న కవి ఎవరు?", ['దాశరథి కృష్ణమాచార్య', 'కాళోజీ నారాయణరావు', 'సురవరం ప్రతాపరెడ్డి', 'గద్దర్']);
  s(4, 'Osmania University ఏ సంవత్సరంలో స్థాపించారు?', ['1918', '1948', '1900', '1956']);
  s(4, 'Bhakra Nangal dam ఏ నది మీద ఉంది?', ['Sutlej', 'Beas', 'Ravi', 'Yamuna']);
  s(4, 'Satyajit Ray కి Honorary Oscar ఏ సంవత్సరంలో వచ్చింది?', ['1992', '1985', '1999', '1975']);
  s(4, 'UN Security Council లో permanent members ఎన్ని?', ['5', '7', '10', '15']);
  s(4, 'International cricket లో 100 centuries కొట్టిన ఏకైక batsman ఎవరు?', ['Sachin Tendulkar', 'Virat Kohli', 'Ricky Ponting', 'Jacques Kallis']);
  s(4, "BrahMos missile ని ఏ రెండు దేశాలు కలిసి develop చేశాయి?", ['India & Russia', 'India & USA', 'India & France', 'India & Israel']);

  // ---------- generated question families ----------
  const G = [[], [], [], [], []];
  const gen = (t, cat, q, a, d) => G[t].push({ q, a, d, cat });

  // State -> capital
  const caps = [
    [0, 'Telangana', 'Hyderabad'], [0, 'Tamil Nadu', 'Chennai'], [0, 'Karnataka', 'Bengaluru'], [0, 'Kerala', 'Thiruvananthapuram'],
    [0, 'Maharashtra', 'Mumbai'], [0, 'West Bengal', 'Kolkata'], [1, 'Rajasthan', 'Jaipur'], [1, 'Uttar Pradesh', 'Lucknow'],
    [1, 'Gujarat', 'Gandhinagar'], [1, 'Bihar', 'Patna'], [1, 'Odisha', 'Bhubaneswar'], [1, 'Madhya Pradesh', 'Bhopal'],
    [2, 'Assam', 'Dispur'], [2, 'Punjab', 'Chandigarh'], [2, 'Himachal Pradesh', 'Shimla'], [2, 'Uttarakhand', 'Dehradun'],
    [2, 'Jharkhand', 'Ranchi'], [2, 'Chhattisgarh', 'Raipur'], [2, 'Goa', 'Panaji'], [3, 'Sikkim', 'Gangtok'],
    [3, 'Manipur', 'Imphal'], [3, 'Meghalaya', 'Shillong'], [3, 'Nagaland', 'Kohima'], [3, 'Mizoram', 'Aizawl'],
    [3, 'Tripura', 'Agartala'], [3, 'Arunachal Pradesh', 'Itanagar'],
  ];
  const capPool = caps.map((x) => x[2]).concat(['Visakhapatnam', 'Pune', 'Mysuru', 'Cuttack', 'Kochi', 'Nagpur']);
  caps.forEach(([t, st, c]) => gen(t, 'capital', `${st} రాష్ట్ర రాజధాని ఏది?`, c, capPool));

  // Country -> capital
  const ccs = [
    [0, 'Japan', 'Tokyo'], [0, 'China', 'Beijing'], [0, 'UK', 'London'], [0, 'USA', 'Washington, D.C.'], [0, 'France', 'Paris'], [0, 'Pakistan', 'Islamabad'], [0, 'Russia', 'Moscow'],
    [1, 'Germany', 'Berlin'], [1, 'Italy', 'Rome'], [1, 'Egypt', 'Cairo'], [1, 'Nepal', 'Kathmandu'], [1, 'Bangladesh', 'Dhaka'], [1, 'Spain', 'Madrid'], [1, 'Thailand', 'Bangkok'], [1, 'Indonesia', 'Jakarta'],
    [2, 'Australia', 'Canberra'], [2, 'Canada', 'Ottawa'], [2, 'Brazil', 'Brasília'], [2, 'Turkey', 'Ankara'], [2, 'Saudi Arabia', 'Riyadh'], [2, 'Iran', 'Tehran'], [2, 'Afghanistan', 'Kabul'],
    [2, 'Bhutan', 'Thimphu'], [2, 'Malaysia', 'Kuala Lumpur'], [2, 'South Korea', 'Seoul'], [2, 'Vietnam', 'Hanoi'], [2, 'Argentina', 'Buenos Aires'], [2, 'Greece', 'Athens'],
    [3, 'Switzerland', 'Bern'], [3, 'Nigeria', 'Abuja'], [3, 'Kenya', 'Nairobi'], [3, 'Myanmar', 'Naypyidaw'], [3, 'New Zealand', 'Wellington'], [3, 'Portugal', 'Lisbon'],
    [4, 'Norway', 'Oslo'], [4, 'Sweden', 'Stockholm'], [4, 'Ukraine', 'Kyiv'], [4, 'Poland', 'Warsaw'], [4, 'Peru', 'Lima'], [4, 'Cuba', 'Havana'],
    [4, 'Ethiopia', 'Addis Ababa'], [4, 'Ghana', 'Accra'], [4, 'UAE', 'Abu Dhabi'], [4, 'Qatar', 'Doha'], [4, 'Chile', 'Santiago'], [4, 'Iraq', 'Baghdad'],
  ];
  const ccPool = ccs.map((x) => x[2]).concat(['Sydney', 'Toronto', 'Istanbul', 'Rio de Janeiro', 'Geneva', 'Lagos', 'Dubai', 'Johannesburg']);
  ccs.forEach(([t, c, cap]) => gen(t, 'country', `${c} దేశ రాజధాని ఏది?`, cap, ccPool));

  // Chemical symbols
  const els = [
    [0, 'Hydrogen', 'H'], [0, 'Oxygen', 'O'], [0, 'Carbon', 'C'], [0, 'Nitrogen', 'N'],
    [1, 'Sodium', 'Na'], [1, 'Iron', 'Fe'], [1, 'Calcium', 'Ca'], [1, 'Helium', 'He'], [1, 'Chlorine', 'Cl'], [1, 'Silicon', 'Si'],
    [2, 'Copper', 'Cu'], [2, 'Silver', 'Ag'], [2, 'Zinc', 'Zn'], [2, 'Aluminium', 'Al'], [2, 'Potassium', 'K'], [2, 'Magnesium', 'Mg'], [2, 'Sulphur', 'S'],
    [3, 'Lead', 'Pb'], [3, 'Mercury', 'Hg'], [3, 'Tin', 'Sn'], [4, 'Tungsten', 'W'], [4, 'Iodine', 'I'], [4, 'Phosphorus', 'P'], [4, 'Platinum', 'Pt'], [4, 'Neon', 'Ne'], [4, 'Uranium', 'U'],
  ];
  const elPool = els.map((x) => x[2]).concat(['Au', 'Go', 'Gd', 'Ir', 'Sl', 'Mn', 'Cr', 'Ti']);
  els.forEach(([t, n, sy]) => gen(t, 'element', `Periodic table లో '${n}' symbol ఏది?`, sy, elPool));

  // Sports: players per team
  const sp = [
    [0, 'Cricket', '11'], [0, 'Hockey', '11'], [1, 'Kabaddi (court లో)', '7'], [1, 'Basketball', '5'], [1, 'Volleyball', '6'], [2, 'Baseball', '9'], [2, 'Rugby Union', '15'],
  ];
  sp.forEach(([t, n, a]) => gen(t, 'sport', `${n} లో ఒక్కో team తరపున ఎంత మంది players ఆడతారు?`, a, ['11', '7', '5', '6', '9', '15', '8', '10', '12']));

  // Telugu movies -> hero / director
  const heroPool = ['Allu Arjun', 'Ram Charan', 'Prabhas', 'Mahesh Babu', 'Pawan Kalyan', 'Jr NTR', 'Chiranjeevi', 'Balakrishna', 'Nani', 'Vijay Deverakonda', 'Ravi Teja', 'Nagarjuna', 'Venkatesh', 'Nithiin'];
  const heroes = [
    [0, 'Pushpa', 'Allu Arjun'], [0, 'Magadheera', 'Ram Charan'], [0, 'Baahubali', 'Prabhas'], [0, 'Pokiri', 'Mahesh Babu'], [0, 'Gabbar Singh', 'Pawan Kalyan'],
    [0, 'Indra', 'Chiranjeevi'], [1, 'Temper', 'Jr NTR'], [1, 'Simha', 'Balakrishna'], [1, 'Arjun Reddy', 'Vijay Deverakonda'], [1, 'Srimanthudu', 'Mahesh Babu'],
    [1, 'Rangasthalam', 'Ram Charan'], [1, 'Ala Vaikunthapurramuloo', 'Allu Arjun'], [1, 'Khaidi No. 150', 'Chiranjeevi'], [1, 'Mirchi', 'Prabhas'],
    [2, 'Sye', 'Nithiin'], [2, 'Vikramarkudu', 'Ravi Teja'], [2, 'Akhanda', 'Balakrishna'], [2, 'Aravinda Sametha', 'Jr NTR'], [2, 'Geetha Govindam', 'Vijay Deverakonda'], [2, 'Jersey (2019)', 'Nani'], [2, 'Okkadu', 'Mahesh Babu'],
  ];
  heroes.forEach(([t, m, h]) => gen(t, 'hero', `'${m}' సినిమాలో hero ఎవరు?`, h, heroPool));
  const dirPool = ['S.S. Rajamouli', 'Sukumar', 'Trivikram', 'Koratala Siva', 'Puri Jagannadh', 'Boyapati Srinu', 'Harish Shankar', 'V.V. Vinayak', 'Nag Ashwin', 'Sandeep Reddy Vanga', 'Parasuram', 'K. Viswanath', 'Srinu Vaitla', 'Hanu Raghavapudi'];
  const dirs = [
    [0, 'RRR', 'S.S. Rajamouli'], [0, 'Magadheera', 'S.S. Rajamouli'], [0, 'Pushpa', 'Sukumar'], [0, 'Pokiri', 'Puri Jagannadh'],
    [1, 'Arjun Reddy', 'Sandeep Reddy Vanga'], [1, 'Ala Vaikunthapurramuloo', 'Trivikram'], [1, 'Srimanthudu', 'Koratala Siva'], [1, 'Mahanati', 'Nag Ashwin'],
    [1, 'Gabbar Singh', 'Harish Shankar'], [1, 'Eega', 'S.S. Rajamouli'], [1, 'Rangasthalam', 'Sukumar'],
    [2, 'Simha', 'Boyapati Srinu'], [2, 'Khaidi No. 150', 'V.V. Vinayak'], [2, 'Geetha Govindam', 'Parasuram'], [2, 'Dookudu', 'Srinu Vaitla'], [2, 'Sita Ramam', 'Hanu Raghavapudi'], [2, 'Kalki 2898 AD', 'Nag Ashwin'],
    [3, 'Shankarabharanam', 'K. Viswanath'], [3, 'Sagara Sangamam', 'K. Viswanath'], [3, 'Athadu', 'Trivikram'],
  ];
  dirs.forEach(([t, m, d]) => gen(t, 'director', `'${m}' సినిమా director ఎవరు?`, d, dirPool));

  // Inventions / discoveries
  const invPool = ['Alexander Graham Bell', 'Thomas Edison', 'Alexander Fleming', 'Albert Einstein', 'Tim Berners-Lee', 'Johannes Gutenberg', 'Wright Brothers', 'Alfred Nobel', 'Dmitri Mendeleev', 'Jonas Salk', 'Charles Darwin', 'Isaac Newton', 'Guglielmo Marconi', 'James Watt', 'Charles Babbage', 'Louis Pasteur', 'Michael Faraday', 'Nikola Tesla', 'Galileo Galilei'];
  const invs = [
    [0, 'Gravity (గురుత్వాకర్షణ) సిద్ధాంతాన్ని ఇచ్చింది ఎవరు?', 'Isaac Newton'],
    [1, 'Telephone ని invent చేసింది ఎవరు?', 'Alexander Graham Bell'], [1, 'Electric bulb ని practical గా అభివృద్ధి చేసింది ఎవరు?', 'Thomas Edison'],
    [1, 'Theory of Relativity ని ఇచ్చింది ఎవరు?', 'Albert Einstein'], [1, 'మొదటి aeroplane ఎగరేసింది ఎవరు?', 'Wright Brothers'], [1, 'Theory of Evolution ని ప్రతిపాదించింది ఎవరు?', 'Charles Darwin'],
    [2, 'Penicillin ని కనుగొన్నది ఎవరు?', 'Alexander Fleming'], [2, 'World Wide Web ని invent చేసింది ఎవరు?', 'Tim Berners-Lee'], [2, 'Printing press ని invent చేసింది ఎవరు?', 'Johannes Gutenberg'],
    [2, 'Dynamite ని invent చేసింది ఎవరు?', 'Alfred Nobel'], [2, 'Steam engine ని మెరుగుపరిచి విప్లవం తెచ్చింది ఎవరు?', 'James Watt'],
    [3, 'Periodic Table ని రూపొందించింది ఎవరు?', 'Dmitri Mendeleev'], [3, 'Polio vaccine ని కనుగొన్నది ఎవరు?', 'Jonas Salk'], [4, 'Wireless radio telegraph కి ప్రసిద్ధి చెందినది ఎవరు?', 'Guglielmo Marconi'],
    [4, 'Computer కి మార్గదర్శి అయిన Analytical Engine ని రూపొందించింది ఎవరు?', 'Charles Babbage'], [4, 'Rabies vaccine ని కనుగొన్నది ఎవరు?', 'Louis Pasteur'], [4, 'Electromagnetic induction ని కనుగొన్నది ఎవరు?', 'Michael Faraday'],
  ];
  invs.forEach(([t, q, a]) => gen(t, 'invention', q, a, invPool));

  // Books -> author (incl. Telugu literature)
  const authPool = ['వాల్మీకి', 'వ్యాసుడు', 'కాళిదాసు', 'రవీంద్రనాథ్ ఠాగూర్', 'చాణక్యుడు (కౌటిల్యుడు)', 'APJ అబ్దుల్ కలాం', 'జవహర్‌లాల్ నెహ్రూ', 'William Shakespeare', 'J.K. Rowling', 'విష్ణు శర్మ',
    'అల్లసాని పెద్దన', 'శ్రీకృష్ణదేవరాయలు', 'నంది తిమ్మన', 'గురజాడ అప్పారావు', 'విశ్వనాథ సత్యనారాయణ', 'శ్రీశ్రీ', 'బుచ్చిబాబు', 'గుడిపాటి వెంకట చలం', 'పోతన', 'తిక్కన', 'నన్నయ్య', 'ఎర్రన', 'దేవరకొండ బాలగంగాధర తిలక్'];
  const auth = [
    [1, 'రామాయణం ఆదికావ్యాన్ని రచించింది ఎవరు?', 'వాల్మీకి'], [1, 'మహాభారతం (సంస్కృతం) రచించింది ఎవరు?', 'వ్యాసుడు'], [1, "'Wings of Fire' పుస్తక రచయిత ఎవరు?", 'APJ అబ్దుల్ కలాం'],
    [1, "'Harry Potter' పుస్తకాలు రాసింది ఎవరు?", 'J.K. Rowling'], [1, "'Romeo and Juliet' నాటక రచయిత ఎవరు?", 'William Shakespeare'],
    [2, "'అభిజ్ఞాన శాకుంతలం' రచించింది ఎవరు?", 'కాళిదాసు'], [2, "'గీతాంజలి' రచయిత ఎవరు?", 'రవీంద్రనాథ్ ఠాగూర్'], [2, "'Discovery of India' పుస్తక రచయిత ఎవరు?", 'జవహర్‌లాల్ నెహ్రూ'],
    [2, "'అర్థశాస్త్రం' రచించింది ఎవరు?", 'చాణక్యుడు (కౌటిల్యుడు)'], [2, "'పంచతంత్రం' కథలను రచించింది ఎవరు?", 'విష్ణు శర్మ'], [2, "'ఆంధ్ర మహా భాగవతం' ని తెలుగులో రాసింది ఎవరు?", 'పోతన'],
    [3, "'మనుచరిత్రము' ప్రబంధ రచయిత ఎవరు?", 'అల్లసాని పెద్దన'], [3, "'పారిజాతాపహరణం' రచయిత ఎవరు?", 'నంది తిమ్మన'], [3, "'వేయిపడగలు' నవల రచయిత ఎవరు?", 'విశ్వనాథ సత్యనారాయణ'],
    [3, "'చివరకు మిగిలేది' నవల రచయిత ఎవరు?", 'బుచ్చిబాబు'], [3, "'మైదానం' నవల రచయిత ఎవరు?", 'గుడిపాటి వెంకట చలం'], [3, "'దేశమును ప్రేమించుమన్న' గీత రచయిత ఎవరు?", 'గురజాడ అప్పారావు'],
    [4, "'అమృతం కురిసిన రాత్రి' కవితా సంపుటి రచయిత ఎవరు?", 'దేవరకొండ బాలగంగాధర తిలక్'], [4, "'ఉభయ కవి మిత్రుడు' అనే బిరుదు ఉన్న కవి ఎవరు?", 'తిక్కన'],
  ];
  auth.forEach(([t, q, a]) => gen(t, 'book', q, a, authPool.filter((x) => x !== a)));

  // Monuments / places -> city or state
  const cityPool = ['Mumbai', 'Delhi', 'Jaipur', 'Kolkata', 'Amritsar', 'Madurai', 'Mysuru', 'Hyderabad', 'Vijayawada', 'Visakhapatnam', 'Agra', 'Varanasi', 'Chennai', 'Bengaluru'];
  const cityQ = [
    [0, 'Charminar', 'Hyderabad'], [0, 'Gateway of India', 'Mumbai'], [0, 'Red Fort', 'Delhi'], 
    [1, 'Hawa Mahal', 'Jaipur'], [1, 'Howrah Bridge', 'Kolkata'], [1, 'Golden Temple', 'Amritsar'], [1, 'Meenakshi Amman Temple', 'Madurai'], [1, 'Kanaka Durga Temple', 'Vijayawada'],
    [2, 'Mysore Palace', 'Mysuru'], [2, 'Qutub Minar', 'Delhi'], [2, 'Victoria Memorial', 'Kolkata'], [2, 'Simhachalam Temple', 'Visakhapatnam'], [2, 'Salar Jung Museum', 'Hyderabad'], [2, 'Ramoji Film City', 'Hyderabad'],
  ];
  cityQ.forEach(([t, p, a]) => gen(t, 'place', `${p} ఏ నగరంలో ఉంది?`, a, cityPool));
  const statePool = ['Andhra Pradesh', 'Telangana', 'Odisha', 'Karnataka', 'Madhya Pradesh', 'Maharashtra', 'Gujarat', 'Tamil Nadu', 'Kerala', 'Rajasthan', 'Uttar Pradesh', 'Punjab', 'West Bengal', 'Bihar'];
  const stateQ = [
    [1, 'Araku Valley', 'Andhra Pradesh'], [1, 'Srisailam మల్లికార్జున స్వామి ఆలయం', 'Andhra Pradesh'], [1, 'Statue of Unity', 'Gujarat'],
    [2, 'Hampi', 'Karnataka'], [2, 'Konark Sun Temple', 'Odisha'], [2, 'Khajuraho Temples', 'Madhya Pradesh'], [2, 'Ajanta Caves', 'Maharashtra'],
    [2, 'Bhadrachalam సీతారామ ఆలయం', 'Telangana'], [2, 'Yadadri లక్ష్మీ నరసింహ ఆలయం', 'Telangana'], [4, 'Lepakshi Temple (వీరభద్ర ఆలయం)', 'Andhra Pradesh'],
    [4, 'Borra Caves', 'Andhra Pradesh'], [4, 'Sanchi Stupa', 'Madhya Pradesh'], [4, 'Warangal వేయి స్తంభాల గుడి', 'Telangana'],
  ];
  stateQ.forEach(([t, p, a]) => gen(t, 'place', `${p} ఏ రాష్ట్రంలో ఉంది?`, a, statePool));

  // Currencies
  const curPool = ['Yen', 'Pound Sterling', 'US Dollar', 'Riyal', 'Dirham', 'Yuan', 'Ruble', 'Won', 'Baht', 'Ringgit', 'Franc', 'Rand', 'Real', 'Lira', 'Taka', 'Euro'];
  const curs = [
    [1, 'Japan', 'Yen'], [1, 'UK', 'Pound Sterling'], [1, 'USA', 'US Dollar'], [1, 'Eurozone (ఐరోపా దేశాలు)', 'Euro'],
    [2, 'Saudi Arabia', 'Riyal'], [2, 'UAE', 'Dirham'], [2, 'China', 'Yuan'], [2, 'Russia', 'Ruble'], [3, 'South Korea', 'Won'], [3, 'Thailand', 'Baht'],
    [3, 'Malaysia', 'Ringgit'], [3, 'Switzerland', 'Franc'], [3, 'South Africa', 'Rand'], [4, 'Brazil', 'Real'], [4, 'Turkey', 'Lira'], [4, 'Bangladesh', 'Taka'],
  ];
  curs.forEach(([t, c, a]) => gen(t, 'currency', `${c} దేశపు currency పేరు ఏమిటి?`, a, curPool.filter((x) => x !== a)));

  // ---- export ----
  window.QUESTIONS = window.QUESTIONS.map((arr, t) => arr.concat(E[t]));
  window.GENERATED = G;
})();
