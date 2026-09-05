import { prisma } from './prisma';
import { config } from '../config';
import { MatchScore, MatchingCandidate, MatchingEngineProvider } from '../types';

export class SimpleMatchingEngine implements MatchingEngineProvider {
  async findCandidates(target: MatchingCandidate): Promise<MatchingCandidate[]> {
    const cutoffDate = new Date(Date.now() - config.matching.timeWindowDays * 24 * 60 * 60 * 1000);

    const candidates = await prisma.$queryRaw<
      Array<{
        id: string;
        type: string;
        nature: string;
        description: string;
        regionId: string;
        cercleId: string;
        communeId: string;
        lossDate: Date | null;
        findDate: Date | null;
        objectTypeCode: string;
      }>
    >`
      SELECT 
        d.id, d.type, d.nature, d.description,
        COALESCE(d."lossRegionId", d."findRegionId") as "regionId",
        COALESCE(d."lossCercleId", d."findCercleId") as "cercleId",
        COALESCE(d."lossCommuneId", d."findCommuneId") as "communeId",
        d."lossDate", d."findDate",
        dt."code" as "objectTypeCode"
      FROM "Declaration" d
      JOIN "Type" dt ON d."typeId" = dt.id
      WHERE d.type != ${target.type as unknown as string}
        AND d.nature = ${target.nature as unknown as string}
        AND (d."lossDate" >= ${cutoffDate} OR d."findDate" >= ${cutoffDate})
        AND (d.status = 'SOUMISE' OR d.status = 'EN_ATTENTE_RAPPROCHEMENT' OR d.status = 'CORRESPONDANCE_TROUVEE')
      ORDER BY d."createdAt" DESC
      LIMIT ${config.matching.maxCandidates}
    `;

    return candidates.map((c: any) => ({
      declarationId: c.id,
      type: c.type,
      nature: c.nature,
      description: c.description,
      location: { regionId: c.regionId, cercleId: c.cercleId, communeId: c.communeId },
      declarationDate: c.lossDate ?? c.findDate,
      objectType: c.objectTypeCode,
      daysDifference: this.calculateDaysDiff(target.declarationDate, c.lossDate ?? c.findDate),
      distance: null,
    }));
  }

  async computeScore(target: MatchingCandidate, candidate: MatchingCandidate): Promise<MatchScore> {
    const breakdown: Record<string, { score: number; weight: number; detail: string }> = {};
    let totalScore = 0;
    const determiningCriteria: string[] = [];

    const WEIGHTS = { description: 15, location: 5, date: 5 };
    const MAX_POSSIBLE = 25;

    const descScore = this.textSimilarity(target.description, candidate.description);
    breakdown.description = {
      score: descScore * WEIGHTS.description,
      weight: WEIGHTS.description,
      detail: 'Text similarity of descriptions',
    };
    totalScore += breakdown.description.score;

    const locScore = target.distance !== null && target.distance !== undefined ? Math.max(0, 1 - target.distance / 50) : 0.5;
    breakdown.location = {
      score: locScore * WEIGHTS.location,
      weight: WEIGHTS.location,
      detail: `Distance: ${target.distance ?? 'unknown'} km`,
    };
    totalScore += breakdown.location.score;

    const dayDiff = target.daysDifference ?? 9999;
    const dateScore = dayDiff < 30 ? 1 : dayDiff < 90 ? 0.7 : dayDiff < 180 ? 0.4 : 0.1;
    breakdown.date = {
      score: dateScore * WEIGHTS.date,
      weight: WEIGHTS.date,
      detail: `Days difference: ${dayDiff}`,
    };
    totalScore += breakdown.date.score;

    if (descScore > 0.8) determiningCriteria.push('description');
    if (target.distance !== null && target.distance !== undefined && target.distance < 10) determiningCriteria.push('location');
    if (dayDiff < 30) determiningCriteria.push('date');

    const finalScore = totalScore > 0 ? Math.round((totalScore / MAX_POSSIBLE) * 100) : 0;

    return {
      score: finalScore,
      breakdown,
      determiningCriteria,
    };
  }

  private textSimilarity(a: string, b: string): number {
    const normalize = (s: string) => s.toLowerCase().replace(/[^\w\s]/g, '').trim();
    const aNorm = normalize(a);
    const bNorm = normalize(b);
    if (aNorm === bNorm) return 1;
    if (aNorm.length === 0 || bNorm.length === 0) return 0;

    const aWords = aNorm.split(/\s+/);
    const bWords = bNorm.split(/\s+/);
    const aSet = new Set(aWords);
    const bSet = new Set(bWords);
    let intersection = 0;
    for (const w of aSet) if (bSet.has(w)) intersection++;
    const union = aSet.size + bSet.size - intersection;
    return union > 0 ? intersection / union : 0;
  }

  private calculateDaysDiff(targetDate: Date | null, candidateDate: Date | null): number | null {
    if (!targetDate || !candidateDate) return null;
    const diff = Math.abs(targetDate.getTime() - candidateDate.getTime());
    return Math.round(diff / (24 * 60 * 60 * 1000));
  }
}

export function getMatchingEngine(): MatchingEngineProvider {
  return new SimpleMatchingEngine();
}
