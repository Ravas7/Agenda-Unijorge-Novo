import http from 'node:http';

const PORT = 3000;
let pessoas = [];
let proximoId = 1;

const paises = [
  ['Afeganistão', 45000000, ['Badakhshan','Badghis','Baghlan','Balkh','Bamyan','Daykundi','Farah','Faryab','Ghazni','Ghor','Helmand','Herat','Kabul','Kandahar','Kapisa','Khost','Kunar','Kunduz','Laghman','Logar','Nangarhar','Nimruz','Nuristan','Paktia','Paktika','Panjshir','Parwan','Samangan','Sar-e Pol','Takhar','Uruzgan','Wardak','Zabul']],
  ['África do Sul', 66000000, ['Eastern Cape','Free State','Gauteng','KwaZulu-Natal','Limpopo','Mpumalanga','North West','Northern Cape','Western Cape']],
  ['Alemanha', 84000000, ['Baden-Württemberg','Bavaria','Berlin','Brandenburg','Bremen','Hamburg','Hesse','Lower Saxony','Mecklenburg-Vorpommern','North Rhine-Westphalia','Rhineland-Palatinate','Saarland','Saxony','Saxony-Anhalt','Schleswig-Holstein','Thuringia']],
  ['Argélia', 48000000, ['Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar','Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Algiers','Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma','Constantine','Médéa','Mostaganem','M’Sila','Mascara','Ouargla','Oran','El Bayadh','Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt','El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent','Ghardaïa','Relizane']],
  ['Argentina', 46000000, ['Buenos Aires','Catamarca','Chaco','Chubut','Ciudad Autónoma de Buenos Aires','Córdoba','Corrientes','Entre Ríos','Formosa','Jujuy','La Pampa','La Rioja','Mendoza','Misiones','Neuquén','Río Negro','Salta','San Juan','San Luis','Santa Cruz','Santa Fe','Santiago del Estero','Tierra del Fuego','Tucumán']],
  ['Austrália', 28000000, ['New South Wales','Queensland','South Australia','Tasmania','Victoria','Western Australia','Australian Capital Territory','Northern Territory']],
  ['Bangladesh', 178000000, ['Barisal','Chattogram','Dhaka','Khulna','Mymensingh','Rajshahi','Rangpur','Sylhet']],
  ['Brasil', 214000000, ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']],
  ['Canadá', 42000000, ['Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland and Labrador','Nova Scotia','Ontario','Prince Edward Island','Quebec','Saskatchewan','Northwest Territories','Nunavut','Yukon']],
  ['Chile', 20000000, ['Arica y Parinacota','Tarapacá','Antofagasta','Atacama','Coquimbo','Valparaíso','Metropolitana de Santiago','O’Higgins','Maule','Ñuble','Biobío','La Araucanía','Los Ríos','Los Lagos','Aysén','Magallanes']],
  ['China', 1413000000, ['Beijing','Tianjin','Hebei','Shanxi','Inner Mongolia','Liaoning','Jilin','Heilongjiang','Shanghai','Jiangsu','Zhejiang','Anhui','Fujian','Jiangxi','Shandong','Henan','Hubei','Hunan','Guangdong','Guangxi','Hainan','Chongqing','Sichuan','Guizhou','Yunnan','Tibet','Shaanxi','Gansu','Qinghai','Ningxia','Xinjiang','Hong Kong','Macau']],
  ['Colômbia', 54000000, ['Amazonas','Antioquia','Arauca','Atlántico','Bolívar','Boyacá','Caldas','Caquetá','Casanare','Cauca','Cesar','Chocó','Córdoba','Cundinamarca','Guainía','Guaviare','Huila','La Guajira','Magdalena','Meta','Nariño','Norte de Santander','Putumayo','Quindío','Risaralda','San Andrés y Providencia','Santander','Sucre','Tolima','Valle del Cauca','Vaupés','Vichada','Bogotá D.C.']],
  ['Coreia do Sul', 52000000, ['Seoul','Busan','Daegu','Incheon','Gwangju','Daejeon','Ulsan','Sejong','Gyeonggi','Gangwon','North Chungcheong','South Chungcheong','North Jeolla','South Jeolla','North Gyeongsang','South Gyeongsang','Jeju']],
  ['Egito', 120000000, ['Cairo','Alexandria','Giza','Qalyubia','Port Said','Suez','Dakahlia','Sharqia','Gharbia','Monufia','Beheira','Kafr El Sheikh','Damietta','Fayoum','Beni Suef','Minya','Asyut','Sohag','Qena','Luxor','Aswan','Red Sea','New Valley','Matrouh','North Sinai','South Sinai','Ismailia']],
  ['Emirados Árabes Unidos', 11000000, ['Abu Dhabi','Ajman','Dubai','Fujairah','Ras Al Khaimah','Sharjah','Umm Al Quwain']],
  ['Espanha', 49000000, ['Andalusia','Aragon','Asturias','Balearic Islands','Basque Country','Canary Islands','Cantabria','Castile and León','Castilla-La Mancha','Catalonia','Extremadura','Galicia','La Rioja','Madrid','Murcia','Navarre','Valencian Community','Ceuta','Melilla']],
  ['Estados Unidos', 349000000, ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']],
  ['Etiópia', 139000000, ['Addis Ababa','Afar','Amhara','Benishangul-Gumuz','Dire Dawa','Gambela','Harari','Oromia','Sidama','Somali','SNNPR','Tigray']],
  ['Filipinas', 118000000, ['Ilocos Region','Cagayan Valley','Central Luzon','CALABARZON','MIMAROPA','Bicol Region','Western Visayas','Central Visayas','Eastern Visayas','Zamboanga Peninsula','Northern Mindanao','Davao Region','SOCCSKSARGEN','Caraga','BARMM','Cordillera Administrative Region','National Capital Region']],
  ['França', 67000000, ['Auvergne-Rhône-Alpes','Bourgogne-Franche-Comté','Bretagne','Centre-Val de Loire','Corse','Grand Est','Hauts-de-France','Île-de-France','Normandie','Nouvelle-Aquitaine','Occitanie','Pays de la Loire','Provence-Alpes-Côte d’Azur']],
  ['Gana', 36000000, ['Ahafo','Ashanti','Bono','Bono East','Central','Eastern','Greater Accra','North East','Northern','Oti','Savannah','Upper East','Upper West','Volta','Western','Western North']],
  ['Iêmen', 42000000, ['Abyan','Aden','Al Bayda','Al Hudaydah','Al Jawf','Al Mahrah','Al Mahwit','Amran','Dhamar','Hadramaut','Hajjah','Ibb','Lahij','Ma’rib','Raymah','Saada','Sana’a','Shabwah','Socotra','Taiz']],
  ['Índia', 1477000000, ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh','Puducherry']],
  ['Indonésia', 288000000, ['Aceh','Bali','Banten','Bengkulu','Central Java','Central Kalimantan','Central Sulawesi','East Java','East Kalimantan','East Nusa Tenggara','Gorontalo','Jakarta','Jambi','Lampung','Maluku','North Kalimantan','North Maluku','North Sulawesi','North Sumatra','Papua','Riau','Riau Islands','South Kalimantan','South Sulawesi','South Sumatra','Southeast Sulawesi','West Java','West Kalimantan','West Nusa Tenggara','West Papua','West Sulawesi','West Sumatra','Yogyakarta']],
  ['Irã', 93000000, ['Alborz','Ardabil','Bushehr','Chaharmahal and Bakhtiari','East Azerbaijan','Fars','Gilan','Golestan','Hamadan','Hormozgan','Ilam','Isfahan','Kerman','Kermanshah','Khuzestan','Kohgiluyeh and Boyer-Ahmad','Kurdistan','Lorestan','Markazi','Mazandaran','North Khorasan','Qazvin','Qom','Razavi Khorasan','Semnan','Sistan and Baluchestan','South Khorasan','Tehran','West Azerbaijan','Yazd','Zanjan']],
  ['Iraque', 47000000, ['Anbar','Babil','Baghdad','Basra','Dhi Qar','Diyala','Dohuk','Erbil','Karbala','Kirkuk','Maysan','Muthanna','Najaf','Nineveh','Qadisiyyah','Saladin','Sulaymaniyah','Wasit','Halabja']],
  ['Itália', 59000000, ['Abruzzo','Basilicata','Calabria','Campania','Emilia-Romagna','Friuli-Venezia Giulia','Lazio','Liguria','Lombardy','Marche','Molise','Piedmont','Puglia','Sardinia','Sicily','Tuscany','Trentino-Alto Adige','Umbria','Aosta Valley','Veneto']],
  ['Japão', 122000000, ['Hokkaido','Aomori','Iwate','Miyagi','Akita','Yamagata','Fukushima','Ibaraki','Tochigi','Gunma','Saitama','Chiba','Tokyo','Kanagawa','Niigata','Toyama','Ishikawa','Fukui','Yamanashi','Nagano','Gifu','Shizuoka','Aichi','Mie','Shiga','Kyoto','Osaka','Hyogo','Nara','Wakayama','Tottori','Shimane','Okayama','Hiroshima','Yamaguchi','Tokushima','Kagawa','Ehime','Kochi','Fukuoka','Saga','Nagasaki','Kumamoto','Oita','Miyazaki','Kagoshima','Okinawa']],
  ['Quênia', 59000000, ['Baringo','Bomet','Bungoma','Busia','Elgeyo-Marakwet','Embu','Garissa','Homa Bay','Isiolo','Kajiado','Kakamega','Kericho','Kiambu','Kilifi','Kirinyaga','Kisii','Kisumu','Kitui','Kwale','Laikipia','Lamu','Machakos','Makueni','Mandera','Marsabit','Meru','Migori','Mombasa','Murang’a','Nairobi','Nakuru','Nandi','Narok','Nyamira','Nyandarua','Nyeri','Samburu','Siaya','Taita-Taveta','Tana River','Tharaka-Nithi','Trans Nzoia','Turkana','Uasin Gishu','Vihiga','Wajir','West Pokot']],
  ['Madagascar', 33000000, ['Antananarivo','Antsiranana','Fianarantsoa','Mahajanga','Toamasina','Toliara']],
  ['Malásia', 36000000, ['Johor','Kedah','Kelantan','Malacca','Negeri Sembilan','Pahang','Penang','Perak','Perlis','Sabah','Sarawak','Selangor','Kuala Lumpur','Labuan','Putrajaya']],
  ['Marrocos', 39000000, ['Tanger-Tétouan-Al Hoceïma','Oriental','Fès-Meknès','Rabat-Salé-Kénitra','Béni Mellal-Khénifra','Casablanca-Settat','Marrakesh-Safi','Drâa-Tafilalet','Souss-Massa','Guelmim-Oued Noun','Laâyoune-Sakia El Hamra','Dakhla-Oued Ed-Dahab']],
  ['México', 133000000, ['Aguascalientes','Baja California','Baja California Sur','Campeche','Chiapas','Chihuahua','Coahuila','Colima','Durango','Guanajuato','Guerrero','Hidalgo','Jalisco','Mexico City','México','Michoacán','Morelos','Nayarit','Nuevo León','Oaxaca','Puebla','Querétaro','Quintana Roo','San Luis Potosí','Sinaloa','Sonora','Tabasco','Tamaulipas','Tlaxcala','Veracruz','Yucatán','Zacatecas']],
  ['Moçambique', 36000000, ['Cabo Delgado','Gaza','Inhambane','Manica','Maputo','Nampula','Niassa','Sofala','Tete','Zambézia','Maputo City']],
  ['Mianmar', 55000000, ['Kachin','Kayah','Kayin','Chin','Sagaing','Tanintharyi','Bago','Magway','Mandalay','Mon','Rakhine','Yangon','Shan','Naypyidaw']],
  ['Nepal', 30000000, ['Koshi','Madhesh','Bagmati','Gandaki','Lumbini','Karnali','Sudurpashchim']],
  ['Nigéria', 243000000, ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','Federal Capital Territory','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara']],
  ['Países Baixos', 18000000, ['Drenthe','Flevoland','Friesland','Gelderland','Groningen','Limburg','North Brabant','North Holland','Overijssel','South Holland','Utrecht','Zeeland']],
  ['Paquistão', 259000000, ['Balochistan','Khyber Pakhtunkhwa','Punjab','Sindh','Islamabad Capital Territory','Azad Jammu and Kashmir','Gilgit-Baltistan']],
  ['Peru', 35000000, ['Amazonas','Ancash','Apurímac','Arequipa','Ayacucho','Cajamarca','Callao','Cusco','Huancavelica','Huánuco','Ica','Junín','La Libertad','Lambayeque','Lima','Loreto','Madre de Dios','Moquegua','Pasco','Piura','Puno','San Martín','Tacna','Tumbes','Ucayali']],
  ['Polônia', 38000000, ['Lower Silesian','Kuyavian-Pomeranian','Lublin','Lubusz','Łódź','Lesser Poland','Masovian','Opole','Podkarpackie','Podlaskie','Pomeranian','Silesian','Świętokrzyskie','Warmian-Masurian','Greater Poland','West Pomeranian']],
  ['Reino Unido', 70000000, ['England','Scotland','Wales','Northern Ireland']],
  ['República Democrática do Congo', 116000000, ['Kinshasa','Kongo Central','Kwango','Kwilu','Mai-Ndombe','Kasai','Kasai-Central','Kasai-Oriental','Lomami','Sankuru','Maniema','South Kivu','North Kivu','Ituri','Haut-Uele','Bas-Uele','Tshopo','Mongala','Nord-Ubangi','Sud-Ubangi','Équateur','Tshuapa','Tanganyika','Haut-Lomami','Lualaba','Haut-Katanga']],
  ['República Tcheca', 11000000, ['Prague','Central Bohemian','South Bohemian','Plzeň','Karlovy Vary','Ústí nad Labem','Liberec','Hradec Králové','Pardubice','Vysočina','South Moravian','Olomouc','Zlín','Moravian-Silesian']],
  ['Rússia', 143000000, ['Moscow','Saint Petersburg','Moscow Oblast','Leningrad Oblast','Krasnodar Krai','Sverdlovsk Oblast','Rostov Oblast','Tatarstan','Bashkortostan','Novosibirsk Oblast']],
  ['Senegal', 19000000, ['Dakar','Diourbel','Fatick','Kaffrine','Kaolack','Kédougou','Kolda','Louga','Matam','Saint-Louis','Sédhiou','Tambacounda','Thiès','Ziguinchor']],
  ['Síria', 26000000, ['Damascus','Aleppo','Rif Dimashq','Homs','Hama','Latakia','Idlib','Tartus','Deir ez-Zor','Hasakah','Raqqa','Daraa','As-Suwayda','Quneitra']],
  ['Sudão', 53000000, ['Al Jazirah','Blue Nile','Central Darfur','East Darfur','Gedaref','Kassala','Khartoum','North Darfur','North Kordofan','Northern','Red Sea','River Nile','Sennar','South Darfur','South Kordofan','West Darfur','West Kordofan','White Nile']],
  ['Suécia', 11000000, ['Blekinge','Dalarna','Gävleborg','Gotland','Halland','Jämtland','Jönköping','Kalmar','Kronoberg','Norrbotten','Örebro','Östergötland','Skåne','Södermanland','Stockholm','Uppsala','Värmland','Västerbotten','Västernorrland','Västmanland']],
  ['Tailândia', 72000000, ['Bangkok','Amnat Charoen','Ang Thong','Bueng Kan','Buriram','Chachoengsao','Chai Nat','Chaiyaphum','Chanthaburi','Chiang Mai','Chiang Rai','Chon Buri','Chumphon','Kalasin','Kamphaeng Phet','Kanchanaburi','Khon Kaen','Krabi','Lampang','Lamphun','Loei','Lopburi','Mae Hong Son','Maha Sarakham','Mukdahan','Nakhon Nayok','Nakhon Pathom','Nakhon Phanom','Nakhon Ratchasima','Nakhon Sawan','Nakhon Si Thammarat','Nan','Narathiwat','Nong Bua Lamphu','Nong Khai','Nonthaburi','Pathum Thani','Pattani','Phang Nga','Phatthalung','Phayao','Phetchabun','Phetchaburi','Phichit','Phitsanulok','Phrae','Phuket','Prachinburi','Prachuap Khiri Khan','Ranong','Ratchaburi','Rayong','Roi Et','Sa Kaeo','Sakon Nakhon','Samut Prakan','Samut Sakhon','Samut Songkhram','Saraburi','Satun','Sing Buri','Sisaket','Songkhla','Sukhothai','Suphan Buri','Surat Thani','Surin','Tak','Trang','Trat','Ubon Ratchathani','Udon Thani','Uthai Thani','Uttaradit','Yala','Yasothon']],
  ['Tanzânia', 73000000, ['Arusha','Dar es Salaam','Dodoma','Geita','Iringa','Kagera','Katavi','Kigoma','Kilimanjaro','Lindi','Manyara','Mara','Mbeya','Morogoro','Mtwara','Mwanza','Njombe','Pemba North','Pemba South','Pwani','Rukwa','Ruvuma','Shinyanga','Simiyu','Singida','Songwe','Tabora','Tanga','Zanzibar North','Zanzibar South and Central','Zanzibar West']],
  ['Turquia', 88000000, ['Adana','Adiyaman','Afyonkarahisar','Agri','Aksaray','Amasya','Ankara','Antalya','Ardahan','Artvin','Aydin','Balikesir','Bartin','Batman','Bayburt','Bilecik','Bingol','Bitlis','Bolu','Burdur','Bursa','Canakkale','Cankiri','Corum','Denizli','Diyarbakir','Duzce','Edirne','Elazig','Erzincan','Erzurum','Eskisehir','Gaziantep','Giresun','Gumushane','Hakkari','Hatay','Igdir','Isparta','Istanbul','Izmir','Kahramanmaras','Karabuk','Karaman','Kars','Kastamonu','Kayseri','Kilis','Kirikkale','Kirklareli','Kirsehir','Kocaeli','Konya','Kutahya','Malatya','Manisa','Mardin','Mersin','Mugla','Mus','Nevsehir','Nigde','Ordu','Osmaniye','Rize','Sakarya','Samsun','Sanliurfa','Siirt','Sinop','Sirnak','Sivas','Tekirdag','Tokat','Trabzon','Tunceli','Usak','Van','Yalova','Yozgat','Zonguldak']],
  ['Ucrânia', 39000000, ['Cherkasy','Chernihiv','Chernivtsi','Dnipropetrovsk','Donetsk','Ivano-Frankivsk','Kharkiv','Kherson','Khmelnytskyi','Kyiv','Kirovohrad','Luhansk','Lviv','Mykolaiv','Odesa','Poltava','Rivne','Sumy','Ternopil','Vinnytsia','Volyn','Zakarpattia','Zaporizhzhia','Zhytomyr','Kyiv City','Sevastopol']],
  ['Uganda', 53000000, ['Central','Eastern','Northern','Western']],
  ['Venezuela', 29000000, ['Amazonas','Anzoátegui','Apure','Aragua','Barinas','Bolívar','Carabobo','Cojedes','Delta Amacuro','Falcón','Guárico','Lara','La Guaira','Mérida','Miranda','Monagas','Nueva Esparta','Portuguesa','Sucre','Táchira','Trujillo','Yaracuy','Zulia','Distrito Capital']],
  ['Vietnã', 102000000, ['Hanoi','Ho Chi Minh City','Hai Phong','Da Nang','Can Tho','An Giang','Ba Ria-Vung Tau','Bac Giang','Bac Kan','Bac Lieu','Bac Ninh','Ben Tre','Binh Dinh','Binh Duong','Binh Phuoc','Binh Thuan','Ca Mau','Cao Bang','Dak Lak','Dak Nong','Dien Bien','Dong Nai','Dong Thap','Gia Lai','Ha Giang','Ha Nam','Ha Tinh','Hai Duong','Hau Giang','Hoa Binh','Hung Yen','Khanh Hoa','Kien Giang','Kon Tum','Lai Chau','Lam Dong','Lang Son','Lao Cai','Long An','Nam Dinh','Nghe An','Ninh Binh','Ninh Thuan','Phu Tho','Phu Yen','Quang Binh','Quang Nam','Quang Ngai','Quang Ninh','Quang Tri','Soc Trang','Son La','Tay Ninh','Thai Binh','Thai Nguyen','Thanh Hoa','Thua Thien Hue','Tien Giang','Tra Vinh','Tuyen Quang','Vinh Long','Vinh Phuc','Yen Bai']],
  ['Zâmbia', 22000000, ['Central','Copperbelt','Eastern','Luapula','Lusaka','Muchinga','Northern','North-Western','Southern','Western']],

  ['Angola', 39000000, ['Bengo','Benguela','Bié','Cabinda','Cuando Cubango','Cuanza Norte','Cuanza Sul','Cunene','Huambo','Huíla','Luanda','Lunda Norte','Lunda Sul','Malanje','Moxico','Namibe','Uíge','Zaire']],
  ['Bolívia', 13000000, ['Beni','Chuquisaca','Cochabamba','La Paz','Oruro','Pando','Potosí','Santa Cruz','Tarija']],
  ['Burkina Faso', 25000000, ['Boucle du Mouhoun','Cascades','Centre','Centre-Est','Centre-Nord','Centre-Ouest','Centre-Sud','Est','Hauts-Bassins','Nord','Plateau-Central','Sahel','Sud-Ouest']],
  ['Camboja', 18000000, ['Banteay Meanchey','Battambang','Kampong Cham','Kampong Chhnang','Kampong Speu','Kampong Thom','Kampot','Kandal','Kep','Koh Kong','Kratie','Mondulkiri','Oddar Meanchey','Pailin','Phnom Penh','Preah Sihanouk','Preah Vihear','Pursat','Prey Veng','Ratanakiri','Siem Reap','Stung Treng','Svay Rieng','Takeo','Tbong Khmum']],
  ['Camarões', 30000000, ['Adamaoua','Centre','East','Far North','Littoral','North','Northwest','South','Southwest']],
  ['Chade', 21000000, ['Bahr el Gazel','Batha','Borkou','Chari-Baguirmi','Ennedi-Est','Ennedi-Ouest','Guéra','Hadjer-Lamis','Kanem','Lac','Logone Occidental','Logone Oriental','Mandoul','Mayo-Kebbi Est','Mayo-Kebbi Ouest','Moyen-Chari','N’Djamena','Ouaddaï','Salamat','Sila','Tandjilé','Tibesti','Wadi Fira']],
  ['Costa do Marfim', 33000000, ['Abidjan','Bas-Sassandra','Comoé','Denguélé','District des Lacs','District des Montagnes','District de Sassandra-Marahoué','Gôh-Djiboua','Lacs','Lagunes','Savanes','Vallée du Bandama','Woroba','Yamoussoukro','Zanzan']],
  ['Cuba', 11000000, ['Artemisa','Camagüey','Ciego de Ávila','Cienfuegos','Granma','Guantánamo','Holguín','Isla de la Juventud','La Habana','Las Tunas','Matanzas','Mayabeque','Pinar del Río','Sancti Spíritus','Santiago de Cuba','Villa Clara']],
  ['Equador', 19000000, ['Azuay','Bolívar','Cañar','Carchi','Chimborazo','Cotopaxi','El Oro','Esmeraldas','Galápagos','Guayas','Imbabura','Loja','Los Ríos','Manabí','Morona Santiago','Napo','Orellana','Pastaza','Pichincha','Santa Elena','Santo Domingo de los Tsáchilas','Sucumbíos','Tungurahua','Zamora Chinchipe']],
  ['Grécia', 10000000, ['East Macedonia and Thrace','Central Macedonia','West Macedonia','Epirus','Thessaly','Ionian Islands','Western Greece','Central Greece','Attica','Peloponnese','North Aegean','South Aegean','Crete']],
  ['Guatemala', 19000000, ['Alta Verapaz','Baja Verapaz','Chimaltenango','Chiquimula','El Progreso','Escuintla','Guatemala','Huehuetenango','Izabal','Jalapa','Jutiapa','Petén','Quetzaltenango','Quiché','Retalhuleu','Sacatepéquez','San Marcos','Santa Rosa','Sololá','Suchitepéquez','Totonicapán','Zacapa']],
  ['Guiné', 15000000, ['Boké','Conakry','Faranah','Kankan','Kindia','Labé','Mamou','Nzérékoré']],
  ['Haiti', 12000000, ['Artibonite','Centre','Grand’Anse','Nippes','Nord','Nord-Est','Nord-Ouest','Ouest','Sud','Sud-Est']],
  ['Honduras', 11000000, ['Atlántida','Choluteca','Colón','Comayagua','Copán','Cortés','El Paraíso','Francisco Morazán','Gracias a Dios','Intibucá','Islas de la Bahía','La Paz','Lempira','Ocotepeque','Olancho','Santa Bárbara','Valle','Yoro']],
  ['Israel', 11000000, ['Central District','Haifa District','Jerusalem District','Northern District','Southern District','Tel Aviv District']],
  ['Cazaquistão', 21000000, ['Abai','Akmola','Aktobe','Almaty','Atyrau','East Kazakhstan','Jambyl','Jetisu','Karaganda','Kostanay','Kyzylorda','Mangystau','North Kazakhstan','Pavlodar','Turkistan','Ulytau','West Kazakhstan','Astana','Almaty City']],
  ['Laos', 8000000, ['Attapeu','Bokeo','Bolikhamsai','Champasak','Houaphanh','Khammouane','Luang Namtha','Luang Prabang','Oudomxay','Phongsaly','Salavan','Savannakhet','Sekong','Vientiane Province','Vientiane Prefecture','Xaignabouli','Xaisomboun','Xiangkhouang']],
  ['Líbano', 6000000, ['Akkar','Baalbek-Hermel','Beirut','Beqaa','Mount Lebanon','Nabatieh','North','South']],
  ['Malawi', 22000000, ['Central Region','Northern Region','Southern Region']],
  ['Mali', 25000000, ['Bamako','Gao','Kayes','Kidal','Koulikoro','Ménaka','Mopti','Ségou','Sikasso','Taoudénit','Tombouctou']],
  ['Níger', 29000000, ['Agadez','Diffa','Dosso','Maradi','Niamey','Tahoua','Tillabéri','Zinder']],
  ['Coreia do Norte', 27000000, ['Pyongyang','Ryanggang','North Hamgyong','South Hamgyong','North Pyongan','South Pyongan','Chagang','North Hwanghae','South Hwanghae','Kangwon','Nampo','Rason']],
  ['Nova Zelândia', 5000000, ['Auckland','Bay of Plenty','Canterbury','Gisborne','Hawke’s Bay','Manawatū-Whanganui','Marlborough','Nelson','Northland','Otago','Southland','Taranaki','Tasman','Waikato','Wellington','West Coast']],
  ['Papua-Nova Guiné', 11000000, ['Central','Chimbu','Eastern Highlands','East New Britain','East Sepik','Enga','Gulf','Hela','Jiwaka','Madang','Manus','Milne Bay','Morobe','National Capital District','New Ireland','Northern','Sandaun','Southern Highlands','Western','Western Highlands','West New Britain','Bougainville']],
  ['Portugal', 11000000, ['Açores','Aveiro','Beja','Braga','Bragança','Castelo Branco','Coimbra','Évora','Faro','Guarda','Leiria','Lisboa','Portalegre','Porto','Santarém','Setúbal','Viana do Castelo','Vila Real','Viseu','Madeira']],
  ['República Dominicana', 12000000, ['Azua','Baoruco','Barahona','Dajabón','Distrito Nacional','Duarte','Elías Piña','El Seibo','Espaillat','Hato Mayor','Hermanas Mirabal','Independencia','La Altagracia','La Romana','La Vega','María Trinidad Sánchez','Monseñor Nouel','Monte Cristi','Monte Plata','Pedernales','Peravia','Puerto Plata','Samaná','San Cristóbal','San José de Ocoa','San Juan','San Pedro de Macorís','Sánchez Ramírez','Santiago','Santiago Rodríguez','Santo Domingo','Valverde']],
  ['Romênia', 19000000, ['Alba','Arad','Argeș','Bacău','Bihor','Brașov','Brăila','Buzău','Caraș-Severin','Cluj','Constanța','Covasna','Dâmbovița','Dolj','Galați','Giurgiu','Gorj','Harghita','Hunedoara','Ialomița','Iași','Ilfov','Maramureș','Mehedinți','Mureș','Neamț','Olt','Prahova','Sălaj','Satu Mare','Sibiu','Suceava','Teleorman','Timiș','Tulcea','Vaslui','Vâlcea','Vrancea','Bucharest']],
  ['Ruanda', 15000000, ['Eastern','Kigali','Northern','Southern','Western']],
  ['Serra Leoa', 9000000, ['Eastern','Northern','North Western','Southern','Western Area']],
  ['Somália', 20000000, ['Awdal','Bakool','Banaadir','Bari','Bay','Galguduud','Gedo','Hiiraan','Lower Juba','Lower Shabelle','Middle Juba','Middle Shabelle','Mudug','Nugaal','Sanaag','Sool','Togdheer','Woqooyi Galbeed']],
  ['Sri Lanka', 22000000, ['Central','Eastern','North Central','Northern','North Western','Sabaragamuwa','Southern','Uva','Western']],
  ['Tajiquistão', 11000000, ['Dushanbe','Districts of Republican Subordination','Gorno-Badakhshan','Khatlon','Sughd']],
  ['Zimbabwe', 17000000, ['Bulawayo','Harare','Manicaland','Mashonaland Central','Mashonaland East','Mashonaland West','Masvingo','Matabeleland North','Matabeleland South','Midlands']],
  ['Arábia Saudita', 35000000, ['Riyadh','Makkah','Madinah','Qassim','Eastern Province','Asir','Tabuk','Hail','Northern Borders','Jizan','Najran','Al Bahah','Al Jawf']]
,
  ['Áustria', 9200000, ['Burgenland','Carinthia','Lower Austria','Upper Austria','Salzburg','Styria','Tyrol','Vorarlberg','Vienna']],
  ['Bélgica', 12000000, ['Brussels-Capital','Flemish Brabant','Walloon Brabant','Antwerp','Limburg','East Flanders','Hainaut','Liège','Luxembourg','Namur','West Flanders']],
  ['Bielorrússia', 9000000, ['Brest','Gomel','Grodno','Mogilev','Minsk','Vitebsk','Minsk City']],
  ['Bulgária', 6300000, ['Blagoevgrad','Burgas','Dobrich','Gabrovo','Haskovo','Kardzhali','Kyustendil','Lovech','Montana','Pazardzhik','Pernik','Pleven','Plovdiv','Razgrad','Ruse','Shumen','Silistra','Sliven','Smolyan','Sofia City','Sofia Province','Stara Zagora','Targovishte','Varna','Veliko Tarnovo','Vidin','Vratsa','Yambol']],
  ['Dinamarca', 6000000, ['Capital Region','Central Denmark','North Denmark','Region Zealand','Region of Southern Denmark']],
  ['El Salvador', 6500000, ['Ahuachapán','Cabañas','Chalatenango','Cuscatlán','La Libertad','La Paz','La Unión','Morazán','San Miguel','San Salvador','San Vicente','Santa Ana','Sonsonate','Usulután']],
  ['Finlândia', 5600000, ['Åland','Central Finland','Central Ostrobothnia','Kainuu','Kanta-Häme','Kymenlaakso','Lapland','North Karelia','Northern Ostrobothnia','Northern Savonia','Ostrobothnia','Päijät-Häme','Pirkanmaa','Satakunta','South Karelia','Southern Ostrobothnia','Southern Savonia','Southwest Finland','Uusimaa']],
  ['Hungria', 9600000, ['Bács-Kiskun','Baranya','Békés','Borsod-Abaúj-Zemplén','Budapest','Csongrád-Csanád','Fejér','Győr-Moson-Sopron','Hajdú-Bihar','Heves','Jász-Nagykun-Szolnok','Komárom-Esztergom','Nógrád','Pest','Somogy','Szabolcs-Szatmár-Bereg','Tolna','Vas','Veszprém','Zala']],
  ['Jordânia', 12000000, ['Ajloun','Amman','Aqaba','Balqa','Irbid','Jerash','Karak','Ma’an','Madaba','Mafraq','Tafilah','Zarqa']],
  ['Quirguistão', 7400000, ['Batken','Chuy','Issyk-Kul','Jalal-Abad','Naryn','Osh','Talas','Bishkek','Osh City']],
  ['Nicarágua', 7000000, ['Boaco','Carazo','Chinandega','Chontales','Estelí','Granada','Jinotega','León','Madriz','Managua','Masaya','Matagalpa','Nueva Segovia','Río San Juan','Rivas','North Caribbean Coast','South Caribbean Coast']],
  ['Noruega', 5600000, ['Agder','Innlandet','Møre og Romsdal','Nordland','Oslo','Rogaland','Troms','Trøndelag','Vestfold','Vestland','Telemark','Buskerud','Østfold','Akershus']],
  ['Paraguai', 7000000, ['Alto Paraguay','Alto Paraná','Amambay','Asunción','Boquerón','Caaguazú','Caazapá','Canindeyú','Central','Concepción','Cordillera','Guairá','Itapúa','Misiones','Ñeembucú','Paraguarí','Presidente Hayes','San Pedro']],
  ['Sérvia', 6600000, ['Belgrade','Vojvodina','Šumadija and Western Serbia','Southern and Eastern Serbia','Kosovo and Metohija']],
  ['Eslováquia', 5400000, ['Bratislava','Trnava','Trenčín','Nitra','Žilina','Banská Bystrica','Prešov','Košice']],
  ['Suíça', 9000000, ['Aargau','Appenzell Ausserrhoden','Appenzell Innerrhoden','Basel-Landschaft','Basel-Stadt','Bern','Fribourg','Geneva','Glarus','Graubünden','Jura','Lucerne','Neuchâtel','Nidwalden','Obwalden','Schaffhausen','Schwyz','Solothurn','St. Gallen','Thurgau','Ticino','Uri','Valais','Vaud','Zug','Zürich']],
  ['Togo', 10000000, ['Centrale','Kara','Maritime','Plateaux','Savanes']],
  ['Tunísia', 12000000, ['Ariana','Béja','Ben Arous','Bizerte','Gabès','Gafsa','Jendouba','Kairouan','Kasserine','Kebili','Kef','Mahdia','Manouba','Medenine','Monastir','Nabeul','Sfax','Sidi Bouzid','Siliana','Sousse','Tataouine','Tozeur','Tunis','Zaghouan']],
  ['Turcomenistão', 7500000, ['Ahal','Balkan','Dashoguz','Lebap','Mary','Ashgabat']],
  ['Singapura', 6100000, []]

].map(([nome, populacao, ufs]) => ({ nome, populacao, ufs }));

// Países que não possuem UF/estado no sentido adotado pelo cadastro.
// Regiões, distritos, departamentos, províncias administrativas etc. não entram como UF.
const PAISES_SEM_UF = new Set([
  'Portugal', 'França', 'Espanha', 'Itália', 'Japão', 'Singapura',
  'Países Baixos', 'Reino Unido', 'Grécia', 'Noruega', 'Suécia',
  'Finlândia', 'Dinamarca', 'Polônia', 'República Tcheca', 'Romênia',
  'Bulgária', 'Sérvia', 'Eslováquia', 'Bélgica',
  'Turquia', 'Ucrânia', 'Hungria', 'Croácia', 'Irlanda', 'Nova Zelândia'
]);

for (const pais of paises) {
  if (PAISES_SEM_UF.has(pais.nome)) pais.ufs = [];
}

const CORTE_POPULACAO = 5_000_000;

// Cidades de referência para demonstrar a cascata. A mesma estrutura permite ampliar a base.
const cidades = {
  Brasil: { BA: ['Salvador','Feira de Santana','Vitória da Conquista','Camaçari','Juazeiro'], SP: ['São Paulo','Campinas','Santos','Sorocaba','Ribeirão Preto'], RJ: ['Rio de Janeiro','Niterói','São Gonçalo','Duque de Caxias','Petrópolis'], MG: ['Belo Horizonte','Uberlândia','Contagem','Juiz de Fora','Montes Claros'], PR: ['Curitiba','Londrina','Maringá','Ponta Grossa','Cascavel'] },
  'Estados Unidos': { California: ['Los Angeles','San Diego','San Jose','San Francisco','Fresno'], Texas: ['Houston','San Antonio','Dallas','Austin','Fort Worth'], 'New York': ['New York City','Buffalo','Rochester','Yonkers','Syracuse'], Florida: ['Jacksonville','Miami','Tampa','Orlando','St. Petersburg'] },
};

const json = (res, status, data) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' }); res.end(JSON.stringify(data)); };
const body = req => new Promise((resolve, reject) => { let b=''; req.on('data', c => b += c); req.on('end', () => { try { resolve(JSON.parse(b || '{}')); } catch { reject(new Error('JSON inválido')); } }); });

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }); return res.end(); }
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    if (req.method === 'GET' && url.pathname === '/api/paises') return json(res, 200, paises.filter(p => p.populacao > CORTE_POPULACAO).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')).map(({ nome, populacao }) => ({ nome, populacao })));
    if (req.method === 'GET' && url.pathname === '/api/ufs') {
      const pais = paises.find(p => p.nome === url.searchParams.get('pais'));
      return json(res, 200, pais?.ufs ?? []);
    }
    if (req.method === 'GET' && url.pathname === '/api/cidades') {
      const pais = url.searchParams.get('pais'); const uf = url.searchParams.get('uf');
      return json(res, 200, cidades[pais]?.[uf] ?? []);
    }
    if (req.method === 'GET' && url.pathname === '/api/pessoas') return json(res, 200, pessoas);
    if (req.method === 'POST' && url.pathname === '/api/pessoas') { const p = await body(req); const salvo = { id: proximoId++, ...p }; pessoas.push(salvo); return json(res, 201, salvo); }
    if (req.method === 'DELETE' && url.pathname.startsWith('/api/pessoas/')) { const id = Number(url.pathname.split('/').pop()); pessoas = pessoas.filter(p => p.id !== id); return json(res, 200, { ok: true }); }
    json(res, 404, { erro: 'Rota não encontrada' });
  } catch (e) { json(res, 400, { erro: e.message }); }
});
server.listen(PORT, () => console.log(`Servidor da aplicação em http://localhost:${PORT}`));
