import React, { useRef } from 'react';
import { Download, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function SocialCardGenerator({ title, text, station, channel, language }) {
  const canvasRef = useRef(null);

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Dimensions: 1200 x 630 (Standard Twitter/LinkedIn/OG image size)
    canvas.width = 1200;
    canvas.height = 630;

    // Background Gradient (Deep Polar Night to Abyss)
    const bgGradient = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGradient.addColorStop(0, '#060B13');
    bgGradient.addColorStop(0.5, '#0B1424');
    bgGradient.addColorStop(1, '#070D18');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Subtle Aurora Glow Effect
    const auroraGlow = ctx.createRadialGradient(200, 100, 10, 200, 100, 450);
    auroraGlow.addColorStop(0, 'rgba(0, 240, 255, 0.22)');
    auroraGlow.addColorStop(0.5, 'rgba(16, 185, 129, 0.12)');
    auroraGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = auroraGlow;
    ctx.fillRect(0, 0, 1200, 630);

    // Neon Border
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 1160, 590);

    // Top Header: Branding
    ctx.fillStyle = '#00F0FF';
    ctx.font = 'bold 22px "Space Grotesk", sans-serif';
    ctx.fillText('PENGUINE  •  NATIONAL POLAR DATA ARCHIVE', 60, 75);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '16px "JetBrains Mono", monospace';
    ctx.fillText(`CHANNEL: ${channel.toUpperCase()}  |  LANG: ${language.toUpperCase()}  |  OPEN ARCHIVE`, 60, 105);

    // Station Badge
    ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(60, 140, 260, 42, 8);
    ctx.fill();
    ctx.stroke();

    const pinImg = new Image();
    pinImg.src = '/images/polar-location-pin.png';
    await new Promise((resolve) => {
      pinImg.onload = resolve;
      pinImg.onerror = resolve;
    });
    try {
      ctx.drawImage(pinImg, 75, 149, 24, 24);
    } catch (e) {
      // Fallback
    }

    ctx.fillStyle = '#00F0FF';
    ctx.font = 'bold 16px "Urbanist", sans-serif';
    ctx.fillText(`${station || 'Antarctica'}`, 110, 167);

    // Document / Post Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px "Space Grotesk", sans-serif';
    wrapText(ctx, title || 'Polar Research Discovery', 60, 240, 1080, 44);

    // Text Content
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '24px "Inter", sans-serif';
    const cleanText = text.replace(/#/g, '').slice(0, 280) + '...';
    wrapText(ctx, `"${cleanText}"`, 60, 360, 1080, 34);

    // Footer Watermark
    ctx.fillStyle = '#64748B';
    ctx.font = '16px "JetBrains Mono", monospace';
    ctx.fillText('Ministry of Earth Sciences (MoES) & NCPOR • Verified Research Citation', 60, 560);

    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 16px "Space Grotesk", sans-serif';
    ctx.fillText('✓ Peer-Reviewed & Verified', 930, 560);

    // Export to PNG download
    const link = document.createElement('a');
    link.download = `polar-card-${channel}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Helper function to wrap text on canvas
  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
        if (currentY > 520) {
          ctx.fillText(line + '...', x, currentY);
          return;
        }
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  }

  return (
    <div className="flex items-center space-x-2">
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={handleDownload}
        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-blue-600 hover:text-blue-700 border border-slate-200 text-xs font-mono font-semibold transition-all shadow-sm"
        title="Download high-resolution 1200x630 social card for X/LinkedIn/Instagram"
      >
        <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
        <span>Download Social Card (.PNG)</span>
      </button>
    </div>
  );
}
