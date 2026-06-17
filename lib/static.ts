export const HARYANA_DISTRICTS = [
  'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 
  'Gurugram', 'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 
  'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal', 'Panchkula', 
  'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'
];

export const HARYANA_TEHSILS: Record<string, string[]> = {
  'Ambala': ['Ambala', 'Ambala Cantt', 'Barara', 'Naraingarh'],
  'Bhiwani': ['Bhiwani', 'Bawani Khera', 'Loharu', 'Tosham', 'Siwani'],
  'Charkhi Dadri': ['Charkhi Dadri', 'Badhra'],
  'Faridabad': ['Faridabad', 'Ballabgarh', 'Badkhal'],
  'Fatehabad': ['Fatehabad', 'Ratia', 'Tohana'],
  'Gurugram': ['Gurugram', 'Pataudi', 'Sohna', 'Farrukhnagar', 'Manesar'],
  'Hisar': ['Hisar', 'Hansi', 'Narnaund', 'Barwala', 'Adampur'],
  'Jhajjar': ['Jhajjar', 'Bahadurgarh', 'Beri', 'Matanhail'],
  'Jind': ['Jind', 'Julana', 'Safidon', 'Uchana', 'Narwana'],
  'Kaithal': ['Kaithal', 'Guhla', 'Kalayat', 'Pundri'],
  'Karnal': ['Karnal', 'Indri', 'Nilokheri', 'Gharaunda', 'Assandh'],
  'Kurukshetra': ['Thanesar', 'Pehowa', 'Shahbad', 'Ladwa'],
  'Mahendragarh': ['Narnaul', 'Mahendragarh', 'Kanina', 'Nangal Chaudhary'],
  'Nuh': ['Nuh', 'Ferozepur Jhirka', 'Punahana', 'Taoru'],
  'Palwal': ['Palwal', 'Hodal', 'Hathin'],
  'Panchkula': ['Panchkula', 'Kalka', 'Raipur Rani'],
  'Panipat': ['Panipat', 'Samalkha', 'Israna', 'Bapoli'],
  'Rewari': ['Rewari', 'Bawal', 'Kosli'],
  'Rohtak': ['Rohtak', 'Meham', 'Sampla'],
  'Sirsa': ['Sirsa', 'Dabwali', 'Ellenabad', 'Rania', 'Odhan'],
  'Sonipat': ['Sonipat', 'Ganaur', 'Gohana', 'Kharkhoda'],
  'Yamunanagar': ['Jagadhri', 'Chhachhrauli', 'Bilaspur', 'Radaur']
};

export const HARYANA_TEHSIL_VILLAGES: Record<string, string[]> = {
  // Ambala tehsils
  'Ambala': [
    'Ambala City', 'Jalalpur', 'Kakru', 'Kanwala', 'Sarsini', 
    'Mullanpur', 'Shahpur', 'Chaurmastpur', 'Segti', 'Segta', 
    'Danipur', 'Ghel', 'Kalarheri', 'Nahan House'
  ],
  'Ambala Cantt': [
    'Cantt Area', 'Babyal', 'Kardhan', 'Boh', 'Mahesh Nagar', 
    'Rawalan', 'Sarsehri', 'Khuda Kalan', 'Khuda Khurd', 'Mohra', 
    'Dukheri', 'Naggal'
  ],
  'Barara': [
    'Barara', 'Adhoya', 'Thamber', 'Mulana', 'Sohana', 
    'Talheri', 'Sola', 'Rajouli', 'Bihta', 'Gola', 
    'Sonti', 'Ugala', 'Korwa', 'Samgoli'
  ],
  'Naraingarh': [
    'Naraingarh', 'Ambli', 'Kherki', 'Panjlasa', 'Shahzadpur', 
    'Banondi', 'Laha', 'Bharog', 'Kurali', 'Dehar', 
    'Chajju Majra', 'Akbarpur', 'Toka', 'Kadasan'
  ],

  // Bhiwani tehsils
  'Bhiwani': [
    'Bhiwani Jonpal', 'Devsar', 'Guhran', 'Kitlana', 'Palwas', 
    'Bamla', 'Tigrana', 'Chang', 'Bapauda', 'Naurangabad', 
    'Kaunt', 'Paluwas', 'Haluwas', 'Ghansala'
  ],
  'Bawani Khera': [
    'Bawani Khera', 'Alakhpura', 'Pur', 'Sui', 'Siwana', 
    'Jamalpur', 'Jitpura', 'Roran', 'Mitathal', 'Kaluwas', 
    'Baliali', 'Bhaini'
  ],
  'Loharu': [
    'Loharu', 'Barwas', 'Gignow', 'Jui Khurd', 'Sidhwan', 
    'Nakipur', 'Dhani Toda', 'Harodi', 'Gokal', 'Sohansara', 
    'Singani', 'Obra', 'Paju', 'Lilas'
  ],
  'Tosham': [
    'Tosham', 'Biran', 'Khanak', 'Mirzapur', 'Sandwa', 
    'Dharan', 'Pinjokhara', 'Thilep', 'Sagban', 'Bhurtana', 
    'Dadam', 'Sungarpur', 'Bhura', 'Dulheri'
  ],
  'Siwani': [
    'Siwani', 'Budhabha', 'Chaudhariwas', 'Khera', 'Mithi', 
    'Lilas', 'Rupana', 'Naloi', 'Obra', 'Garwa', 
    'Jhumpa Kalan', 'Jhumpa Khurd', 'Barwa', 'Motipura'
  ],

  // Charkhi Dadri tehsils
  'Charkhi Dadri': [
    'Dadri', 'Jharoda', 'Lohra', 'Rawaldhi', 'Samaspur', 
    'Phogat', 'Bond Kalan', 'Morwala', 'Kadma', 'Chiri', 
    'Misri', 'Kaliana'
  ],
  'Badhra': [
    'Badhra', 'Chandwas', 'Jui', 'Kadma', 'Lohani', 
    'Kakroli', 'Jhojhu Kalan', 'Bhandwa', 'Kari', 'Kubja Nagar', 
    'Lad', 'Gopalwas'
  ],

  // Faridabad tehsils
  'Faridabad': [
    'Faridabad', 'Anangpur', 'Mawai', 'Dhatir', 'Mujesar', 
    'Kheri Kalan', 'Tilpat', 'Bhankri', 'Mewla Maharajpur', 'Pali', 
    'Wazirpur', 'Neemka'
  ],
  'Ballabgarh': [
    'Ballabgarh', 'Chawla', 'Fatehpur', 'Sikrona', 'Tigaon', 
    'Dayalpur', 'Chandpur', 'Pyala', 'Jharsetly', 'Sotai', 
    'Sector 58', 'Deeg'
  ],
  'Badkhal': [
    'Badkhal', 'Ankhir', 'Lakkarpur', 'Surajkund', 'Mewla', 
    'Dhauj', 'Khori', 'Shiv Durga Vihar'
  ],

  // Fatehabad tehsils
  'Fatehabad': [
    'Fatehabad', 'Bighar', 'Dhangar', 'Kirdhan', 'Majra', 
    'Badopal', 'Bhattu Kalan', 'Jandli', 'Khabra Kalan', 'Bhodia Khera', 
    'Hijrawan Kalan'
  ],
  'Ratia': [
    'Ratia', 'Alawalpur', 'Bara', 'Kamana', 'Lamba', 
    'Hamjapur', 'Rindal', 'Aharwan', 'Nagpur', 'Kunal', 
    'Ratta Khera', 'Chimnawala'
  ],
  'Tohana': [
    'Tohana', 'Amani', 'Dangra', 'Kanal', 'Rulan', 
    'Kanheri', 'Bhuna', 'Gorakhpur', 'Seman', 'Lali', 
    'Jamalpur Sheikhan', 'Chand Kalan'
  ],

  // Gurugram tehsils
  'Gurugram': [
    'Gurugram', 'Bhondsi', 'Gwal Pahari', 'Kadipur', 'Wazirabad', 
    'Daultabad', 'Garhi Harsaru', 'Kherki Daula', 'Mohammadpur', 'Nakhrola'
  ],
  'Pataudi': [
    'Pataudi', 'Bilasur', 'Hailey Mandi', 'Jaurasi', 'Kokhri', 
    'Brijpura', 'Uncha Majra', 'Khor', 'Rampur', 'Inchhapuri', 
    'Jatauli', 'Rathiwas'
  ],
  'Sohna': [
    'Sohna', 'Badshahpur', 'Damdama', 'Kherla', 'Silani', 
    'Ghamroj', 'Aklimpur', 'Teekli', 'Alipur', 'Raisina', 'Abheypur'
  ],
  'Farrukhnagar': [
    'Farrukhnagar', 'Jhanjharla', 'Kaliawas', 'Mubarikpur', 'Sultanpur', 
    'Budhera', 'Taj Nagar', 'Wazirpur', 'Dhankot', 'Garhi'
  ],
  'Manesar': [
    'Manesar', 'Kasan', 'Khoh', 'Naharpur', 'Shikohpur', 
    'Sidhrawali', 'Bilaspur', 'Kukrola', 'Binola', 'Panchgaon', 
    'Naharpur Rupa'
  ],

  // Hisar tehsils
  'Hisar': [
    'Hisar City', 'Balsamand', 'Dobhi', 'Mangali', 'Satrod', 
    'Dhansu', 'Kaimri', 'Ladwa', 'Rawalwas', 'Talwandi Rana', 
    'Siswal', 'Gangwa'
  ],
  'Hansi': [
    'Hansi City', 'Dhaka', 'Kanwari', 'Sorkhi', 'Ugalan', 
    'Sheikhpura', 'Umra', 'Sisai', 'Puthi Saman', 'Garhi', 
    'Masudpur', 'Bhatol'
  ],
  'Narnaund': [
    'Narnaund', 'Baas', 'Lohan', 'Rajthal', 'Sisai', 
    'Rakhi Shahpur', 'Rakhi Khas', 'Petwar', 'Mirchpur', 'Khanda Kheri', 
    'Kapro', 'Thurana'
  ],
  'Barwala': [
    'Barwala', 'Daulatpur', 'Kharak', 'Mirzapur', 'Sarsod', 
    'Khedar', 'Bugana', 'Jeora', 'Litani', 'Pabra', 'Agroha'
  ],
  'Adampur': [
    'Adampur', 'Chaudhariwas', 'Khabra', 'Kishanpura', 'Siswal', 
    'Jhiri', 'Bagla', 'Kabrel', 'Sadalpur', 'Chuli Bagrian'
  ],

  // Jhajjar tehsils
  'Jhajjar': [
    'Badli', 'Dulhera', 'Kablana', 'Kheri Jat', 'Jhajjar Town', 
    'Yakubpur', 'Silana', 'Birdhana', 'Guriya', 'Salhawas', 'Machhrauli'
  ],
  'Bahadurgarh': [
    'Kharhar', 'Mandothi', 'Sankhol', 'Sidhipur', 'Bahadurgarh Town', 
    'Linepar', 'Bamnoli', 'Jassaur Kheri', 'Nuna Majra', 'Asaudha'
  ],
  'Beri': [
    'Dighal', 'Gochhi', 'Lakhria', 'Wazirpur', 'Beri Town', 
    'Dubaldhan', 'Bhagalpur', 'Jahazgarh', 'Kalanaur', 'Chhara'
  ],
  'Matanhail': [
    'Chhuchhakwas', 'Kheri Khumran', 'Salhawas', 'Sasroli', 'Matanhail', 
    'Khanpur', 'Jharli', 'Khudan', 'Gwalison', 'Mohanbari'
  ],

  // Jind tehsils
  'Jind': [
    'Bibipur', 'Kila Zafargarh', 'Kinana', 'Ramrai', 'Jind City', 
    'Julani', 'Kandela', 'Pindara', 'Shahpur', 'Intal Kalan', 'Ahirka'
  ],
  'Julana': [
    'Budha Khera', 'Lajwana Kalan', 'Nandgarh', 'Shadipur', 'Julana Town', 
    'Khera Bakhta', 'Brahmanwas', 'Jai Jai Wanti', 'Pauli'
  ],
  'Safidon': [
    'Hatt', 'Muana', 'Sinkh', 'Singhsinghpur', 'Safidon Town', 
    'Didwara', 'Karkhana', 'Pillu Khera', 'Gangoli', 'Ramnagar'
  ],
  'Uchana': [
    'Karsindhu', 'Khatkar', 'Litani', 'Uchana Khurd', 'Uchana Kalan', 
    'Ghaso', 'Kabarchha', 'Kakrod', 'Sudkain Kalan', 'Baroda'
  ],
  'Narwana': [
    'Dhamtan Sahib', 'Kalwan', 'Pipaltha', 'Ujhana', 'Narwana Town', 
    'Belarkha', 'Danoda Kalan', 'Danoda Khurd', 'Dharodi', 'Hamezpur'
  ],

  // Kaithal tehsils
  'Kaithal': [
    'Dhand', 'Keorak', 'Khurana', 'Titram', 'Kaithal City', 
    'Deoban', 'Mundri', 'Patti Choudhary', 'Peoda', 'Harsola', 'Kathwar'
  ],
  'Guhla': [
    'Cheeka', 'Bhagal', 'Salarpur', 'Siwan', 'Guhla', 
    'Agondh', 'Bhatia', 'Kakra', 'Mastgarh', 'Kharodi', 'Sula'
  ],
  'Kalayat': [
    'Bata', 'Kharak Pandwa', 'Simla', 'Sajuma', 'Kalayat Town', 
    'Kolekhan', 'Kurar', 'Pinjupura', 'Barta', 'Dubbal'
  ],
  'Pundri': [
    'Habri', 'Kaul', 'Pai', 'Rasina', 'Pundri Town', 
    'Pharal', 'Karora', 'Fatehpur', 'Hajwana', 'Mohna', 'Sirsal'
  ],

  // Karnal tehsils
  'Karnal': [
    'Kachhwa', 'Phusgarh', 'Ranwar', 'Sheikhpura', 'Karnal City', 
    'Uchani', 'Shamgarh', 'Taraori', 'Kunjpura', 'Budhanpur', 'Gharaunda'
  ],
  'Indri': [
    'Bhadson', 'Garhi Birbal', 'Khera', 'Ramba', 'Indri Town', 
    'Ghangari', 'Kalsora', 'Labkari', 'Muradgarh', 'Udana', 'Zainpur'
  ],
  'Nilokheri': [
    'Butana', 'Pujam', 'Sambhli', 'Taraori', 'Nilokheri Town', 
    'Anjanthali', 'Sandhir', 'Sikri', 'Pipalwali'
  ],
  'Gharaunda': [
    'Bastara', 'Kohand', 'Kutail', 'Munak', 'Gharaunda Town', 
    'Chaura', 'Kalron', 'Lalupura', 'Phurlak', 'Sheikhupura'
  ],
  'Assandh': [
    'Balla', 'Jaisinghpura', 'Rangrutti', 'Salwan', 'Assandh Town', 
    'Rahra', 'Popran', 'Kheri Sharaf Ali', 'Uplana', 'Jundla'
  ],

  // Kurukshetra tehsils
  'Thanesar': [
    'Amin', 'Jyotisar', 'Kirmach', 'Mirzapur', 'Kurukshetra Town', 
    'Umri', 'Pipli', 'Chanarthal', 'Bahri', 'Kheri'
  ],
  'Pehowa': [
    'Bakhli', 'Gumthala Garhu', 'Murtzapur', 'Saraswati Khera', 'Pehowa Town', 
    'Sandholi', 'Sarsa', 'Ishaq', 'Lothani'
  ],
  'Shahbad': [
    'Jarauda', 'Kharindwa', 'Nalvi', 'Tangore', 'Shahbad Town', 
    'Dhola', 'Jhansa', 'Kalsana', 'Yara', 'Babain'
  ],
  'Ladwa': [
    'Babain', 'Ban', 'Dhanura', 'Kalsana', 'Ladwa Town', 
    'Mathana', 'Mehra', 'Niwarsi', 'Sanghor', 'Barwa'
  ],

  // Mahendragarh tehsils
  'Narnaul': [
    'Kalyanpura', 'Nasibpur', 'Tajpur', 'Sirohi Bahali', 'Narnaul City', 
    'Mandhana', 'Azimpur', 'Neerpur', 'Hudina', 'Khatripur'
  ],
  'Mahendragarh': [
    'Basirpur', 'Duloth', 'Khatod Kalan', 'Palri', 'Mahendragarh Town', 
    'Buchawas', 'Sigra', 'Satnali', 'Zerpur', 'Nimbi'
  ],
  'Kanina': [
    'Cheelpal', 'Kakrala', 'Karira', 'Sehlang', 'Kanina Town', 
    'Unhani', 'Kosli', 'Sundrah', 'Sihma', 'Dongra Ahir'
  ],
  'Nangal Chaudhary': [
    'Dohra', 'Mulodi', 'Nangal Shaloo', 'Shahpur', 'Nangal Chaudhary Town', 
    'Bhitera', 'Dostpur', 'Tajpur', 'Antri'
  ],

  // Nuh tehsils
  'Nuh': [
    'Aklimpur', 'Ghasera', 'Mahu', 'Salamba', 'Nuh Town', 
    'Aldonka', 'Bhadas', 'Rehna', 'Salaheri', 'Ujina', 'Malab'
  ],
  'Ferozepur Jhirka': [
    'Badarpur', 'Biwan', 'Maholi', 'Sakras', 'Ferozepur Town', 
    'Mahun', 'Agon', 'Doha', 'Ghata Shamshabad', 'Rawli'
  ],
  'Punahana': [
    'Jakhopur', 'Lohinga Kalan', 'Mundaka', 'Singar', 'Punahana Town', 
    'Bichhor', 'Pinangwan', 'Shikrawa', 'Papri', 'Laharwadi'
  ],
  'Taoru': [
    'Bissar Akbarpur', 'Didhara', 'Padheni', 'Rathiwas', 'Taoru Town', 
    'Mohammadpur', 'Sunari', 'Kasan', 'Chhilwali'
  ],

  // Palwal tehsils
  'Palwal': [
    'Alawalpur', 'Bamnikhera', 'Dhatir', 'Kalra', 'Palwal Town', 
    'Asaoti', 'Kailgawan', 'Kuslipur', 'Softa', 'Bagpur'
  ],
  'Hodal': [
    'Banchari', 'Bhond', 'Sondhad', 'Ujina', 'Hodal Town', 
    'Hassanpur', 'Likhi', 'Marroli', 'Seha', 'Sholaka'
  ],
  'Hathin': [
    'Bhimika', 'Gharrot', 'Kondal', 'Lakhnaka', 'Hathin Town', 
    'Bahin', 'Malai', 'Swamika', 'Mandkola', 'Raniyala'
  ],

  // Panchkula tehsils
  'Panchkula': [
    'Bir Ghaggar', 'Nada', 'Ramgarh', 'Tokah', 'Panchkula City', 
    'Barwala', 'Chandimandir', 'Morni', 'Pinjore', 'Kalka'
  ],
  'Kalka': [
    'Bitna', 'Pinjore', 'Tipra', 'Tagra Sahu', 'Kalka Town', 
    'Dhamala', 'Nanakpur', 'Kiratpur', 'Lohgarh'
  ],
  'Raipur Rani': [
    'Hangola', 'Kheri', 'Mauli', 'Tibri', 'Raipur Rani Town', 
    'Kami', 'Pyarewala', 'Samlotha', 'Garhi'
  ],

  // Panipat tehsils
  'Panipat': [
    'Atta', 'Babarpur', 'Binjhol', 'Kabri', 'Panipat City', 
    'Refinery', 'Sewah', 'Madlauda', 'Kavi', 'Shodapur'
  ],
  'Samalkha': [
    'Chulkana', 'Ganaur', 'Hathwala', 'Pattikalyana', 'Samalkha Town', 
    'Kiwana', 'Manana', 'Naraina', 'Dehra'
  ],
  'Israna': [
    'Dharampur', 'Kawi', 'Naultha', 'Pardhana', 'Israna Village', 
    'Kakoda', 'Mandi', 'Shahpur', 'Bhandari'
  ],
  'Bapoli': [
    'Jalmana', 'Sanoli Khurd', 'Sanoli Kalan', 'Wazidpur', 'Bapoli Village', 
    'Goela Khera', 'Chhajpur', 'Beholpur'
  ],

  // Rewari tehsils
  'Rewari': [
    'Bharawas', 'Dahina', 'Gokalgarh', 'Jatusana', 'Rewari City', 
    'Khaliawas', 'Kund', 'Bithwana', 'Landha', 'Gangacha Ahir'
  ],
  'Bawal': [
    'Banipur', 'Jhabwa', 'Khera', 'Sabi', 'Bawal Town', 
    'Odhi', 'Nangal Teju', 'Suthana', 'Pranpura', 'Ibrahimpur'
  ],
  'Kosli': [
    'Dhaloia', 'Guria', 'Jharoda', 'Kanharwas', 'Kosli Village', 
    'Gujjarwas', 'Lilodh', 'Salhawas', 'Subasepur', 'Bhakli'
  ],

  // Rohtak tehsils
  'Rohtak': [
    'Anwal', 'Assan', 'Baland', 'Baniyani', 'Jassia', 'Rohtak City', 
    'Bohar', 'Asthal Bohar', 'Sunaria', 'Makrauli Kalan', 'Karotha'
  ],
  'Meham': [
    'Behalba', 'Chandi', 'Farmana', 'Lakhan Majra', 'Semla', 'Meham Town', 
    'Madina', 'Nidana', 'Bainsi', 'Mokhra'
  ],
  'Sampla': [
    'Bhalout', 'Gandhra', 'Garhi Sampla', 'Ismaila', 'Kharawar', 
    'Sampla Town', 'Hassangarh', 'Pakasma', 'Gidhran'
  ],

  // Sirsa tehsils
  'Sirsa': [
    'Bhadra', 'Chadiwal', 'Nejadela Kalan', 'Shahpur Begu', 'Sirsa City', 
    'Mangala', 'Phoolkan', 'Bajekan', 'Sikanderpur', 'Vaidwala'
  ],
  'Dabwali': [
    'Chautala', 'Ganga', 'Lohgarh', 'Shergarh', 'Mandi Dabwali', 
    'Mithri', 'Doomwali', 'Abubshahar', 'Masitan'
  ],
  'Ellenabad': [
    'Amritsar', 'Kariwala', 'Mithi Sureran', 'Rori', 'Ellenabad Town', 
    'Talwara', 'Kuttabadh', 'Poharkan', 'Dholpalia'
  ],
  'Rania': [
    'Bani', 'Khabra', 'Rania Town', 'Ottu', 'Jiwan Nagar', 
    'Sant Nagar', 'Kariwala', 'Nakora', 'Keharwala'
  ],
  'Odhan': [
    'Kalanwali', 'Lakkadwali', 'Paniwala Mota', 'Sahuwala', 'Odhan Village', 
    'Anandgarh', 'Khuiyan Nepalpur', 'Choramar'
  ],

  // Sonipat tehsils
  'Sonipat': [
    'Bahalgarh', 'Fazilpur', 'Khewra', 'Murthal', 'Rai', 'Sonipat City', 
    'Rathdhana', 'Kakroi', 'Larsauli', 'Ganaur'
  ],
  'Ganaur': [
    'Badi', 'Panchera', 'Purkhas', 'Sandhal', 'Ganaur Town', 
    'Kailana', 'Pugthala', 'Sheikhupura', 'Datauli'
  ],
  'Gohana': [
    'Baroda', 'Khanpur Kalan', 'Mundlana', 'Rithal', 'Gohana Town', 
    'Butana', 'Lath', 'Kathura', 'Riwara', 'Chhara'
  ],
  'Kharkhoda': [
    'Firozpur', 'Gopalpur', 'Pipalshah', 'Sehri', 'Kharkhoda Town', 
    'Saidpur', 'Sisana', 'Silana', 'Thana Kalan'
  ],

  // Yamunanagar tehsils
  'Jagadhri': [
    'Bari', 'Bhud', 'Fatehpur', 'Tajewala', 'Jagadhri City', 
    'Yamunanagar City', 'Buria', 'Damla', 'Henda'
  ],
  'Chhachhrauli': [
    'Khizri', 'Muzaffar', 'Pratap Nagar', 'Sherpur', 'Chhachhrauli Town', 
    'Ledi', 'Khadril', 'Taharpur'
  ],
  'Bilaspur': [
    'Chhachhrauli', 'Kaprigaon', 'Marwa', 'Sadhaura', 'Bilaspur Town', 
    'Machhrali', 'Ranjitpur', 'Sandhala'
  ],
  'Radaur': [
    'Alahar', 'Bhud Kalan', 'Ghespur', 'Jathlana', 'Radaur Town', 
    'Bubka', 'Gumthala', 'Potli', 'Sasauli'
  ]
};
