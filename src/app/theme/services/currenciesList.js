(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('currenciesList', currenciesList);

    /** @ngInject */
    function currenciesList() {
        return [
            {
                "code": "ZAR",
                "description": "South African Rand",
                "symbol": "R",
                "unit": "rand",
                "divisibility": 2
            },
            {
                "code": "EUR",
                "description": "Euro",
                "symbol": "€",
                "unit": "euro",
                "divisibility": 2
            },
            {
                "code": "USD",
                "description": "United States Dollar",
                "symbol": "$",
                "unit": "dollar",
                "divisibility": 2
            },
            {
                "code": "XBT",
                "description": "Bitcoin",
                "symbol": "฿",
                "unit": "bitcoin",
                "divisibility": 8
            },
            {
                "code": "ADA",
                "description": "Ada",
                "symbol": "ADA",
                "unit": "ada",
                "divisibility": 6
            },
            {
                "code": "XRP",
                "description": "Ripple",
                "symbol": "XRP",
                "unit": "ripple",
                "divisibility": 6
            },
            {
                "code": "DOGE",
                "description": "Doge coin",
                "symbol": "Ð",
                "unit": "dogecoin",
                "divisibility": 8
            },
            {
                "code": "DOT",
                "description": "DOT",
                "symbol": "DOT",
                "unit": "dot",
                "divisibility": 10
            },
            {
                "code": "SOL",
                "description": "Solana",
                "symbol": "SOL",
                "unit": "solana",
                "divisibility": 6
            },
            {
                "code": "BCH",
                "description": "Bitcoin cash",
                "symbol": "BCH",
                "unit": "bitcoin cash",
                "divisibility": 8
            },
            {
                "code": "LTC",
                "description": "Litecoin",
                "symbol": "Ł",
                "unit": "litecoin",
                "divisibility": 8
            },
            {
                "code": "BNB",
                "description": "Binance coin",
                "symbol": "BNB",
                "unit": "binance coin",
                "divisibility": 8
            },
            {
                "code": "USDC",
                "description": "USD Coin",
                "symbol": "$",
                "unit": "dollar",
                "divisibility": 7
            },
            {
                "code": "IDR",
                "description": "Indonesian Rupiah",
                "symbol": "₱",
                "unit": "rupiah",
                "divisibility": 2
            },
            {
                "code": "SGD",
                "description": "Singaporean Dollar",
                "symbol": "S$",
                "unit": "dollar",
                "divisibility": 2
            },
            {
                "code": "CNY",
                "description": "Chinese Yuan",
                "symbol": "¥",
                "unit": "yuan",
                "divisibility": 2
            },
            {
                "code": "XLM",
                "description": "Stellar Lumen",
                "symbol": "*",
                "unit": "lumen",
                "divisibility": 7
            },
            {
                "code": "ETH",
                "description": "Ethereum",
                "symbol": "Ξ",
                "unit": "ethereum",
                "divisibility": 18
            },
            {
                "code": "CAD",
                "description": "Canadian Dollar",
                "divisibility": 2,
                "symbol": "CA$",
                "unit": "dollar"
            },
            {
                "code": "AED",
                "description": "United Arab Emirates Dirham",
                "divisibility": 2,
                "symbol": "AED",
                "unit": "dirham"
            },
            {
                "code": "AFN",
                "description": "Afghan Afghani",
                "divisibility": 0,
                "symbol": "Af",
                "unit": "afghani"
            },
            {
                "code": "ALL",
                "description": "Albanian Lek",
                "divisibility": 0,
                "symbol": "ALL",
                "unit": "lek"
            },
            {
                "code": "AMD",
                "description": "Armenian Dram",
                "divisibility": 0,
                "symbol": "AMD",
                "unit": "dram"
            },
            {
                "code": "ARS",
                "description": "Argentine Peso",
                "divisibility": 2,
                "symbol": "AR$",
                "unit": "peso"
            },
            {
                "code": "AUD",
                "description": "Australian Dollar",
                "divisibility": 2,
                "symbol": "AU$",
                "unit": "dollar"
            },
            {
                "code": "AZN",
                "description": "Azerbaijani Manat",
                "divisibility": 2,
                "symbol": "man.",
                "unit": "manat"
            },
            {
                "code": "BAM",
                "description": "Bosnia-Herzegovina Convertible Mark",
                "divisibility": 2,
                "symbol": "KM",
                "unit": "mark"
            },
            {
                "code": "BDT",
                "description": "Bangladeshi Taka",
                "divisibility": 2,
                "symbol": "Tk",
                "unit": "taka"
            },
            {
                "code": "BGN",
                "description": "Bulgarian Lev",
                "divisibility": 2,
                "symbol": "BGN",
                "unit": "lev"
            },
            {
                "code": "BHD",
                "description": "Bahraini Dinar",
                "divisibility": 3,
                "symbol": "BD",
                "unit": "dinar"
            },
            {
                "code": "BIF",
                "description": "Burundian Franc",
                "divisibility": 0,
                "symbol": "FBu",
                "unit": "franc"
            },
            {
                "code": "BND",
                "description": "Brunei Dollar",
                "divisibility": 2,
                "symbol": "BN$",
                "unit": "dollar"
            },
            {
                "code": "BOB",
                "description": "Bolivian Boliviano",
                "divisibility": 2,
                "symbol": "Bs",
                "unit": "boliviano"
            },
            {
                "code": "BRL",
                "description": "Brazilian Real",
                "divisibility": 2,
                "symbol": "R$",
                "unit": "real"
            },
            {
                "code": "BWP",
                "description": "Botswanan Pula",
                "divisibility": 2,
                "symbol": "BWP",
                "unit": "pula"
            },
            {
                "code": "BYN",
                "description": "Belarusian Ruble",
                "divisibility": 0,
                "symbol": "BYN",
                "unit": "ruble"
            },
            {
                "code": "BZD",
                "description": "Belize Dollar",
                "divisibility": 2,
                "symbol": "BZ$",
                "unit": "dollar"
            },
            {
                "code": "CDF",
                "description": "Congolese Franc",
                "divisibility": 2,
                "symbol": "CDF",
                "unit": "franc"
            },
            {
                "code": "CHF",
                "description": "Swiss Franc",
                "divisibility": 2,
                "symbol": "CHF",
                "unit": "franc"
            },
            {
                "code": "CLP",
                "description": "Chilean Peso",
                "divisibility": 0,
                "symbol": "CL$",
                "unit": "peso"
            },
            {
                "code": "COP",
                "description": "Colombian Peso",
                "divisibility": 0,
                "symbol": "CO$",
                "unit": "peso"
            },
            {
                "code": "CRC",
                "description": "Costa Rican Colón",
                "divisibility": 0,
                "symbol": "₡",
                "unit": "colón"
            },
            {
                "code": "CVE",
                "description": "Cape Verdean Escudo",
                "divisibility": 2,
                "symbol": "CV$",
                "unit": "escudo"
            },
            {
                "code": "CZK",
                "description": "Czech Republic Koruna",
                "divisibility": 2,
                "symbol": "Kč",
                "unit": "koruna"
            },
            {
                "code": "DJF",
                "description": "Djiboutian Franc",
                "divisibility": 0,
                "symbol": "Fdj",
                "unit": "franc"
            },
            {
                "code": "DKK",
                "description": "Danish Krone",
                "divisibility": 2,
                "symbol": "Dkr",
                "unit": "krone"
            },
            {
                "code": "DOP",
                "description": "Dominican Peso",
                "divisibility": 2,
                "symbol": "RD$",
                "unit": "peso"
            },
            {
                "code": "DZD",
                "description": "Algerian Dinar",
                "divisibility": 2,
                "symbol": "DA",
                "unit": "dinar"
            },
            {
                "code": "EGP",
                "description": "Egyptian Pound",
                "divisibility": 2,
                "symbol": "EGP",
                "unit": "pound"
            },
            {
                "code": "ERN",
                "description": "Eritrean Nakfa",
                "divisibility": 2,
                "symbol": "Nfk",
                "unit": "nakfa"
            },
            {
                "code": "ETB",
                "description": "Ethiopian Birr",
                "divisibility": 2,
                "symbol": "Br",
                "unit": "birr"
            },
            {
                "code": "GBP",
                "description": "British Pound Sterling",
                "divisibility": 2,
                "symbol": "£",
                "unit": "sterling"
            },
            {
                "code": "GEL",
                "description": "Georgian Lari",
                "divisibility": 2,
                "symbol": "GEL",
                "unit": "lari"
            },
            {
                "code": "GHS",
                "description": "Ghanaian Cedi",
                "divisibility": 2,
                "symbol": "GH₵",
                "unit": "cedi"
            },
            {
                "code": "GNF",
                "description": "Guinean Franc",
                "divisibility": 0,
                "symbol": "FG",
                "unit": "franc"
            },
            {
                "code": "GTQ",
                "description": "Guatemalan Quetzal",
                "divisibility": 2,
                "symbol": "GTQ",
                "unit": "quetzal"
            },
            {
                "code": "HKD",
                "description": "Hong Kong Dollar",
                "divisibility": 2,
                "symbol": "HK$",
                "unit": "dollar"
            },
            {
                "code": "HNL",
                "description": "Honduran Lempira",
                "divisibility": 2,
                "symbol": "HNL",
                "unit": "lempira"
            },
            {
                "code": "HRK",
                "description": "Croatian Kuna",
                "divisibility": 2,
                "symbol": "kn",
                "unit": "kuna"
            },
            {
                "code": "HUF",
                "description": "Hungarian Forint",
                "divisibility": 0,
                "symbol": "Ft",
                "unit": "forint"
            },
            {
                "code": "ILS",
                "description": "Israeli New Sheqel",
                "divisibility": 2,
                "symbol": "₪",
                "unit": "sheqel"
            },
            {
                "code": "INR",
                "description": "Indian Rupee",
                "divisibility": 2,
                "symbol": "Rs",
                "unit": "rupee"
            },
            {
                "code": "IQD",
                "description": "Iraqi Dinar",
                "divisibility": 0,
                "symbol": "IQD",
                "unit": "dinar"
            },
            {
                "code": "IRR",
                "description": "Iranian Rial",
                "divisibility": 0,
                "symbol": "IRR",
                "unit": "rial"
            },
            {
                "code": "ISK",
                "description": "Icelandic Króna",
                "divisibility": 0,
                "symbol": "Ikr",
                "unit": "króna"
            },
            {
                "code": "JMD",
                "description": "Jamaican Dollar",
                "divisibility": 2,
                "symbol": "J$",
                "unit": "dollar"
            },
            {
                "code": "JOD",
                "description": "Jordanian Dinar",
                "divisibility": 3,
                "symbol": "JD",
                "unit": "dinar"
            },
            {
                "code": "JPY",
                "description": "Japanese Yen",
                "divisibility": 0,
                "symbol": "¥",
                "unit": "yen"
            },
            {
                "code": "KES",
                "description": "Kenyan Shilling",
                "divisibility": 2,
                "symbol": "Ksh",
                "unit": "shilling"
            },
            {
                "code": "KHR",
                "description": "Cambodian Riel",
                "divisibility": 2,
                "symbol": "KHR",
                "unit": "riel"
            },
            {
                "code": "KMF",
                "description": "Comorian Franc",
                "divisibility": 0,
                "symbol": "CF",
                "unit": "franc"
            },
            {
                "code": "KRW",
                "description": "South Korean Won",
                "divisibility": 0,
                "symbol": "₩",
                "unit": "won"
            },
            {
                "code": "KWD",
                "description": "Kuwaiti Dinar",
                "divisibility": 3,
                "symbol": "KD",
                "unit": "dinar"
            },
            {
                "code": "KZT",
                "description": "Kazakhstani Tenge",
                "divisibility": 2,
                "symbol": "KZT",
                "unit": "tenge"
            },
            {
                "code": "LBP",
                "description": "Lebanese Pound",
                "divisibility": 0,
                "symbol": "LB£",
                "unit": "pound"
            },
            {
                "code": "LKR",
                "description": "Sri Lankan Rupee",
                "divisibility": 2,
                "symbol": "SLRs",
                "unit": "rupee"
            },
            {
                "code": "LYD",
                "description": "Libyan Dinar",
                "divisibility": 3,
                "symbol": "LD",
                "unit": "dinar"
            },
            {
                "code": "MAD",
                "description": "Moroccan Dirham",
                "divisibility": 2,
                "symbol": "MAD",
                "unit": "dirham"
            },
            {
                "code": "MDL",
                "description": "Moldovan Leu",
                "divisibility": 2,
                "symbol": "MDL",
                "unit": "leu"
            },
            {
                "code": "MGA",
                "description": "Malagasy Ariary",
                "divisibility": 0,
                "symbol": "MGA",
                "unit": "ariary"
            },
            {
                "code": "MKD",
                "description": "Macedonian Denar",
                "divisibility": 2,
                "symbol": "MKD",
                "unit": "denar"
            },
            {
                "code": "MMK",
                "description": "Myanma Kyat",
                "divisibility": 0,
                "symbol": "MMK",
                "unit": "kyat"
            },
            {
                "code": "MOP",
                "description": "Macanese Pataca",
                "divisibility": 2,
                "symbol": "MOP$",
                "unit": "pataca"
            },
            {
                "code": "MUR",
                "description": "Mauritian Rupee",
                "divisibility": 0,
                "symbol": "MURs",
                "unit": "rupee"
            },
            {
                "code": "MXN",
                "description": "Mexican Peso",
                "divisibility": 2,
                "symbol": "MX$",
                "unit": "peso"
            },
            {
                "code": "MYR",
                "description": "Malaysian Ringgit",
                "divisibility": 2,
                "symbol": "RM",
                "unit": "ringgit"
            },
            {
                "code": "MZN",
                "description": "Mozambican Metical",
                "divisibility": 2,
                "symbol": "MTn",
                "unit": "metical"
            },
            {
                "code": "NAD",
                "description": "Namibian Dollar",
                "divisibility": 2,
                "symbol": "N$",
                "unit": "dollar"
            },
            {
                "code": "NGN",
                "description": "Nigerian Naira",
                "divisibility": 2,
                "symbol": "₦",
                "unit": "naira"
            },
            {
                "code": "NIO",
                "description": "Nicaraguan Córdoba",
                "divisibility": 2,
                "symbol": "C$",
                "unit": "córdoba"
            },
            {
                "code": "NOK",
                "description": "Norwegian Krone",
                "divisibility": 2,
                "symbol": "Nkr",
                "unit": "krone"
            },
            {
                "code": "NPR",
                "description": "Nepalese Rupee",
                "divisibility": 2,
                "symbol": "NPRs",
                "unit": "rupee"
            },
            {
                "code": "NZD",
                "description": "New Zealand Dollar",
                "divisibility": 2,
                "symbol": "NZ$",
                "unit": "dollar"
            },
            {
                "code": "OMR",
                "description": "Omani Rial",
                "divisibility": 3,
                "symbol": "OMR",
                "unit": "rial"
            },
            {
                "code": "PAB",
                "description": "Panamanian Balboa",
                "divisibility": 2,
                "symbol": "B/.",
                "unit": "balboa"
            },
            {
                "code": "PEN",
                "description": "Peruvian Nuevo Sol",
                "divisibility": 2,
                "symbol": "S/.",
                "unit": "sol"
            },
            {
                "code": "PHP",
                "description": "Philippine Peso",
                "divisibility": 2,
                "symbol": "₱",
                "unit": "peso"
            },
            {
                "code": "PKR",
                "description": "Pakistani Rupee",
                "divisibility": 0,
                "symbol": "PKRs",
                "unit": "rupee"
            },
            {
                "code": "PLN",
                "description": "Polish Zloty",
                "divisibility": 2,
                "symbol": "zł",
                "unit": "zloty"
            },
            {
                "code": "PYG",
                "description": "Paraguayan Guarani",
                "divisibility": 0,
                "symbol": "₲",
                "unit": "guarani"
            },
            {
                "code": "QAR",
                "description": "Qatari Rial",
                "divisibility": 2,
                "symbol": "QR",
                "unit": "rial"
            },
            {
                "code": "RON",
                "description": "Romanian Leu",
                "divisibility": 2,
                "symbol": "RON",
                "unit": "leu"
            },
            {
                "code": "RSD",
                "description": "Serbian Dinar",
                "divisibility": 0,
                "symbol": "din.",
                "unit": "dinar"
            },
            {
                "code": "RUB",
                "description": "Russian Ruble",
                "divisibility": 2,
                "symbol": "RUB",
                "unit": "ruble"
            },
            {
                "code": "RWF",
                "description": "Rwandan Franc",
                "divisibility": 0,
                "symbol": "RWF",
                "unit": "franc"
            },
            {
                "code": "SAR",
                "description": "Saudi Riyal",
                "divisibility": 2,
                "symbol": "SR",
                "unit": "riyal"
            },
            {
                "code": "SDG",
                "description": "Sudanese Pound",
                "divisibility": 2,
                "symbol": "SDG",
                "unit": "pound"
            },
            {
                "code": "SEK",
                "description": "Swedish Krona",
                "divisibility": 2,
                "symbol": "Skr",
                "unit": "krona"
            },
            {
                "code": "SOS",
                "description": "Somali Shilling",
                "divisibility": 0,
                "symbol": "Ssh",
                "unit": "shilling"
            },
            {
                "code": "SYP",
                "description": "Syrian Pound",
                "divisibility": 0,
                "symbol": "SY£",
                "unit": "pound"
            },
            {
                "code": "THB",
                "description": "Thai Baht",
                "divisibility": 2,
                "symbol": "฿",
                "unit": "baht"
            },
            {
                "code": "TND",
                "description": "Tunisian Dinar",
                "divisibility": 3,
                "symbol": "DT",
                "unit": "dinar"
            },
            {
                "code": "TOP",
                "description": "Tongan Paʻanga",
                "divisibility": 2,
                "symbol": "T$",
                "unit": "paʻanga"
            },
            {
                "code": "TRY",
                "description": "Turkish Lira",
                "divisibility": 2,
                "symbol": "TL",
                "unit": "lira"
            },
            {
                "code": "TTD",
                "description": "Trinidad and Tobago Dollar",
                "divisibility": 2,
                "symbol": "TT$",
                "unit": "dollar"
            },
            {
                "code": "TWD",
                "description": "New Taiwan Dollar",
                "divisibility": 2,
                "symbol": "NT$",
                "unit": "dollar"
            },
            {
                "code": "TZS",
                "description": "Tanzanian Shilling",
                "divisibility": 0,
                "symbol": "TSh",
                "unit": "shilling"
            },
            {
                "code": "UAH",
                "description": "Ukrainian Hryvnia",
                "divisibility": 2,
                "symbol": "₴",
                "unit": "hryvnia"
            },
            {
                "code": "UGX",
                "description": "Ugandan Shilling",
                "divisibility": 0,
                "symbol": "USh",
                "unit": "shilling"
            },
            {
                "code": "UYU",
                "description": "Uruguayan Peso",
                "divisibility": 2,
                "symbol": "$U",
                "unit": "peso"
            },
            {
                "code": "UZS",
                "description": "Uzbekistan Som",
                "divisibility": 0,
                "symbol": "UZS",
                "unit": "som"
            },
            {
                "code": "VEF",
                "description": "Venezuelan Bolívar",
                "divisibility": 2,
                "symbol": "Bs.F.",
                "unit": "bolívar"
            },
            {
                "code": "VND",
                "description": "Vietnamese Dong",
                "divisibility": 0,
                "symbol": "₫",
                "unit": "dong"
            },
            {
                "code": "XAF",
                "description": "CFA Franc BEAC",
                "divisibility": 0,
                "symbol": "FCFA",
                "unit": "beac"
            },
            {
                "code": "XOF",
                "description": "CFA Franc BCEAO",
                "divisibility": 0,
                "symbol": "CFA",
                "unit": "bceao"
            },
            {
                "code": "YER",
                "description": "Yemeni Rial",
                "divisibility": 0,
                "symbol": "YR",
                "unit": "rial"
            },
            {
                "code": "ZMW",
                "description": "Zambian Kwacha",
                "divisibility": 0,
                "symbol": "K",
                "unit": "kwacha"
            },
            {
                "code": "AWG",
                "description": "Arubian Florin",
                "divisibility": 2,
                "symbol": "AWG",
                "unit": "florin"
            },
            {
                "code": "ANG",
                "description": "Netherlands Antillean Guilder",
                "divisibility": 2,
                "symbol": "ANG",
                "unit": "guilder"
            },
            {
                "code": "MNT",
                "description": "Mongolian Tögrög",
                "divisibility": 2,
                "symbol": "₮",
                "unit": "tögrög"
            },
            {
                "code": "SVC",
                "description": "Salvadoran Colón",
                "divisibility": 2,
                "symbol": "₡",
                "unit": "colón"
            },
            {
                "code": "VES",
                "description": "Sovereign Bolivar",
                "divisibility": 2,
                "symbol": "VES",
                "unit": "bolivar"
            },
            {
                "code": "CUC",
                "description": "Cuban Convertible Peso",
                "divisibility": 2,
                "symbol": "CUC$",
                "unit": "peso"
            },
            {
                "code": "AOA",
                "description": "Angolan Kwanza",
                "divisibility": 2,
                "symbol": "Kz",
                "unit": "kwanza"
            },
            {
                "code": "XPF",
                "description": "CFP Franc",
                "divisibility": 2,
                "symbol": "₣",
                "unit": "franc"
            },
            {
                "code": "STD",
                "description": "São Tomé and Príncipe Dobra",
                "divisibility": 2,
                "symbol": "Db",
                "unit": "dobra"
            },
            {
                "code": "MWK",
                "description": "Malawian Kwacha",
                "divisibility": 2,
                "symbol": "K",
                "unit": "kwacha"
            },
            {
                "code": "LRD",
                "description": "Liberian Dollar",
                "divisibility": 2,
                "symbol": "L$",
                "unit": "dollar"
            },
            {
                "code": "WST",
                "description": "Samoan Tālā",
                "divisibility": 2,
                "symbol": "WS$",
                "unit": "tālā"
            },
            {
                "code": "FKP",
                "description": "Falkland Islands Pound",
                "divisibility": 2,
                "symbol": "£",
                "unit": "pound"
            },
            {
                "code": "GIP",
                "description": "Gibraltar Pound",
                "divisibility": 2,
                "symbol": "£",
                "unit": "pound"
            },
            {
                "code": "MRU",
                "description": "Mauritanian Ouguiya",
                "divisibility": 2,
                "symbol": "UM",
                "unit": "ouguiya"
            },
            {
                "code": "GMD",
                "description": "Gambian Dalasi",
                "divisibility": 2,
                "symbol": "D",
                "unit": "dalasi"
            },
            {
                "code": "KPW",
                "description": "North Korean Won",
                "divisibility": 2,
                "symbol": "₩",
                "unit": "won"
            },
            {
                "code": "MVR",
                "description": "Maldivian Rufiyaa",
                "divisibility": 2,
                "symbol": "MVR",
                "unit": "rufiyaa"
            },
            {
                "code": "SHP",
                "description": "Saint Helena Pound",
                "divisibility": 2,
                "symbol": "£",
                "unit": "pound"
            },
            {
                "code": "TMT",
                "description": "Turkmenistan Manat",
                "divisibility": 2,
                "symbol": "T",
                "unit": "manat"
            },
            {
                "code": "SSP",
                "description": "South Sudanese Pound",
                "divisibility": 2,
                "symbol": "£",
                "unit": "pound"
            },
            {
                "code": "HTG",
                "description": "Haitian Gourde",
                "divisibility": 2,
                "symbol": "G",
                "unit": "gourde"
            },
            {
                "code": "TJS",
                "description": "Tajikistani Samani",
                "divisibility": 2,
                "symbol": "TJS",
                "unit": "samani"
            },
            {
                "code": "LAK",
                "description": "Lao Kip",
                "divisibility": 2,
                "symbol": "₭",
                "unit": "kip"
            },
            {
                "code": "JEP",
                "description": "Jersey Pound",
                "divisibility": 2,
                "symbol": "£",
                "unit": "pound"
            },
            {
                "code": "KYD",
                "description": "Cayman Islands Dollar",
                "divisibility": 2,
                "symbol": "$",
                "unit": "dollar"
            },
            {
                "code": "FJD",
                "description": "Fijian Dollar",
                "divisibility": 2,
                "symbol": "FJ$",
                "unit": "dollar"
            },
            {
                "code": "PGK",
                "description": "Papua New Guinean Kina",
                "divisibility": 2,
                "symbol": "K",
                "unit": "kina"
            },
            {
                "code": "CUP",
                "description": "Cuban Peso",
                "divisibility": 2,
                "symbol": "$",
                "unit": "peso"
            },
            {
                "code": "SZL",
                "description": "Swazi Lilangeni",
                "divisibility": 2,
                "symbol": "L",
                "unit": "lilangeni"
            },
            {
                "code": "BMD",
                "description": "Bermudian Dollar",
                "divisibility": 2,
                "symbol": "$",
                "unit": "dollar"
            },
            {
                "code": "GYD",
                "description": "Guyanese Dollar",
                "divisibility": 2,
                "symbol": "$",
                "unit": "dollar"
            },
            {
                "code": "XCD",
                "description": "Eastern Caribbean Dollar",
                "divisibility": 2,
                "symbol": "$",
                "unit": "dollar"
            },
            {
                "code": "SCR",
                "description": "Seychellois Rupee",
                "divisibility": 2,
                "symbol": "SR",
                "unit": "rupee"
            },
            {
                "code": "VUV",
                "description": "Vanuatu Vatu",
                "divisibility": 0,
                "symbol": "VT",
                "unit": "vatu"
            },
            {
                "code": "SBD",
                "description": "Solomon Islands Dollar",
                "divisibility": 2,
                "symbol": "$",
                "unit": "dollar"
            },
            {
                "code": "SLL",
                "description": "Sierra Leonean Leone",
                "divisibility": 2,
                "symbol": "Le",
                "unit": "leone"
            },
            {
                "code": "BBD",
                "description": "Barbadian Dollar",
                "divisibility": 2,
                "symbol": "Bds$",
                "unit": "dollar"
            },
            {
                "code": "GGP",
                "description": "Guernsey Pound",
                "divisibility": 2,
                "symbol": "£",
                "unit": "pound"
            },
            {
                "code": "LSL",
                "description": "Lesotho Loti",
                "divisibility": 2,
                "symbol": "L",
                "unit": "loti"
            },
            {
                "code": "IMP",
                "description": "Manx Pound",
                "divisibility": 2,
                "symbol": "£",
                "unit": "pound"
            },
            {
                "code": "BTN",
                "description": "Bhutanese Ngultrum",
                "divisibility": 2,
                "symbol": "BTN",
                "unit": "ngultrum"
            },
            {
                "code": "KGS",
                "description": "Kyrgyzstani Som",
                "divisibility": 2,
                "symbol": "KGS",
                "unit": "som"
            },
            {
                "code": "SRD",
                "description": "Surinamese Dollar",
                "divisibility": 2,
                "symbol": "$",
                "unit": "dollar"
            },
            {
                "code": "BSD",
                "description": "Bahamian Dollar",
                "divisibility": 2,
                "symbol": "$",
                "unit": "dollar"
            },
        ];
    }

})();
