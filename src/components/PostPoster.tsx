'use client';

import { forwardRef, useState, useEffect } from 'react';
import type { Match, CafeSettings } from '@/lib/types';
import { TEAMS } from '@/lib/constants';
import { getTurkishDayName, getLeagueHeaderTitle, formatPhoneNumber } from '@/lib/utils';

interface PostPosterProps {
  match: Match;
  cafeSettings: CafeSettings;
}

// Default horse cafe logo badge SVG when no custom logo is uploaded
const DefaultCafeLogo = () => (
  <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M100 10 L180 50 L180 140 L100 190 L20 140 L20 50 Z"
      fill="#0d0d12"
      stroke="#FFE145"
      strokeWidth="6"
    />
    <path d="M40 45 C70 30 130 30 160 45 C150 65 50 65 40 45 Z" fill="#E11D48" stroke="#FFFFFF" strokeWidth="3" />
    <text x="100" y="52" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900" fontFamily="'Montserrat', sans-serif">
      AT KAFASI
    </text>
    <g transform="translate(45, 60) scale(0.55)">
      <path d="M30 40 Q 90 10 150 40 L 170 50 Q 90 25 10 50 Z" fill="#E11D48" stroke="#000" strokeWidth="4" />
      <path d="M40 38 Q 90 5 140 38 Z" fill="#E11D48" stroke="#000" strokeWidth="4" />
      <path
        d="M50 45 Q 120 40 140 70 L 145 130 Q 140 160 110 160 L 50 160 Q 30 140 40 100 Z"
        fill="#8B4513"
        stroke="#000"
        strokeWidth="6"
      />
      <path d="M50 120 L 110 120 L 110 160 L 50 160 Z" fill="#111111" stroke="#000" strokeWidth="4" />
      <circle cx="105" cy="85" r="8" fill="#FFFFFF" stroke="#000" strokeWidth="3" />
      <circle cx="107" cy="85" r="4" fill="#000000" />
      <ellipse cx="75" cy="140" rx="5" ry="8" fill="#333333" />
    </g>
  </svg>
);

function resolveAwayLogo(match: Match): string | undefined {
  if (match.awayTeamLogo) return match.awayTeamLogo;
  const lower = match.awayTeam.toLowerCase();
  if (lower.includes('fenerbah')) return '/teams/fenerbahce.png';
  if (lower.includes('galatasaray')) return '/teams/galatasaray.png';
  if (lower.includes('beşiktaş') || lower.includes('besiktas')) return '/teams/besiktas.png';
  if (lower.includes('trabzon')) return '/teams/trabzonspor.png';
  return undefined;
}

const PostPoster = forwardRef<HTMLDivElement, PostPosterProps>(
  ({ match, cafeSettings }, ref) => {
    const homeTeam = TEAMS[match.homeTeam];
    const dayName = getTurkishDayName(match.date);
    const bgUrl = cafeSettings.customBackground || cafeSettings.selectedBackground || '/stadium_bg.png';
    const leagueTitle = getLeagueHeaderTitle(match.league);
    const awayLogo = resolveAwayLogo(match);

    const [imgFailed, setImgFailed] = useState(false);

    useEffect(() => {
      setImgFailed(false);
    }, [match.id, match.awayTeamLogo]);

    let cafeHeader = cafeSettings.cafeName ? cafeSettings.cafeName.toUpperCase() : "AT KAFASI CAFE";
    if (!cafeHeader.endsWith("'DE") && !cafeHeader.endsWith("DE") && !cafeHeader.endsWith("'DA") && !cafeHeader.endsWith("DA")) {
      cafeHeader = `${cafeHeader}'DE`;
    }

    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1080,
          position: 'relative',
          overflow: 'hidden',
          fontFamily: "'Montserrat', 'Oswald', sans-serif",
          color: '#ffffff',
          backgroundColor: '#050508',
        }}
      >
        {/* Background Image */}
        <img
          src={bgUrl}
          alt="Stadium Background"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />

        {/* Stadium lighting flare */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 1000,
            height: 600,
            background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.35) 0%, rgba(255,230,150,0.15) 30%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Dark Vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.75) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Poster Content */}
        <div
          style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '48px 40px 52px',
            boxSizing: 'border-box',
          }}
        >
          {/* Header & Date */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 44,
                fontWeight: 900,
                fontStyle: 'italic',
                color: '#FFE145',
                textTransform: 'uppercase',
                lineHeight: 1.1,
                letterSpacing: 2,
                WebkitTextStroke: '2px #000000',
                textShadow: '3px 3px 0 #000, -3px -3px 0 #000, 3px 3px 0 #000, -3px 3px 0 #000, 0 6px 12px rgba(0,0,0,0.9)',
                marginBottom: 10,
              }}
            >
              {leagueTitle} {cafeHeader}
            </div>

            <div
              style={{
                fontSize: 48,
                fontWeight: 900,
                fontStyle: 'italic',
                color: '#FFE145',
                lineHeight: 1.1,
                WebkitTextStroke: '2px #000000',
                textShadow: '2px 2px 0 #000, -2px -2px 0 #000',
              }}
            >
              {dayName} {match.time}
            </div>
          </div>

          {/* Center Logos Overlapping */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              margin: '5px 0',
              position: 'relative',
            }}
          >
            {/* Home Team */}
            <div
              style={{
                width: 320,
                height: 320,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.95))',
                zIndex: 2,
                flexShrink: 0,
              }}
            >
              <img
                src={homeTeam.logo}
                alt={homeTeam.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* Cafe Logo */}
            <div
              style={{
                width: 160,
                height: 160,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.9))',
                zIndex: 3,
                margin: '0 -35px',
                flexShrink: 0,
              }}
            >
              {cafeSettings.logo ? (
                <img
                  src={cafeSettings.logo}
                  alt={cafeSettings.cafeName}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 16 }}
                />
              ) : (
                <DefaultCafeLogo />
              )}
            </div>

            {/* Away Team */}
            <div
              style={{
                width: 320,
                height: 320,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.95))',
                zIndex: 2,
                flexShrink: 0,
              }}
            >
              {awayLogo && !imgFailed ? (
                <img
                  src={awayLogo}
                  alt={match.awayTeam}
                  onError={() => setImgFailed(true)}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 250,
                    height: 250,
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.85)',
                    border: '6px solid #FFE145',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 70,
                    fontWeight: 900,
                    color: '#FFE145',
                  }}
                >
                  {match.awayTeam.substring(0, 3)}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              gap: 14,
            }}
          >
            <div
              style={{
                backgroundColor: '#000000',
                padding: '12px 36px',
                borderRadius: 8,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: '#FFE145',
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                  lineHeight: 1.2,
                }}
              >
                REZERVASYON YAPTIRMAYI UNUTMAYIN
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 64,
                  border: '3px solid #00E5FF',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 12px rgba(0, 229, 255, 0.45)',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                }}
              >
                <svg width="22" height="32" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="32" rx="4" stroke="#00E5FF" strokeWidth="2.5" />
                  <circle cx="12" cy="28" r="1.8" fill="#00E5FF" />
                </svg>
              </div>

              <div
                style={{
                  backgroundColor: '#000000',
                  border: '2px solid #FFE145',
                  borderRadius: 8,
                  padding: '10px 32px',
                }}
              >
                <span
                  style={{
                    fontSize: 34,
                    fontWeight: 900,
                    color: '#FFE145',
                    letterSpacing: 2,
                  }}
                >
                  {formatPhoneNumber(cafeSettings.phone)}
                </span>
              </div>

              {/* Instagram Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: '#000000',
                  border: '2px solid #FFE145',
                  borderRadius: 8,
                  padding: '8px 20px',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFE145" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: '#FFE145',
                    letterSpacing: 1,
                  }}
                >
                  {cafeSettings.instagramHandle || '@atkafasicafe'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PostPoster.displayName = 'PostPoster';
export default PostPoster;
