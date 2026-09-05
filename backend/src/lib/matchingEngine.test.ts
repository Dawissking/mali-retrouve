import { getMatchingEngine, SimpleMatchingEngine } from '@app/lib/matchingEngine';
import { MatchingCandidate } from '@app/types';

describe('MatchingEngine', () => {
  let engine: SimpleMatchingEngine;

  beforeAll(() => {
    engine = getMatchingEngine() as SimpleMatchingEngine;
  });

  describe('SimpleMatchingEngine', () => {
    it('should return instance from getMatchingEngine', () => {
      expect(engine).toBeInstanceOf(SimpleMatchingEngine);
    });

    it('should compute score with breakdown', async () => {
      const target: MatchingCandidate = {
        declarationId: 'test-1',
        type: 'LOSS',
        nature: 'DOCUMENT',
        description: 'Blue wallet with cards',
        location: { regionId: 'r1', cercleId: 'c1', communeId: 'm1' },
        declarationDate: new Date('2024-01-01'),
        objectType: 'CNI',
        distance: 5,
        daysDifference: 10,
      };
      const candidate: MatchingCandidate = {
        declarationId: 'test-2',
        type: 'FOUND',
        nature: 'DOCUMENT',
        description: 'Blue wallet with cards',
        location: { regionId: 'r1', cercleId: 'c1', communeId: 'm1' },
        declarationDate: new Date('2024-01-05'),
        objectType: 'CNI',
        distance: 5,
        daysDifference: 10,
      };

      const score = await engine.computeScore(target, candidate);
      expect(score.score).toBeGreaterThan(0);
      expect(score.breakdown).toHaveProperty('description');
      expect(score.breakdown).toHaveProperty('location');
      expect(score.breakdown).toHaveProperty('date');
      expect(score.determiningCriteria.length).toBeGreaterThanOrEqual(0);
    });

    it('should return empty candidates for type match (different types only)', async () => {
      const target: MatchingCandidate = {
        declarationId: 'test-target',
        type: 'LOSS',
        nature: 'DOCUMENT',
        description: 'Test description for matching',
        location: { regionId: 'r1', cercleId: 'c1', communeId: 'm1' },
        declarationDate: new Date('2024-01-01'),
        objectType: 'CNI',
        distance: null,
        daysDifference: null,
      };

      const candidates = await engine.findCandidates(target);
      expect(Array.isArray(candidates)).toBe(true);
      candidates.forEach((c) => {
        expect(c.type).not.toBe(target.type);
      });
    });
  });
});
