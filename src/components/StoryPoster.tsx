'use client';

import { forwardRef, useState, useEffect } from 'react';
import type { Match, CafeSettings } from '@/lib/types';
import { TEAMS } from '@/lib/constants';
import { getTurkishDayName, getLeagueHeaderTitle, formatPhoneNumber } from '@/lib/utils';

interface StoryPosterProps {
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

const StoryPoster = forwardRef<HTMLDivElement, StoryPosterProps>(
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
          height: 1920,
          position: 'relative',
          overflow: 'hidden',
          fontFamily: "'Montserrat', 'Oswald', sans-serif",
          color: '#ffffff',
          backgroundColor: '#050508',
        }}
      >
        {/* Background Image & Gradients */}
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

        {/* Stadium lighting spotlight flare beam */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 1200,
            height: 900,
            background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.35) 0%, rgba(255,230,150,0.15) 30%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Dark gradient vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.75) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Poster Content Container */}
        <div
          style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '90px 48px 100px',
            boxSizing: 'border-box',
          }}
        >
          {/* Top Header & Match Time Section */}
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
                fontSize: 66,
                fontWeight: 900,
                fontStyle: 'italic',
                color: '#FFE145',
                textTransform: 'uppercase',
                lineHeight: 1.12,
                letterSpacing: 2,
                WebkitTextStroke: '3px #000000',
                textShadow:
                  '4px 4px 0 #000, -4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 0 8px 20px rgba(0,0,0,0.95)',
                marginBottom: 45,
              }}
            >
              <div>{leagueTitle}</div>
              <div>{cafeHeader}</div>
            </div>

            <div
              style={{
                fontSize: 78,
                fontWeight: 900,
                fontStyle: 'italic',
                color: '#FFE145',
                lineHeight: 1.15,
                WebkitTextStroke: '3px #000000',
                textShadow:
                  '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 0 6px 16px rgba(0,0,0,0.9)',
              }}
            >
              <div>{dayName}</div>
              <div style={{ fontSize: 90, marginTop: 4 }}>{match.time}</div>
            </div>
          </div>

          {/* Center Section: 3 Logos Inline Overlapping */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              margin: '10px 0',
              position: 'relative',
            }}
          >
            {/* Left: Home Team Badge */}
            <div
              style={{
                width: 380,
                height: 380,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 20px 35px rgba(0,0,0,0.95))',
                zIndex: 2,
                transform: 'scale(2.2)',
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

            {/* Middle: Cafe Logo */}
            <div
              style={{
                width: 200,
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.9))',
                zIndex: 3,
                margin: '0 50px',
                flexShrink: 0,
              }}
            >
              {cafeSettings.logo ? (
                <img
                  src={cafeSettings.logo}
                  alt={cafeSettings.cafeName}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: 20,
                  }}
                />
              ) : (
                <DefaultCafeLogo />
              )}
            </div>

            {/* Right: Away Team Badge */}
            <div
              style={{
                width: 380,
                height: 380,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 20px 35px rgba(0,0,0,0.95))',
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
                    transform: 'scale(2.2)',

                  }}
                />
              ) : (
                <div
                  style={{
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.85)',
                    border: '6px solid #FFE145',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 80,
                    fontWeight: 900,
                    color: '#FFE145',
                    textTransform: 'uppercase',
                  }}
                >
                  {match.awayTeam.substring(0, 3)}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section: Reservation & Phone Banner */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              gap: 22,
            }}
          >
            {/* Reservation Notice Box */}
            <div
              style={{
                backgroundColor: '#000000',
                padding: '18px 48px',
                borderRadius: 8,
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
              }}
            >
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 900,
                  color: '#FFE145',
                  textTransform: 'uppercase',
                  letterSpacing: 2.5,
                  lineHeight: 1.25,
                }}
              >
                <div>REZERVASYON YAPTIRMAYI</div>
                <div>UNUTMAYIN</div>
              </div>
            </div>

            {/* Phone Number Box & Icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 22,
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 90,
                  border: '4px solid #00E5FF',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 18px rgba(0, 229, 255, 0.45)',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                }}
              >
                <svg width="28" height="42" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="32" rx="4" stroke="#00E5FF" strokeWidth="2.5" />
                  <circle cx="12" cy="28" r="1.8" fill="#00E5FF" />
                  <line x1="8" y1="6" x2="16" y2="6" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              <div
                style={{
                  backgroundColor: '#000000',
                  border: '3px solid #FFE145',
                  borderRadius: 8,
                  padding: '14px 44px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
                }}
              >
                <span
                  style={{
                    fontSize: 48,
                    fontWeight: 900,
                    color: '#FFE145',
                    letterSpacing: 3,
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  {formatPhoneNumber(cafeSettings.phone)}
                </span>
              </div>
            </div>

            {/* Instagram Badge */}
            {(cafeSettings.instagramHandle || true) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  backgroundColor: '#000000',
                  border: '2px solid #FFE145',
                  borderRadius: 8,
                  padding: '8px 28px',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.8)',
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFE145" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span
                  style={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: '#FFE145',
                    letterSpacing: 1.5,
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  {cafeSettings.instagramHandle || '@atkafasicafe'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

StoryPoster.displayName = 'StoryPoster';
export default StoryPoster;
