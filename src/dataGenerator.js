// src/dataGenerator.js
import { faker, Faker, en, base, allFakers } from '@faker-js/faker';

export const SUPPORTED_TYPES = [
  'person',
  'finance',
  'location',
  'date',
  'commerce',
  'internet',
  'vehicle',
  'network',
  'company',
  'banking',
];

/**
 * Resolve a faker instance for a given locale.
 * Falls back to the default global faker if locale is unknown.
 */
function getFakerForLocale(locale) {
  if (!locale) return faker;
  // allFakers is a map of locale -> Faker instance
  if (allFakers[locale]) return allFakers[locale];
  // Try language prefix (e.g. 'fr_FR' -> 'fr')
  const lang = locale.split('_')[0].split('-')[0];
  if (allFakers[lang]) return allFakers[lang];
  return faker;
}

// ─── Generators ──────────────────────────────────────────────────────────────

function generatePerson(f) {
  return {
    id: f.string.uuid(),
    firstName: f.person.firstName(),
    lastName: f.person.lastName(),
    fullName: f.person.fullName(),
    gender: f.person.gender(),
    jobTitle: f.person.jobTitle(),
    jobArea: f.person.jobArea(),
    department: f.person.jobDescriptor(),
    bio: f.lorem.paragraph(),
    avatar: f.image.avatar(),
    birthdate: f.date.birthdate(),
    age: f.number.int({ min: 18, max: 80 }),
    email: f.internet.email(),
    phone: f.phone.number(),
    username: f.internet.username(),
    website: f.internet.url(),
    nationality: f.location.country(),
    address: {
      streetAddress: f.location.streetAddress(),
      city: f.location.city(),
      state: f.location.state(),
      zipCode: f.location.zipCode(),
      country: f.location.country(),
      countryCode: f.location.countryCode(),
    },
    socialMedia: {
      twitter: `@${f.internet.username()}`,
      instagram: `@${f.internet.username()}`,
      linkedin: f.internet.username(),
      github: f.internet.username(),
    },
    createdAt: f.date.past(),
    updatedAt: f.date.recent(),
  };
}

function generateFinance(f) {
  return {
    id: f.string.uuid(),
    accountNumber: f.finance.accountNumber(),
    accountName: f.finance.accountName(),
    amount: f.finance.amount({ min: 10, max: 100000, dec: 2 }),
    currency: f.finance.currencyCode(),
    currencyName: f.finance.currencyName(),
    currencySymbol: f.finance.currencySymbol(),
    creditCard: {
      number: f.finance.creditCardNumber(),
      type: f.finance.creditCardIssuer(),
      cvv: f.finance.creditCardCVV(),
      expirationDate: f.date.future(),
    },
    transactionType: f.finance.transactionType(),
    transactionDescription: f.finance.transactionDescription(),
    iban: f.finance.iban(),
    bic: f.finance.bic(),
    routingNumber: f.finance.routingNumber(),
    bitcoinAddress: f.finance.bitcoinAddress(),
    ethereumAddress: f.finance.ethereumAddress(),
    litecoinAddress: f.finance.litecoinAddress(),
    bankName: f.company.name(),
    transactionDate: f.date.recent(),
    pin: f.string.numeric(4),
  };
}

function generateLocation(f) {
  const lat = f.location.latitude();
  const lon = f.location.longitude();
  return {
    id: f.string.uuid(),
    streetAddress: f.location.streetAddress(),
    secondaryAddress: f.location.secondaryAddress(),
    city: f.location.city(),
    county: f.location.county(),
    state: f.location.state(),
    stateAbbr: f.location.state({ abbreviated: true }),
    country: f.location.country(),
    countryCode: f.location.countryCode(),
    zipCode: f.location.zipCode(),
    latitude: lat,
    longitude: lon,
    coordinates: { lat, lon },
    plusCode: `${f.string.alphanumeric(4)}+${f.string.alphanumeric(2)}`,
    timezone: f.location.timeZone(),
    continent: f.helpers.arrayElement([
      'Africa', 'Antarctica', 'Asia', 'Europe',
      'North America', 'Oceania', 'South America',
    ]),
    nearestAirport: f.string.alpha({ length: 3 }).toUpperCase(),
  };
}

function generateDate(f) {
  return {
    id: f.string.uuid(),
    pastDate: f.date.past(),
    futureDate: f.date.future(),
    recentDate: f.date.recent(),
    soonDate: f.date.soon(),
    birthday: f.date.birthdate(),
    timestamp: f.date.recent().getTime(),
    iso8601: f.date.recent().toISOString(),
    weekday: f.date.weekday(),
    month: f.date.month(),
    year: f.number.int({ min: 1970, max: 2030 }),
    quarter: `Q${f.number.int({ min: 1, max: 4 })}`,
    fiscalYear: `FY${f.number.int({ min: 2020, max: 2030 })}`,
  };
}

function generateCommerce(f) {
  const price = parseFloat(f.commerce.price({ min: 1, max: 9999 }));
  const originalPrice = parseFloat((price * f.number.float({ min: 1.05, max: 1.5 })).toFixed(2));
  return {
    id: f.string.uuid(),
    sku: f.string.alphanumeric(8).toUpperCase(),
    productName: f.commerce.productName(),
    productDescription: f.commerce.productDescription(),
    price,
    originalPrice,
    discountPercent: Math.round(((originalPrice - price) / originalPrice) * 100),
    currency: f.finance.currencyCode(),
    productMaterial: f.commerce.productMaterial(),
    color: f.color.human(),
    colorHex: f.internet.color(),
    productAdjective: f.commerce.productAdjective(),
    productCategory: f.commerce.department(),
    stockQuantity: f.number.int({ min: 0, max: 5000 }),
    inStock: f.datatype.boolean(),
    manufacturer: f.company.name(),
    brand: f.company.name(),
    rating: Math.round(f.number.float({ min: 1, max: 5 }) * 10) / 10,
    reviewCount: f.number.int({ min: 0, max: 10000 }),
    tags: f.helpers.multiple(() => f.commerce.productAdjective(), { count: 3 }),
    images: f.helpers.multiple(() => f.image.url({ width: 640, height: 480 }), { count: 3 }),
    createdAt: f.date.past(),
  };
}

function generateInternet(f) {
  return {
    id: f.string.uuid(),
    email: f.internet.email(),
    username: f.internet.username(),
    password: f.internet.password({ length: 16, memorable: false }),
    url: f.internet.url(),
    domainName: f.internet.domainName(),
    domainWord: f.internet.domainWord(),
    tld: f.internet.domainSuffix(),
    ipv4: f.internet.ipv4(),
    ipv6: f.internet.ipv6(),
    mac: f.internet.mac(),
    color: f.internet.color(),
    userAgent: f.internet.userAgent(),
    protocol: f.helpers.arrayElement(['http', 'https', 'ftp', 'wss']),
    port: f.internet.port(),
    slug: f.helpers.slugify(f.lorem.words(3)),
    jwt: `${f.string.alphanumeric(36)}.${f.string.alphanumeric(100)}.${f.string.alphanumeric(43)}`,
    apiKey: f.string.alphanumeric(32).toUpperCase(),
    webhookUrl: `https://${f.internet.domainName()}/webhooks/${f.string.uuid()}`,
    avatar: f.image.avatar(),
  };
}

function generateVehicle(f) {
  const makes = ['Toyota', 'Honda', 'BMW', 'Mercedes-Benz', 'Ford', 'Chevrolet',
    'Audi', 'Volkswagen', 'Nissan', 'Hyundai', 'Tesla', 'Porsche'];
  const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid', 'Hydrogen'];
  const transmissions = ['Automatic', 'Manual', 'CVT', 'Semi-Automatic'];
  const bodyTypes = ['Sedan', 'SUV', 'Pickup', 'Coupe', 'Hatchback', 'Convertible', 'Van', 'Truck'];
  const conditions = ['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Poor'];

  const make = f.helpers.arrayElement(makes);
  const year = f.number.int({ min: 1990, max: 2025 });

  return {
    id: f.string.uuid(),
    vin: f.vehicle.vin(),
    make,
    model: f.vehicle.model(),
    type: f.vehicle.type(),
    bodyType: f.helpers.arrayElement(bodyTypes),
    year,
    color: f.color.human(),
    colorHex: f.internet.color(),
    fuel: f.helpers.arrayElement(fuelTypes),
    transmission: f.helpers.arrayElement(transmissions),
    mileage: f.number.int({ min: 0, max: 300000 }),
    engineSize: `${f.number.float({ min: 1.0, max: 6.0, fractionDigits: 1 })}L`,
    horsepower: f.number.int({ min: 80, max: 800 }),
    doors: f.helpers.arrayElement([2, 4, 5]),
    seats: f.helpers.arrayElement([2, 4, 5, 7, 8]),
    price: parseFloat(f.commerce.price({ min: 5000, max: 200000 })),
    condition: f.helpers.arrayElement(conditions),
    licensePlate: `${f.string.alpha({ length: 3 }).toUpperCase()}-${f.string.numeric(4)}`,
    registrationDate: f.date.past({ years: year < 2020 ? 10 : 3 }),
    lastServiceDate: f.date.recent({ days: 365 }),
    features: f.helpers.multiple(
      () => f.helpers.arrayElement([
        'Sunroof', 'Navigation', 'Bluetooth', 'Backup Camera', 'Heated Seats',
        'Leather Interior', 'Apple CarPlay', 'Android Auto', 'Lane Assist',
        'Adaptive Cruise Control', 'Blind Spot Monitor', 'Parking Sensors',
      ]),
      { count: { min: 2, max: 6 } }
    ),
  };
}

function generateNetwork(f) {
  const protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'FTP', 'SFTP', 'SSH', 'DNS', 'SMTP', 'IMAP'];
  const statusCodes = [200, 201, 204, 301, 302, 400, 401, 403, 404, 429, 500, 502, 503];
  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

  return {
    id: f.string.uuid(),
    ipv4: f.internet.ipv4(),
    ipv6: f.internet.ipv6(),
    privateIpv4: `192.168.${f.number.int({ min: 0, max: 255 })}.${f.number.int({ min: 1, max: 254 })}`,
    mac: f.internet.mac(),
    cidr: `${f.internet.ipv4()}/${f.helpers.arrayElement([8, 16, 24, 32])}`,
    port: f.internet.port(),
    protocol: f.helpers.arrayElement(protocols),
    httpMethod: f.helpers.arrayElement(methods),
    statusCode: f.helpers.arrayElement(statusCodes),
    latencyMs: f.number.int({ min: 1, max: 2000 }),
    bandwidthMbps: f.number.float({ min: 0.5, max: 10000, fractionDigits: 2 }),
    packetLoss: f.number.float({ min: 0, max: 5, fractionDigits: 2 }),
    hostname: f.internet.domainName(),
    subnet: `255.255.${f.helpers.arrayElement([0, 255])}.0`,
    gateway: `192.168.${f.number.int({ min: 0, max: 255 })}.1`,
    dns: f.helpers.arrayElement(['8.8.8.8', '1.1.1.1', '9.9.9.9', '208.67.222.222']),
    userAgent: f.internet.userAgent(),
    requestPath: `/${f.helpers.slugify(f.lorem.words(2))}/${f.string.uuid()}`,
    requestDuration: f.number.int({ min: 1, max: 5000 }),
    isp: f.company.name(),
    asn: `AS${f.number.int({ min: 1000, max: 99999 })}`,
    timestamp: f.date.recent().toISOString(),
  };
}

function generateCompany(f) {
  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing',
    'Energy', 'Real Estate', 'Education', 'Media', 'Transportation',
    'Agriculture', 'Hospitality', 'Construction', 'Consulting',
  ];
  const stages = ['Seed', 'Series A', 'Series B', 'Series C', 'Series D', 'IPO', 'Public', 'Acquired'];
  const sizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'];

  const founded = f.number.int({ min: 1950, max: 2023 });
  const employees = f.number.int({ min: 1, max: 500000 });

  return {
    id: f.string.uuid(),
    name: f.company.name(),
    legalName: `${f.company.name()} ${f.helpers.arrayElement(['Inc.', 'LLC', 'Corp.', 'Ltd.', 'GmbH', 'S.A.'])}`,
    catchphrase: f.company.catchPhrase(),
    buzzPhrase: f.company.buzzPhrase(),
    industry: f.helpers.arrayElement(industries),
    subIndustry: f.company.buzzNoun(),
    website: f.internet.url(),
    email: `contact@${f.internet.domainName()}`,
    phone: f.phone.number(),
    address: {
      streetAddress: f.location.streetAddress(),
      city: f.location.city(),
      state: f.location.state(),
      country: f.location.country(),
      zipCode: f.location.zipCode(),
    },
    founded,
    stage: f.helpers.arrayElement(stages),
    employees,
    employeeRange: f.helpers.arrayElement(sizes),
    revenue: `$${f.finance.amount({ min: 100000, max: 10000000000, dec: 0 })}`,
    valuation: `$${f.finance.amount({ min: 1000000, max: 100000000000, dec: 0 })}`,
    stockSymbol: f.string.alpha({ length: 4 }).toUpperCase(),
    ceo: f.person.fullName(),
    departments: f.helpers.multiple(
      () => f.commerce.department(),
      { count: { min: 3, max: 8 } }
    ),
    socialMedia: {
      linkedin: `https://linkedin.com/company/${f.internet.username()}`,
      twitter: `https://twitter.com/${f.internet.username()}`,
      github: `https://github.com/${f.internet.username()}`,
    },
    tags: f.helpers.multiple(() => f.company.buzzAdjective(), { count: 4 }),
    description: f.lorem.paragraph(),
    isPublic: f.datatype.boolean(),
    createdAt: f.date.past(),
  };
}

// ─── Banking (linked: client + accounts + transactions) ───────────────────────

function generateBanking(f) {
  const CURRENCIES = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD'];
  const ACCOUNT_TYPES = ['Checking', 'Savings', 'Business', 'Money Market', 'Certificate of Deposit'];
  const ACCOUNT_STATUSES = ['Active', 'Dormant', 'Suspended', 'Closed'];
  const TX_TYPES = ['Credit', 'Debit'];
  const TX_CATEGORIES = [
    'Salary', 'Transfer', 'ATM Withdrawal', 'Online Purchase', 'Bill Payment',
    'Subscription', 'Refund', 'Investment', 'Insurance', 'Loan Repayment',
    'Groceries', 'Restaurant', 'Travel', 'Entertainment', 'Healthcare',
  ];
  const TX_STATUSES = ['Completed', 'Pending', 'Failed', 'Reversed'];
  const KYC_STATUSES = ['Verified', 'Pending', 'Rejected', 'Expired'];
  const CARD_NETWORKS = ['Visa', 'Mastercard', 'American Express', 'Discover'];

  // ── Client ──────────────────────────────────────────────────────────────
  const clientId = f.string.uuid();
  const firstName = f.person.firstName();
  const lastName = f.person.lastName();
  const clientSince = f.date.past({ years: 15 });

  const client = {
    id: clientId,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    dateOfBirth: f.date.birthdate({ min: 18, max: 75, mode: 'age' }),
    gender: f.person.gender(),
    nationalId: f.string.alphanumeric(10).toUpperCase(),
    taxId: `${f.string.numeric(3)}-${f.string.numeric(2)}-${f.string.numeric(4)}`,
    email: f.internet.email({ firstName, lastName }),
    phone: f.phone.number(),
    address: {
      streetAddress: f.location.streetAddress(),
      city: f.location.city(),
      state: f.location.state(),
      country: f.location.country(),
      zipCode: f.location.zipCode(),
    },
    kyc: {
      status: f.helpers.arrayElement(KYC_STATUSES),
      verifiedAt: f.date.past({ years: 3 }),
      documentType: f.helpers.arrayElement(['Passport', 'National ID', "Driver's License"]),
      documentNumber: f.string.alphanumeric(9).toUpperCase(),
      expiresAt: f.date.future({ years: 5 }),
    },
    riskProfile: f.helpers.arrayElement(['Low', 'Medium', 'High']),
    creditScore: f.number.int({ min: 300, max: 850 }),
    clientSince,
    preferredCurrency: f.helpers.arrayElement(CURRENCIES),
    isActive: f.datatype.boolean({ probability: 0.9 }),
  };

  // ── Accounts (1–3 accounts for this client) ──────────────────────────────
  const numAccounts = f.number.int({ min: 1, max: 3 });
  const accounts = [];
  const allTransactions = [];

  for (let a = 0; a < numAccounts; a++) {
    const accountId = f.string.uuid();
    const currency = f.helpers.arrayElement(CURRENCIES);
    const openedAt = f.date.between({ from: clientSince, to: new Date() });
    const initialBalance = f.number.float({ min: 100, max: 500000, fractionDigits: 2 });

    // ── Transactions for this account (3–10) ────────────────────────────
    const numTx = f.number.int({ min: 3, max: 10 });
    const transactions = [];
    let runningBalance = initialBalance;

    for (let t = 0; t < numTx; t++) {
      const txId = f.string.uuid();
      const type = f.helpers.arrayElement(TX_TYPES);
      const amount = f.number.float({ min: 1, max: 15000, fractionDigits: 2 });
      const fee = f.number.float({ min: 0, max: 25, fractionDigits: 2 });
      const txDate = f.date.between({ from: openedAt, to: new Date() });
      const status = f.helpers.weightedArrayElement([
        { weight: 85, value: 'Completed' },
        { weight: 10, value: 'Pending' },
        { weight: 3, value: 'Failed' },
        { weight: 2, value: 'Reversed' },
      ]);

      if (status === 'Completed') {
        runningBalance = type === 'Credit'
          ? runningBalance + amount - fee
          : runningBalance - amount - fee;
      }

      const counterpartyName = f.person.fullName();
      const counterpartyIban = f.finance.iban();

      const tx = {
        id: txId,
        accountId,
        clientId,
        type,
        amount,
        fee,
        netAmount: parseFloat((type === 'Credit' ? amount - fee : amount + fee).toFixed(2)),
        currency,
        status,
        category: f.helpers.arrayElement(TX_CATEGORIES),
        description: f.finance.transactionDescription(),
        reference: `REF-${f.string.alphanumeric(12).toUpperCase()}`,
        channel: f.helpers.arrayElement(['Online', 'ATM', 'Branch', 'Mobile', 'POS', 'Wire']),
        counterparty: {
          name: counterpartyName,
          iban: counterpartyIban,
          bic: f.finance.bic(),
          bank: f.company.name(),
        },
        card: a === 0 ? {
          last4: f.string.numeric(4),
          network: f.helpers.arrayElement(CARD_NETWORKS),
          type: f.helpers.arrayElement(['Debit', 'Credit']),
        } : null,
        location: f.datatype.boolean({ probability: 0.6 }) ? {
          city: f.location.city(),
          country: f.location.country(),
          merchantName: f.company.name(),
          merchantCategory: f.commerce.department(),
        } : null,
        balanceAfter: Math.max(0, parseFloat(runningBalance.toFixed(2))),
        initiatedAt: txDate,
        completedAt: status === 'Completed'
          ? new Date(txDate.getTime() + f.number.int({ min: 0, max: 86400000 }))
          : null,
        metadata: {
          ipAddress: f.internet.ipv4(),
          deviceId: f.string.uuid(),
          userAgent: f.internet.userAgent(),
        },
      };

      transactions.push(tx);
      allTransactions.push(tx);
    }

    const totalCredits = transactions
      .filter(tx => tx.type === 'Credit' && tx.status === 'Completed')
      .reduce((s, tx) => s + tx.amount, 0);
    const totalDebits = transactions
      .filter(tx => tx.type === 'Debit' && tx.status === 'Completed')
      .reduce((s, tx) => s + tx.amount, 0);

    const account = {
      id: accountId,
      clientId,
      accountNumber: f.finance.accountNumber(16),
      iban: f.finance.iban(),
      bic: f.finance.bic(),
      type: f.helpers.arrayElement(ACCOUNT_TYPES),
      status: f.helpers.arrayElement(ACCOUNT_STATUSES),
      currency,
      balance: parseFloat(Math.max(0, runningBalance).toFixed(2)),
      availableBalance: parseFloat(Math.max(0, runningBalance * 0.95).toFixed(2)),
      initialBalance: parseFloat(initialBalance.toFixed(2)),
      interestRate: f.number.float({ min: 0, max: 5, fractionDigits: 2 }),
      overdraftLimit: f.number.int({ min: 0, max: 5000 }),
      bankName: f.company.name(),
      branchCode: f.string.numeric(6),
      openedAt,
      lastActivityAt: transactions.at(-1)?.initiatedAt ?? openedAt,
      cards: f.helpers.multiple(
        () => ({
          id: f.string.uuid(),
          last4: f.string.numeric(4),
          network: f.helpers.arrayElement(CARD_NETWORKS),
          type: f.helpers.arrayElement(['Debit', 'Credit', 'Prepaid']),
          expiresAt: f.date.future({ years: 4 }),
          isActive: f.datatype.boolean({ probability: 0.85 }),
        }),
        { count: { min: 1, max: 2 } }
      ),
      stats: {
        totalTransactions: transactions.length,
        completedTransactions: transactions.filter(tx => tx.status === 'Completed').length,
        totalCredits: parseFloat(totalCredits.toFixed(2)),
        totalDebits: parseFloat(totalDebits.toFixed(2)),
        avgTransactionAmount: parseFloat(
          (transactions.reduce((s, tx) => s + tx.amount, 0) / transactions.length).toFixed(2)
        ),
      },
      transactions,
    };

    accounts.push(account);
  }

  return {
    client,
    accounts,
    summary: {
      totalAccounts: accounts.length,
      totalTransactions: allTransactions.length,
      totalBalance: parseFloat(
        accounts.reduce((s, acc) => s + acc.balance, 0).toFixed(2)
      ),
      currencies: [...new Set(accounts.map(acc => acc.currency))],
      activeAccounts: accounts.filter(acc => acc.status === 'Active').length,
    },
  };
}

// ─── Type map ─────────────────────────────────────────────────────────────────

const GENERATORS = {
  person: generatePerson,
  finance: generateFinance,
  location: generateLocation,
  date: generateDate,
  commerce: generateCommerce,
  internet: generateInternet,
  vehicle: generateVehicle,
  network: generateNetwork,
  company: generateCompany,
  banking: generateBanking,
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate an array of fake records.
 *
 * @param {string} type        - Data type (see SUPPORTED_TYPES)
 * @param {number} count       - Number of records to generate (default 1)
 * @param {object} [options]
 * @param {number} [options.seed]    - Seed for reproducible output
 * @param {string} [options.locale]  - Faker locale (e.g. 'fr', 'de', 'ja')
 * @param {string[]} [options.fields] - Whitelist of fields to include
 * @returns {object[]}
 */
export function generateFullData(type, count = 1, options = {}) {
  if (!SUPPORTED_TYPES.includes(type)) {
    throw new Error(
      `Unsupported data type "${type}". Supported types are: ${SUPPORTED_TYPES.join(', ')}`
    );
  }

  const parsedCount = Number(count);
  if (!Number.isFinite(parsedCount) || parsedCount <= 0) {
    throw new Error('Count must be a positive number.');
  }

  const cappedCount = Math.min(Math.ceil(parsedCount), 1000);
  const { seed, locale, fields } = options;

  // Build the faker instance to use
  let f;
  if (seed != null) {
    const seedNum = Number(seed);
    // Fixed reference date so relative-date helpers (past/future/recent/soon)
    // produce identical results on every call with the same seed.
    const refDate = new Date('2025-01-01T00:00:00.000Z');
    if (locale) {
      f = getFakerForLocale(locale);
    } else {
      // Fresh instance so seeding never pollutes the global faker
      f = new Faker({ locale: [en, base] });
    }
    f.seed(seedNum);
    f.setDefaultRefDate(refDate);
  } else {
    f = getFakerForLocale(locale);
  }

  const generator = GENERATORS[type];
  const data = [];

  for (let i = 0; i < cappedCount; i++) {
    let record = generator(f);

    if (fields && fields.length > 0) {
      record = Object.fromEntries(
        fields.filter((k) => k in record).map((k) => [k, record[k]])
      );
    }

    data.push(record);
  }

  return data;
}
