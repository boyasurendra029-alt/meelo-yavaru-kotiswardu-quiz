// questions.js — hand-written questions (more in questions-extra.js).
// Format: { q: "question", o: ["CORRECT answer", "wrong", "wrong", "wrong"] }
// The FIRST option is always the correct one. The game shuffles A/B/C/D automatically.
// Add your own in the setup screen (Custom questions) or edit this file.

window.TOTAL_Q = 50; // questions per live
// 50 prize steps: ₹1,000 -> ₹10 Cr (every 10 questions the prize grows 10x)
window.PRIZES = [
  1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 8000, 10000,
  12000, 15000, 20000, 25000, 30000, 40000, 50000, 60000, 80000, 100000,
  125000, 150000, 200000, 250000, 300000, 400000, 500000, 600000, 800000, 1000000,
  1250000, 1500000, 2000000, 2500000, 3000000, 4000000, 5000000, 6000000, 8000000, 10000000,
  12500000, 15000000, 20000000, 25000000, 30000000, 40000000, 50000000, 60000000, 80000000, 100000000,
];

const OLD = [
  // ---- Level 1 : ₹1,000 ----
  [
    { q: 'వారంలో మొత్తం ఎన్ని రోజులు ఉంటాయి?', o: ['7', '5', '6', '8'] },
    { q: 'పగలు ఆకాశంలో కనిపించే star ఏది?', o: ['సూర్యుడు', 'చంద్రుడు', 'శుక్రుడు (Venus)', 'అంగారకుడు (Mars)'] },
    { q: 'మన India national animal ఏది?', o: ['పులి (Tiger)', 'సింహం', 'ఏనుగు', 'నెమలి'] },
    { q: 'Cricket లో ఒక over కి ఎన్ని balls ఉంటాయి?', o: ['6', '4', '5', '8'] },
    { q: 'మన India national flag మధ్యలో ఉండే చక్రం పేరు ఏమిటి?', o: ['అశోక చక్రం', 'సుదర్శన చక్రం', 'కాల చక్రం', 'ధర్మ దండం'] },
    { q: 'తెలుగు మాట్లాడే రెండు రాష్ట్రాలు (states) ఏవి?', o: ['ఆంధ్రప్రదేశ్ & తెలంగాణ', 'కర్ణాటక & కేరళ', 'తమిళనాడు & మహారాష్ట్ర', 'ఒడిశా & గుజరాత్'] },
  ],
  // ---- Level 2 : ₹2,000 ----
  [
    { q: 'మన India capital city ఏది?', o: ['New Delhi', 'Mumbai', 'Kolkata', 'Chennai'] },
    { q: 'ఇంద్రధనస్సు (Rainbow) లో ఎన్ని రంగులు ఉంటాయి?', o: ['7', '5', '6', '9'] },
    { q: 'Hyderabad నగరం మధ్యలో ప్రవహించే నది ఏది?', o: ['మూసీ', 'గోదావరి', 'కృష్ణా', 'తుంగభద్ర'] },
    { q: 'తెలుగు వారి కొత్త సంవత్సరం పండుగ ఏది?', o: ['ఉగాది', 'సంక్రాంతి', 'దసరా', 'దీపావళి'] },
    { q: 'Tirumala లో కొలువై ఉన్న దేవుడు ఎవరు?', o: ['వెంకటేశ్వర స్వామి', 'శివుడు', 'గణపతి', 'హనుమంతుడు'] },
    { q: 'నీళ్లు సాధారణంగా ఎన్ని డిగ్రీల Celsius వద్ద మరుగుతాయి (boil అవుతాయి)?', o: ['100°C', '90°C', '80°C', '120°C'] },
  ],
  // ---- Level 3 : ₹5,000 ----
  [
    { q: 'Taj Mahal ఏ city లో ఉంది?', o: ['Agra', 'Delhi', 'Jaipur', 'Lucknow'] },
    { q: 'మన శరీరంలో blood ని pump చేసే organ ఏది?', o: ['గుండె (Heart)', 'ఊపిరితిత్తులు', 'కాలేయం (Liver)', 'మూత్రపిండాలు (Kidneys)'] },
    { q: 'Andhra Pradesh capital Amaravati ఏ నది ఒడ్డున ఉంది?', o: ['కృష్ణా', 'గోదావరి', 'పెన్నా', 'తుంగభద్ర'] },
    { q: 'India కి Independence ఏ సంవత్సరంలో వచ్చింది?', o: ['1947', '1942', '1950', '1935'] },
    { q: 'Football match లో ఒక్కో team తరపున field లో ఎంత మంది players ఆడతారు?', o: ['11', '9', '10', '12'] },
    { q: "'RRR' movie కి Oscar తెచ్చిపెట్టిన పాట ఏది?", o: ['నాటు నాటు', 'కొమురం భీముడో', 'ఎత్తరా జెండా', 'దోస్తీ'] },
  ],
  // ---- Level 4 : ₹10,000 ----
  [
    { q: "Planets లో 'Red Planet' అని ఏ గ్రహాన్ని పిలుస్తారు?", o: ['Mars (అంగారకుడు)', 'Venus', 'Jupiter', 'Saturn'] },
    { q: 'India కి మొదటి Prime Minister ఎవరు?', o: ['జవహర్‌లాల్ నెహ్రూ', 'సర్దార్ పటేల్', 'మహాత్మా గాంధీ', 'లాల్ బహదూర్ శాస్త్రి'] },
    { q: 'Indian Constitution ఏ రోజు నుంచి అమలులోకి (come into effect) వచ్చింది?', o: ['26 January 1950', '15 August 1947', '2 October 1950', '14 April 1948'] },
    { q: 'Google ని ఎవరు founded చేశారు?', o: ['Larry Page & Sergey Brin', 'Bill Gates & Paul Allen', 'Steve Jobs & Wozniak', 'Mark Zuckerberg & Eduardo'] },
    { q: "Cricket లో 'Master Blaster' అని ఎవరిని పిలుస్తారు?", o: ['Sachin Tendulkar', 'MS Dhoni', 'Virat Kohli', 'Rahul Dravid'] },
    { q: "'బాహుబలి' సినిమా director ఎవరు?", o: ['S.S. రాజమౌళి', 'త్రివిక్రమ్', 'సుకుమార్', 'కొరటాల శివ'] },
  ],
  // ---- Level 5 : ₹25,000 ----
  [
    { q: 'మన solar system లో అతి పెద్ద planet ఏది?', o: ['Jupiter', 'Saturn', 'Neptune', 'Earth'] },
    { q: 'ధవళేశ్వరం barrage ఏ నది మీద ఉంది?', o: ['గోదావరి', 'కృష్ణా', 'పెన్నా', 'వంశధార'] },
    { q: 'నాగార్జున సాగర్ dam ఏ నది మీద ఉంది?', o: ['కృష్ణా', 'గోదావరి', 'తుంగభద్ర', 'మంజీర'] },
    { q: 'Olympics ఎన్ని సంవత్సరాలకు ఒకసారి జరుగుతాయి?', o: ['4', '2', '3', '5'] },
    { q: "Computer లో 'CPU' full form ఏమిటి?", o: ['Central Processing Unit', 'Central Program Unit', 'Computer Personal Unit', 'Control Processing Utility'] },
    { q: 'Hyderabad లో Charminar ని ఎవరు కట్టించారు?', o: ['Muhammad Quli Qutb Shah', 'Nizam Mir Osman Ali Khan', 'Shah Jahan', 'Akbar'] },
  ],
  // ---- Level 6 : ₹50,000 ----
  [
    { q: 'India కి మొదటి woman Prime Minister ఎవరు?', o: ['ఇందిరా గాంధీ', 'సరోజినీ నాయుడు', 'ప్రతిభా పాటిల్', 'సుచేతా కృపలానీ'] },
    { q: 'Periodic table లో Gold (బంగారం) symbol ఏమిటి?', o: ['Au', 'Ag', 'Go', 'Gd'] },
    { q: 'పొట్టి శ్రీరాములు గారు ఎందుకు ప్రసిద్ధి?', o: ['ఆంధ్ర రాష్ట్రం కోసం ఆమరణ నిరాహార దీక్ష చేసి అమరులయ్యారు', 'India కి first President అయ్యారు', 'తెలుగులో మొదటి సినిమా తీశారు', 'Hyderabad ని స్థాపించారు'] },
    { q: "Internet లో 'WWW' అంటే ఏమిటి?", o: ['World Wide Web', 'World Web Wide', 'Wide World Web', 'Web World Wide'] },
    { q: 'పెద్దవాళ్ళ (adult) శరీరంలో మొత్తం ఎముకలు ఎన్ని ఉంటాయి?', o: ['206', '306', '106', '256'] },
    { q: '2007 లో జరిగిన మొదటి T20 World Cup గెలిచిన team ఏది?', o: ['India', 'Pakistan', 'Australia', 'Sri Lanka'] },
  ],
  // ---- Level 7 : ₹1,00,000 ----
  [
    { q: "తెలుగు సాహిత్యంలో 'ఆదికవి' అని ఎవరిని పిలుస్తారు?", o: ['నన్నయ్య', 'తిక్కన', 'ఎర్రన', 'పోతన'] },
    { q: 'మహాభారతాన్ని తెలుగులోకి అనువదించిన కవిత్రయంలో లేని వారు ఎవరు?', o: ['పోతన', 'నన్నయ్య', 'తిక్కన', 'ఎర్రన'] },
    { q: 'Light speed (కాంతి వేగం) సుమారు ఎంత?', o: ['3,00,000 km/s', '30,000 km/s', '3,000 km/s', '3,00,00,000 km/s'] },
    { q: 'ISRO Chandrayaan-3 Moon మీద soft landing ఏ సంవత్సరంలో చేసింది?', o: ['2023', '2019', '2021', '2024'] },
    { q: 'FIFA World Cup 2022 ఏ దేశంలో జరిగింది?', o: ['Qatar', 'Russia', 'Brazil', 'Germany'] },
    { q: 'Bharat Ratna పొందిన మొదటి cricketer ఎవరు?', o: ['Sachin Tendulkar', 'Kapil Dev', 'Sunil Gavaskar', 'MS Dhoni'] },
  ],
  // ---- Level 8 : ₹2,00,000 ----
  [
    { q: 'తిరుమల శ్రీవారి ఆలయం ఏ కొండల (hills) మీద ఉంది?', o: ['శేషాచలం', 'నల్లమల', 'వెలిగొండ', 'ఎర్రమల'] },
    { q: "'UPI' full form ఏమిటి?", o: ['Unified Payments Interface', 'Universal Payment Interface', 'United Payments Internet', 'Unified Paying Instrument'] },
    { q: "India లో 'Green Revolution' కి Father అని ఎవరిని అంటారు?", o: ['M.S. స్వామినాథన్', 'వర్గీస్ కురియన్', 'APJ అబ్దుల్ కలాం', 'హోమీ భాభా'] },
    { q: "'విశ్వదాభిరామ వినుర వేమ' అనే మకుటం ఏ శతకానిది?", o: ['వేమన శతకం', 'సుమతీ శతకం', 'దాశరథీ శతకం', 'భాస్కర శతకం'] },
    { q: 'Microsoft company ని (Paul Allen తో కలిసి) ఎవరు స్థాపించారు?', o: ['Bill Gates', 'Steve Jobs', 'Elon Musk', 'Jeff Bezos'] },
    { q: 'Chess game మొదలులో ఒక్కో player కి ఎన్ని pieces ఉంటాయి?', o: ['16', '12', '18', '14'] },
  ],
  // ---- Level 9 : ₹5,00,000 ----
  [
    { q: "India మొదటి satellite 'ఆర్యభట్ట' ని ఏ సంవత్సరంలో launch చేశారు?", o: ['1975', '1969', '1980', '1984'] },
    { q: "India లో అతి పెద్ద lagoon అయిన 'చిల్కా సరస్సు' ఏ state లో ఉంది?", o: ['Odisha', 'Andhra Pradesh', 'Tamil Nadu', 'West Bengal'] },
    { q: 'DNA double helix structure ని కనుగొన్నది ఎవరు?', o: ['Watson & Crick', 'Newton & Einstein', 'Darwin & Mendel', 'Pasteur & Koch'] },
    { q: 'Sachin Tendulkar ODI లో మొదటి double century (200*) ఏ team మీద కొట్టాడు?', o: ['South Africa', 'Australia', 'Pakistan', 'England'] },
    { q: 'Periodic table లో atomic number 1 ఉన్న element ఏది?', o: ['Hydrogen', 'Helium', 'Oxygen', 'Carbon'] },
    { q: 'Right-angled triangle లో hypotenuse అంటే ఏమిటి?', o: ['Right angle కి ఎదురుగా ఉండే పొడవైన భుజం', 'అతి చిన్న భుజం', 'Base మాత్రమే', 'Height మాత్రమే'] },
  ],
  // ---- Level 10 : ₹10,00,000 ----
  [
    { q: 'Mount Everest ఎత్తు సుమారు ఎంత?', o: ['8,849 మీటర్లు', '7,849 మీటర్లు', '9,849 మీటర్లు', '8,048 మీటర్లు'] },
    { q: 'Nobel Prize (Literature) పొందిన మొదటి Indian ఎవరు?', o: ['రవీంద్రనాథ్ ఠాగూర్', 'C.V. రామన్', 'అమర్త్యసేన్', 'మదర్ థెరిసా'] },
    { q: 'C.V. Raman కి Nobel Prize ఏ రంగంలో వచ్చింది?', o: ['Physics', 'Chemistry', 'Medicine', 'Literature'] },
    { q: '1983 Cricket World Cup final లో India ఏ team ని ఓడించింది?', o: ['West Indies', 'Australia', 'England', 'Pakistan'] },
    { q: 'Bitcoin ని create చేసిన వ్యక్తి గా చెప్పుకునే pseudonym (మారుపేరు) ఏది?', o: ['Satoshi Nakamoto', 'Vitalik Buterin', 'Elon Musk', 'Charlie Lee'] },
    { q: 'ఉమ్మడి ఆంధ్రప్రదేశ్ రాష్ట్రం (Hyderabad తో కలిపి) ఏ రోజున ఏర్పడింది?', o: ['1 November 1956', '1 October 1953', '2 June 2014', '15 August 1947'] },
  ],
  // ---- Level 11 : ₹25,00,000 ----
  [
    { q: 'Hyderabad నగరాన్ని స్థాపించింది ఎవరు?', o: ['Muhammad Quli Qutb Shah', 'Asaf Jah I', 'శ్రీకృష్ణదేవరాయలు', 'గణపతిదేవుడు'] },
    { q: "'ఆంధ్ర భోజుడు' అని ఎవరిని పిలుస్తారు?", o: ['శ్రీకృష్ణదేవరాయలు', 'హరిహరరాయలు', 'తిమ్మరుసు', 'అచ్యుతరాయలు'] },
    { q: 'Indian Constitution Drafting Committee Chairman ఎవరు?', o: ['డా. B.R. అంబేద్కర్', 'డా. రాజేంద్ర ప్రసాద్', 'జవహర్‌లాల్ నెహ్రూ', 'సర్దార్ పటేల్'] },
    { q: 'Chandrayaan-3 Moon మీద landing అయిన ప్రదేశానికి పెట్టిన పేరు ఏమిటి?', o: ['శివ శక్తి పాయింట్', 'విక్రమ్ పాయింట్', 'జవహర్ పాయింట్', 'గాంధీ పాయింట్'] },
    { q: 'Vitamin C లోపం వల్ల వచ్చే వ్యాధి ఏది?', o: ['Scurvy', 'Rickets', 'Beriberi', 'Night blindness'] },
    { q: 'ODI cricket లో అత్యధిక runs (18,000 పైగా) కొట్టిన Indian ఎవరు?', o: ['Sachin Tendulkar', 'Virat Kohli', 'Rohit Sharma', 'Sourav Ganguly'] },
  ],
  // ---- Level 12 : ₹50,00,000 ----
  [
    { q: 'Brahmaputra నది Tibet లో ఏ పేరుతో ప్రవహిస్తుంది?', o: ['Yarlung Tsangpo', 'Mekong', 'Salween', 'Indus'] },
    { q: 'ప్రపంచంలో అతి లోతైన Mariana Trench ఏ ocean లో ఉంది?', o: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'] },
    { q: 'అల్లూరి సీతారామరాజు ఏ తిరుగుబాటుకు (rebellion) నాయకత్వం వహించారు?', o: ['రంపా తిరుగుబాటు', 'Quit India ఉద్యమం', 'చంపారన్ సత్యాగ్రహం', 'Simon Go Back'] },
    { q: "ప్రసిద్ధ 'కోహినూర్' వజ్రం దొరికిన గని ఏ ప్రాంతంలో ఉంది?", o: ['గుంటూరు జిల్లా కొల్లూరు (కృష్ణా నది ఒడ్డు)', 'జైపూర్, రాజస్థాన్', 'కోలార్, కర్ణాటక', 'బాలాసోర్, ఒడిశా'] },
    { q: "Website address 'HTTPS' లో 'S' అంటే ఏమిటి?", o: ['Secure', 'Server', 'Simple', 'Speed'] },
    { q: 'కాళిదాసు రాసిన ప్రసిద్ధ నాటకం ఏది?', o: ['అభిజ్ఞాన శాకుంతలం', 'ముద్రారాక్షసం', 'మృచ్ఛకటికం', 'స్వప్నవాసవదత్తం'] },
  ],
  // ---- Level 13 : ₹1 Crore ----
  [
    { q: 'శ్రీకృష్ణదేవరాయలు రాసిన తెలుగు ప్రబంధం ఏది?', o: ['ఆముక్తమాల్యద', 'మనుచరిత్ర', 'వసుచరిత్ర', 'పారిజాతాపహరణం'] },
    { q: '1948 లో Hyderabad State ని India లో కలపడానికి చేసిన operation పేరు ఏమిటి?', o: ['Operation Polo', 'Operation Vijay', 'Operation Blue Star', 'Operation Meghdoot'] },
    { q: 'జ్ఞానపీఠ్ అవార్డు పొందిన మొదటి తెలుగు రచయిత ఎవరు?', o: ['విశ్వనాథ సత్యనారాయణ', 'సి. నారాయణ రెడ్డి', 'గురజాడ అప్పారావు', 'శ్రీశ్రీ'] },
    { q: 'India లో మొదటిసారి 14 పెద్ద banks ని nationalise చేసింది ఏ సంవత్సరంలో?', o: ['1969', '1975', '1991', '1955'] },
    { q: 'ISRO PSLV-C37 ద్వారా ఒకేసారి ఎన్ని satellites launch చేసి record సృష్టించింది?', o: ['104', '100', '108', '96'] },
    { q: 'Test cricket లో అత్యధిక individual score (400*) చేసిన player ఎవరు?', o: ['Brian Lara', 'Matthew Hayden', 'Sachin Tendulkar', 'Virender Sehwag'] },
  ],
  // ---- Level 14 : ₹5 Crore ----
  [
    { q: '1998 లో Economics Nobel Prize పొందిన Indian economist ఎవరు?', o: ['అమర్త్యసేన్', 'అభిజిత్ బెనర్జీ', 'రఘురామ్ రాజన్', 'మన్మోహన్ సింగ్'] },
    { q: 'Indian Constitution లో Fundamental Duties ని ఏ సవరణ (Amendment) ద్వారా చేర్చారు?', o: ['42వ సవరణ', '44వ సవరణ', '73వ సవరణ', '86వ సవరణ'] },
    { q: 'ప్రపంచంలో మొదటి computer programmer గా పేరు పొందిన మహిళ ఎవరు?', o: ['Ada Lovelace', 'Grace Hopper', 'Marie Curie', 'Hedy Lamarr'] },
    { q: 'India కి Prime Minister అయిన మొదటి తెలుగు వ్యక్తి ఎవరు?', o: ['పి.వి. నరసింహారావు', 'నీలం సంజీవరెడ్డి', 'ఎన్.టి. రామారావు', 'చంద్రబాబు నాయుడు'] },
    { q: 'James Webb Space Telescope ఏ సంవత్సరంలో launch అయింది?', o: ['2021', '2019', '2023', '2018'] },
    { q: "'Pearl Harbor' attack ఏ సంవత్సరంలో జరిగింది?", o: ['1941', '1939', '1943', '1945'] },
  ],
  // ---- Level 15 : ₹10 Crore ----
  [
    { q: '1757 లో Plassey యుద్ధంలో Robert Clive చేతిలో ఓడిపోయిన Bengal నవాబు ఎవరు?', o: ['సిరాజ్ ఉద్-దౌలా', 'మీర్ జాఫర్', 'టిప్పు సుల్తాన్', 'హైదర్ అలీ'] },
    { q: 'టిప్పు సుల్తాన్ 1799 లో శ్రీరంగపట్నంలో ఏ యుద్ధంలో మరణించాడు?', o: ['4వ ఆంగ్లో-మైసూర్ యుద్ధం', '3వ ఆంగ్లో-మైసూర్ యుద్ధం', 'బక్సర్ యుద్ధం', 'ప్లాసీ యుద్ధం'] },
    { q: "'రాజశేఖర చరిత్రము' నవల రచయిత ఎవరు?", o: ['కందుకూరి వీరేశలింగం', 'గురజాడ అప్పారావు', 'చిలకమర్తి లక్ష్మీనరసింహం', 'శ్రీపాద సుబ్రహ్మణ్య శాస్త్రి'] },
    { q: 'పంచారామ క్షేత్రాల్లో ఒకటైన అమరారామం ఏ ఊళ్ళో ఉంది?', o: ['అమరావతి', 'ద్రాక్షారామం', 'పాలకొల్లు', 'సామర్లకోట'] },
    { q: 'India రెండోసారి (Pokhran-II) nuclear tests ఏ సంవత్సరంలో చేసింది?', o: ['1998', '1974', '1999', '2001'] },
    { q: "ISRO 'మంగళయాన్' (Mars Orbiter Mission) ఏ సంవత్సరంలో launch చేసింది?", o: ['2013', '2011', '2015', '2017'] },
  ],
];

// group the 15 hand-written levels into 5 difficulty tiers (Q1-10, 11-20, 21-30, 31-40, 41-50)
window.QUESTIONS = [0, 1, 2, 3, 4].map((t) => [].concat(OLD[3 * t], OLD[3 * t + 1], OLD[3 * t + 2]));
