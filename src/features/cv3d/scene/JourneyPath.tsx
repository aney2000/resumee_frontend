import { Line } from '@react-three/drei';
import { useMemo } from 'react';
import { CatmullRomCurve3, Color, Vector3 } from 'three';
import type { Milestone } from '@/features/cv3d/layout';
import { kindColors } from '@/features/cv3d/layout';

export interface JourneyPathProps {
  readonly milestones: readonly Milestone[];
}

const SEGMENTS_PER_MILESTONE = 16;

/** Smooth curve through the milestones, coloured as a gradient between their kinds. */
export function JourneyPath({ milestones }: JourneyPathProps) {
  const { points, colors } = useMemo(() => {
    const anchors = milestones.map((m) => new Vector3(...m.position));
    const anchorColors = milestones.map((m) => new Color(kindColors[m.entry.kind]));
    const curve = new CatmullRomCurve3(anchors);
    const samples = curve.getPoints((anchors.length - 1) * SEGMENTS_PER_MILESTONE);
    const last = anchorColors.length - 1;
    const sampleColors = samples.map((_, i) => {
      const t = (i / (samples.length - 1)) * last;
      const from = Math.floor(t);
      const to = Math.min(from + 1, last);
      return (
        anchorColors[from]?.clone().lerp(anchorColors[to] ?? anchorColors[from], t - from) ??
        new Color()
      );
    });
    return { points: samples, colors: sampleColors };
  }, [milestones]);

  if (milestones.length < 2) return null;

  return <Line points={points} vertexColors={colors} lineWidth={2} transparent opacity={0.7} />;
}
