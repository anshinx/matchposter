'use client';

import { TEAMS } from '@/lib/constants';
import type { TeamSlug } from '@/lib/types';

interface TeamLogoProps {
  team: TeamSlug;
  size?: number;
  className?: string;
}

export default function TeamLogo({ team, size = 64, className = '' }: TeamLogoProps) {
  const teamData = TEAMS[team];

  return (
    <img
      src={teamData.logo}
      alt={teamData.name}
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  );
}
