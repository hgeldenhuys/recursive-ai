import { describe, expect, it } from 'bun:test';
import { suggestDimension, suggestDomain } from './dimensions';

describe('suggestDimension', () => {
  it('identifies epistemology (patterns)', () => {
    expect(suggestDimension('Use the factory pattern for creating services')).toBe('epistemology');
    expect(suggestDimension('Architecture decision: separate modules by domain')).toBe(
      'epistemology'
    );
  });

  it('identifies qualia (pain points)', () => {
    expect(suggestDimension('Gotcha: SQLite silently truncates long strings')).toBe('qualia');
    expect(suggestDimension('Unexpected edge case with null values')).toBe('qualia');
    expect(suggestDimension('Pitfall: async functions swallow errors')).toBe('qualia');
  });

  it('identifies praxeology (best practices)', () => {
    expect(suggestDimension('Best practice: always validate input at boundaries')).toBe(
      'praxeology'
    );
    expect(suggestDimension('Convention: prefer named exports over default')).toBe('praxeology');
    expect(suggestDimension('Always run tests before committing')).toBe('praxeology');
  });

  it('defaults to praxeology for ambiguous text', () => {
    expect(suggestDimension('Something happened during the build')).toBe('praxeology');
  });
});

describe('suggestDomain', () => {
  it('identifies frontend domain', () => {
    expect(suggestDomain('React component rendering is slow')).toBe('frontend');
    expect(suggestDomain('CSS styles need mobile-first approach')).toBe('frontend');
  });

  it('identifies backend domain', () => {
    expect(suggestDomain('API endpoint returns 404 for valid IDs')).toBe('backend');
    expect(suggestDomain('Database query takes too long')).toBe('backend');
  });

  it('identifies testing domain', () => {
    expect(suggestDomain('Unit test coverage is low for auth module')).toBe('testing');
    expect(suggestDomain('Mock setup is complex for integration tests')).toBe('testing');
  });

  it('identifies security domain', () => {
    expect(suggestDomain('JWT token validation needs improvement')).toBe('security');
    expect(suggestDomain('OAuth flow has CSRF vulnerability')).toBe('security');
  });
});
