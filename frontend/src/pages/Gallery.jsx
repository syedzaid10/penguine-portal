import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Video, Filter, X, Camera, Calendar, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LocationPin from '../components/LocationPin';

export default function Gallery({ isEmbedded = false }) {
  const { t } = useLanguage();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStation, setSelectedStation] = useState('all');
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedType !== 'all') params.set('type', selectedType);
    if (selectedStation !== 'all') params.set('station', selectedStation);
    params.set('status', 'Published');

    fetch(`/api/media?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMedia(data.data);
        }
      })
      .catch((err) => console.warn('Could not fetch media:', err))
      .finally(() => setLoading(false));
  }, [selectedType, selectedStation]);

  const ContainerTag = isEmbedded ? 'section' : 'div';

  return (
    <ContainerTag
      id={isEmbedded ? 'gallery' : undefined}
      className={
        isEmbedded
          ? 'py-20 px-4 sm:px-6 lg:px-8 bg-transparent border-t border-slate-200/40 scroll-mt-16'
          : 'min-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8 text-slate-900'
      }
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header Banner */}
        <div className="card-glacier p-6 sm:p-8 rounded-2xl mb-8 border border-slate-200 shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Curated Expedition Photography & Cinematic Footage</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
              {isEmbedded ? 'Visual Archives & Field Media' : t('navGallery')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-medium">
              Curated photographic and video archives from India's polar expeditions across Maitri, Bharati, Himadri, and IndARC.
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="card-glacier p-3 sm:p-4 rounded-2xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2.5 text-xs">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-700 font-bold">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>Filter Media</span>
            </div>
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-semibold">
              {media.length} Items Available
            </span>
          </div>

          {/* Filter Pills & Select */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Type buttons */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedType === 'all'
                    ? 'bg-white text-blue-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Media
              </button>
              <button
                onClick={() => setSelectedType('photo')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedType === 'photo'
                    ? 'bg-white text-blue-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Photos
              </button>
              <button
                onClick={() => setSelectedType('video')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedType === 'video'
                    ? 'bg-white text-blue-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Videos
              </button>
            </div>

            {/* Station dropdown */}
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-xs"
            >
              <option value="all">All Stations</option>
              <option value="Maitri">Maitri Station</option>
              <option value="Bharati">Bharati Station</option>
              <option value="Himadri">Himadri Base</option>
              <option value="IndARC">IndARC Mooring</option>
              <option value="Dakshin Gangotri">Dakshin Gangotri</option>
            </select>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4, 8].map((i) => (
              <div key={i} className="card-glacier h-64 bg-slate-100"></div>
            ))}
          </div>
        ) : media.length === 0 ? (
          <div className="card-glacier rounded-2xl p-12 text-center max-w-md mx-auto my-12">
            <Camera className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="font-heading font-bold text-slate-900">No media items found</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the station or media type filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {media.map((item) => (
              <div
                key={item._id}
                onClick={() => setActiveItem(item)}
                className="card-glacier overflow-hidden cursor-pointer group hover:border-cyan-400 hover:shadow-[0_8px_25px_rgba(56,189,248,0.22)] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  {item.type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center bg-slate-950 relative overflow-hidden group">
                      <img
                        src={item.thumbnailUrl || '/images/icebreaker-pack-ice.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/icebreaker-pack-ice.jpg';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_16px_rgba(56,189,248,0.6)] group-hover:scale-110 transition-transform">
                          <Video className="w-5 h-5 ml-0.5 fill-current" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.fileUrl}
                      alt={item.title}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/blue-ice-cavern.jpg';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* Station & Type Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-cyan-200 text-[10px] font-mono font-bold inline-flex items-center gap-1 shadow-sm">
                      <LocationPin className="w-3 h-3 text-cyan-400" />
                      <span>{item.station}</span>
                    </span>
                    {item.type === 'video' && (
                      <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[10px] font-mono font-extrabold shadow-sm">
                        VIDEO
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-extrabold text-sm text-slate-900 group-hover:text-cyan-700 transition-colors line-clamp-1 mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed font-medium">
                      {item.caption || item.title}
                    </p>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-sky-100 flex items-center justify-between text-xs font-mono">
                    <span className="truncate max-w-[170px] font-bold text-slate-800">{item.credit}</span>
                    <span className="font-extrabold text-cyan-700 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-300 text-[11px] shadow-xs">{item.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Media Lightbox Modal */}
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85">
            <div className="bg-slate-900 rounded-2xl overflow-hidden relative border border-cyan-500/40 shadow-[0_0_50px_rgba(0,0,0,0.85)] w-full max-w-4xl text-slate-100">
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-800 hover:text-cyan-300 transition-colors shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Media Preview (Left 7-8 Cols) */}
                <div className="lg:col-span-8 bg-black flex items-center justify-center min-h-[320px] max-h-[550px]">
                  {activeItem.type === 'video' ? (
                    <video
                      src={activeItem.fileUrl}
                      poster={activeItem.thumbnailUrl || '/images/icebreaker-pack-ice.jpg'}
                      controls
                      autoPlay
                      className="w-full max-h-[500px] object-contain"
                    />
                  ) : (
                    <img
                      src={activeItem.fileUrl}
                      alt={activeItem.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/blue-ice-cavern.jpg';
                      }}
                      className="w-full max-h-[500px] object-contain"
                    />
                  )}
                </div>

                {/* Details & Metadata (Right 4 Cols) */}
                <div className="lg:col-span-4 p-6 bg-slate-950/95 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-cyan-500/20">
                  <div>
                    <div className="flex items-center space-x-2 text-xs font-mono mb-2">
                      <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold inline-flex items-center gap-1.5 shadow-sm">
                        <LocationPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{activeItem.station}</span>
                      </span>
                      <span className="text-slate-400 font-bold">{activeItem.year}</span>
                    </div>

                    <h2 className="font-heading font-extrabold text-base text-white mb-2 leading-snug">
                      {activeItem.title}
                    </h2>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {activeItem.caption}
                    </p>

                    <div className="space-y-2 text-xs font-mono border-t border-slate-800 pt-3">
                      <div>
                        <span className="text-[10px] text-cyan-400 uppercase block font-bold tracking-wider">Credit</span>
                        <span className="text-slate-200 font-medium">{activeItem.credit}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-cyan-400 uppercase block font-bold tracking-wider">Repository Rights</span>
                        <span className="text-emerald-400 font-bold">Open Access / NCPOR MoES</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between">
                    <a
                      href={activeItem.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-cyan-300 hover:text-cyan-200 flex items-center space-x-1"
                    >
                      <span>Open Full Media</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                    <button
                      onClick={() => setActiveItem(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ContainerTag>
  );
}
