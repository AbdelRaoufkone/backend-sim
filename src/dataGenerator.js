import { faker } from '@faker-js/faker';

export function generateFullData(type, count = 1) {
  const supportedTypes = ['person', 'finance', 'location', 'date', 'commerce'];

  if (!supportedTypes.includes(type)) {
    throw new Error(`Unsupported data type. Supported types are: ${supportedTypes.join(', ')}`);
  }

  if (typeof count !== 'number' || count <= 0) {
    throw new Error('Count must be a positive number.');
  }
  const data = [];

  // Fonction pour générer des données personnelles
  const generatePerson = () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    gender: faker.person.gender(),
    jobTitle: faker.person.jobTitle(),
    bio: faker.lorem.paragraph(),
    avatar: faker.image.avatar(),
    birthdate: faker.date.birthdate(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    username: faker.internet.username(),
    password: faker.internet.password(),
    nationality: faker.location.country(),
    address: {
      streetAddress: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
    },
    socialMedia: {
      twitter: faker.internet.username(),
      facebook: faker.internet.username(),
      linkedin: faker.internet.username(),
    },
    dateOfBirth: faker.date.between({ from: '1900-01-01T00:00:00.000Z', to: '2002-01-01T00:00:00.000Z' }),
  });

  // Fonction pour générer des données financières
  const generateFinance = () => ({
    accountNumber: faker.finance.accountNumber(),
    amount: faker.finance.amount(),
    currency: faker.finance.currencyCode(),
    creditCard: {
      number: faker.finance.creditCardNumber(),
      type: faker.finance.creditCardIssuer(),
      expirationDate: faker.date.future(),
    },
    transactionDescription: faker.finance.transactionDescription(),
    iban: faker.finance.iban(),
    bic: faker.finance.bic(),
    bitcoinAddress: faker.finance.bitcoinAddress(),
    ethereumAddress: faker.finance.ethereumAddress(),
    accountName: faker.finance.accountName(),
    transactionDate: faker.date.recent(),
    bankName: faker.company.name(),
  });

  // Fonction pour générer des données de localisation
  const generateLocation = () => ({
    streetAddress: faker.location.streetAddress(),
    city: faker.location.city(),
    county: faker.location.county(),
    state: faker.location.state(),
    country: faker.location.country(),
    zipCode: faker.location.zipCode(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    timezone: faker.location.timeZone(),
  });

  // Fonction pour générer des données temporelles
  const generateDate = () => ({
    pastDate: faker.date.past(),
    futureDate: faker.date.future(),
    recentDate: faker.date.recent(),
    soonDate: faker.date.soon(),
    birthday: faker.date.birthdate(),
    dateOfBirth: faker.date.between({ from: '1900-01-01T00:00:00.000Z', to: '2002-01-01T00:00:00.000Z' }),
  });

  // Fonction pour générer des données commerciales
  const generateCommerce = () => ({
    productName: faker.commerce.productName(),
    productDescription: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    productMaterial: faker.commerce.productMaterial(),
    color: faker.color.rgb(),
    productAdjective: faker.commerce.productAdjective(),
    productCategory: faker.commerce.department(),
    stockQuantity: faker.datatype.number({ min: 0, max: 100 }),
    manufacturer: faker.company.name(),
  });

  // Générer des données en fonction du type
  for (let i = 0; i < count; i++) {
    switch (type) {
      case 'person':
        data.push(generatePerson());
        break;
      case 'finance':
        data.push(generateFinance());
        break;
      case 'location':
        data.push(generateLocation());
        break;
      case 'date':
        data.push(generateDate());
        break;
      case 'commerce':
        data.push(generateCommerce());
        break;
      default:
        throw new Error('Unsupported data type');
    }
  }

  return data;
}
