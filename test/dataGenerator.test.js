// test/dataGenerator.test.js
import { generateFullData, SUPPORTED_TYPES } from '../src/dataGenerator.js';

describe('generateFullData', () => {
  // ── Core ─────────────────────────────────────────────────────────────────

  it('exports SUPPORTED_TYPES', () => {
    expect(Array.isArray(SUPPORTED_TYPES)).toBe(true);
    expect(SUPPORTED_TYPES.length).toBeGreaterThan(0);
  });

  it('generates a single record by default', () => {
    const data = generateFullData('person');
    expect(data).toHaveLength(1);
  });

  it('generates the requested number of records', () => {
    const data = generateFullData('person', 5);
    expect(data).toHaveLength(5);
  });

  it('throws for unsupported types', () => {
    expect(() => generateFullData('unsupported', 1)).toThrow('Unsupported data type');
  });

  it('throws for non-positive count', () => {
    expect(() => generateFullData('person', -1)).toThrow('positive number');
    expect(() => generateFullData('person', 0)).toThrow('positive number');
  });

  // ── person ────────────────────────────────────────────────────────────────

  describe('person', () => {
    let record;
    beforeAll(() => { record = generateFullData('person', 1)[0]; });

    it.each(['id', 'firstName', 'lastName', 'fullName', 'email', 'phone', 'username'])(
      'has field "%s"', (field) => { expect(record).toHaveProperty(field); }
    );

    it('has a nested address object', () => {
      expect(record.address).toHaveProperty('city');
      expect(record.address).toHaveProperty('country');
    });

    it('has socialMedia links', () => {
      expect(record.socialMedia).toHaveProperty('twitter');
      expect(record.socialMedia).toHaveProperty('linkedin');
    });
  });

  // ── finance ───────────────────────────────────────────────────────────────

  describe('finance', () => {
    let record;
    beforeAll(() => { record = generateFullData('finance', 1)[0]; });

    it.each(['accountNumber', 'iban', 'bic', 'bitcoinAddress', 'ethereumAddress'])(
      'has field "%s"', (field) => { expect(record).toHaveProperty(field); }
    );

    it('has creditCard object', () => {
      expect(record.creditCard).toHaveProperty('number');
      expect(record.creditCard).toHaveProperty('cvv');
    });
  });

  // ── location ──────────────────────────────────────────────────────────────

  describe('location', () => {
    let record;
    beforeAll(() => { record = generateFullData('location', 1)[0]; });

    it.each(['streetAddress', 'city', 'country', 'latitude', 'longitude', 'timezone'])(
      'has field "%s"', (field) => { expect(record).toHaveProperty(field); }
    );

    it('has coordinates object', () => {
      expect(record.coordinates).toHaveProperty('lat');
      expect(record.coordinates).toHaveProperty('lon');
    });
  });

  // ── commerce ──────────────────────────────────────────────────────────────

  describe('commerce', () => {
    let record;
    beforeAll(() => { record = generateFullData('commerce', 1)[0]; });

    it.each(['sku', 'productName', 'price', 'originalPrice', 'discountPercent', 'rating'])(
      'has field "%s"', (field) => { expect(record).toHaveProperty(field); }
    );

    it('has images array', () => {
      expect(Array.isArray(record.images)).toBe(true);
      expect(record.images.length).toBeGreaterThan(0);
    });
  });

  // ── internet ──────────────────────────────────────────────────────────────

  describe('internet', () => {
    let record;
    beforeAll(() => { record = generateFullData('internet', 1)[0]; });

    it.each(['email', 'username', 'ipv4', 'ipv6', 'mac', 'userAgent', 'apiKey'])(
      'has field "%s"', (field) => { expect(record).toHaveProperty(field); }
    );
  });

  // ── vehicle ───────────────────────────────────────────────────────────────

  describe('vehicle', () => {
    let record;
    beforeAll(() => { record = generateFullData('vehicle', 1)[0]; });

    it.each(['vin', 'make', 'model', 'year', 'fuel', 'mileage', 'licensePlate'])(
      'has field "%s"', (field) => { expect(record).toHaveProperty(field); }
    );

    it('has features array', () => {
      expect(Array.isArray(record.features)).toBe(true);
    });
  });

  // ── network ───────────────────────────────────────────────────────────────

  describe('network', () => {
    let record;
    beforeAll(() => { record = generateFullData('network', 1)[0]; });

    it.each(['ipv4', 'ipv6', 'mac', 'protocol', 'httpMethod', 'statusCode'])(
      'has field "%s"', (field) => { expect(record).toHaveProperty(field); }
    );
  });

  // ── company ───────────────────────────────────────────────────────────────

  describe('company', () => {
    let record;
    beforeAll(() => { record = generateFullData('company', 1)[0]; });

    it.each(['name', 'legalName', 'industry', 'website', 'ceo', 'founded'])(
      'has field "%s"', (field) => { expect(record).toHaveProperty(field); }
    );
  });

  // ── banking ───────────────────────────────────────────────────────────────

  describe('banking', () => {
    let record;
    beforeAll(() => { record = generateFullData('banking', 1)[0]; });

    it('has a client object with personal info', () => {
      expect(record.client).toHaveProperty('id');
      expect(record.client).toHaveProperty('firstName');
      expect(record.client).toHaveProperty('lastName');
      expect(record.client).toHaveProperty('email');
      expect(record.client).toHaveProperty('taxId');
      expect(record.client).toHaveProperty('creditScore');
    });

    it('has a kyc sub-object on the client', () => {
      expect(record.client.kyc).toHaveProperty('status');
      expect(record.client.kyc).toHaveProperty('documentType');
      expect(record.client.kyc).toHaveProperty('documentNumber');
    });

    it('has at least one account', () => {
      expect(Array.isArray(record.accounts)).toBe(true);
      expect(record.accounts.length).toBeGreaterThanOrEqual(1);
    });

    it('each account is linked to the client via clientId', () => {
      for (const acc of record.accounts) {
        expect(acc.clientId).toBe(record.client.id);
        expect(acc).toHaveProperty('iban');
        expect(acc).toHaveProperty('balance');
        expect(acc).toHaveProperty('currency');
        expect(Array.isArray(acc.cards)).toBe(true);
        expect(Array.isArray(acc.transactions)).toBe(true);
      }
    });

    it('each transaction is linked to its account and the client', () => {
      for (const acc of record.accounts) {
        for (const tx of acc.transactions) {
          expect(tx.accountId).toBe(acc.id);
          expect(tx.clientId).toBe(record.client.id);
          expect(tx).toHaveProperty('type');
          expect(tx).toHaveProperty('amount');
          expect(tx).toHaveProperty('currency');
          expect(tx).toHaveProperty('status');
          expect(tx).toHaveProperty('counterparty');
          expect(tx.counterparty).toHaveProperty('iban');
        }
      }
    });

    it('has a summary with aggregate figures', () => {
      expect(record.summary).toHaveProperty('totalAccounts');
      expect(record.summary).toHaveProperty('totalTransactions');
      expect(record.summary).toHaveProperty('totalBalance');
      expect(record.summary.totalAccounts).toBe(record.accounts.length);
    });

    it('generates multiple independent banking records', () => {
      const records = generateFullData('banking', 3);
      expect(records).toHaveLength(3);
      const ids = records.map(r => r.client.id);
      expect(new Set(ids).size).toBe(3);
    });
  });

  // ── Seed support ──────────────────────────────────────────────────────────

  describe('seed', () => {
    it('produces identical results for the same seed', () => {
      const a = generateFullData('person', 3, { seed: 42 });
      const b = generateFullData('person', 3, { seed: 42 });
      expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    });

    it('produces different results for different seeds', () => {
      const a = generateFullData('person', 1, { seed: 1 });
      const b = generateFullData('person', 1, { seed: 2 });
      expect(JSON.stringify(a)).not.toBe(JSON.stringify(b));
    });
  });

  // ── Field filtering ───────────────────────────────────────────────────────

  describe('fields filter', () => {
    it('returns only requested fields', () => {
      const data = generateFullData('person', 2, { fields: ['firstName', 'email'] });
      for (const record of data) {
        expect(Object.keys(record)).toEqual(expect.arrayContaining(['firstName', 'email']));
        expect(Object.keys(record)).not.toContain('phone');
        expect(Object.keys(record)).not.toContain('address');
      }
    });

    it('ignores non-existent fields gracefully', () => {
      const data = generateFullData('person', 1, { fields: ['firstName', 'nonExistentField'] });
      expect(data[0]).toHaveProperty('firstName');
      expect(data[0]).not.toHaveProperty('nonExistentField');
    });
  });

  // ── All types smoke test ──────────────────────────────────────────────────

  describe('all types', () => {
    it.each(SUPPORTED_TYPES)('generates records for type "%s"', (type) => {
      const data = generateFullData(type, 2);
      expect(data).toHaveLength(2);
      expect(typeof data[0]).toBe('object');
    });
  });
});
