import React, { useState, useEffect } from 'react';
import { Newspaper, Calendar, User, Tag, ArrowRight, X, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function News({ isEmbedded = false }) {
  const { t, language } = useLanguage();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetch(`/api/stories?language=${language}&status=Published`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStories(data.data);
        }
      })
      .catch((err) => console.warn('Could not fetch stories:', err))
      .finally(() => setLoading(false));
  }, [language]);

  const filteredStories =
    categoryFilter === 'all'
      ? stories
      : stories.filter((s) => s.category?.toLowerCase() === categoryFilter.toLowerCase());

  const ContainerTag = isEmbedded ? 'section' : 'div';

  return (
    <ContainerTag
      id={isEmbedded ? 'news' : undefined}
      className={
        isEmbedded
          ? 'py-20 px-4 sm:px-6 lg:px-8 bg-transparent border-t border-slate-200/40 scroll-mt-16 text-slate-900'
          : 'min-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8 text-slate-900'
      }
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header Banner */}
        <div className="card-glacier p-6 sm:p-8 rounded-2xl mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border border-slate-200 shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Newspaper className="w-3.5 h-3.5 text-blue-600" />
              <span>Official Communications & Field Dispatches</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight">
              {isEmbedded ? 'Official News & Scientific Bulletins' : t('navNews')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-medium">
              Official press releases, expedition reports, and scientific dispatches from the Ministry of Earth Sciences and NCPOR.
            </p>
          </div>

          {/* Category Filter */}
          <div className="bg-slate-100 p-1 rounded-xl shrink-0 z-10 flex flex-wrap gap-1 text-xs border border-slate-200">
            {['all', 'Press Release', 'Research Milestone', 'Infrastructure', 'Environment'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-lg transition-all text-xs font-semibold ${
                  categoryFilter === cat
                    ? 'bg-white text-blue-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? 'All Updates' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="card-glacier h-72 bg-slate-100"></div>
            ))}
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="card-glacier rounded-2xl p-12 text-center max-w-md mx-auto my-12">
            <Newspaper className="w-10 h-10 text-cyan-600 mx-auto mb-3" />
            <h3 className="font-heading font-extrabold text-slate-900">No releases in this category</h3>
            <p className="text-xs text-slate-600 mt-1">Check back later or select "All Updates".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <div
                key={story._id}
                onClick={() => setSelectedStory(story)}
                className="card-glacier overflow-hidden cursor-pointer group hover:border-blue-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {story.coverImage && (
                    <div className="h-52 w-full overflow-hidden relative">
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/glacier-mountains-sea.jpg';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-slate-200 px-2.5 py-1 rounded-full text-[10px] font-bold text-blue-700 shadow-sm">
                        {story.category || 'Press Release'}
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-2.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{new Date(story.publishedAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="font-heading font-extrabold text-base text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-2 leading-snug">
                      {story.title}
                    </h3>

                    <p className="text-xs text-slate-600 font-medium line-clamp-3 leading-relaxed">
                      {story.summary || story.body}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-xs text-slate-600 font-semibold truncate max-w-[150px]">
                    {story.author}
                  </span>
                  <span className="text-blue-600 font-bold group-hover:underline flex items-center space-x-1">
                    <span>Read Full</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Full Story Modal */}
        {selectedStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl text-slate-900">
              <button
                onClick={() => setSelectedStory(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-xs"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2 text-xs mb-2">
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                  {selectedStory.category || 'Press Release'}
                </span>
                <span className="text-slate-500 font-medium">
                  {new Date(selectedStory.publishedAt).toLocaleDateString()}
                </span>
              </div>

              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 mb-2 leading-snug pr-8">
                {selectedStory.title}
              </h2>

              <div className="text-xs text-slate-500 mb-6 pb-4 border-b border-slate-100">
                Issued by: <span className="text-slate-900 font-bold">{selectedStory.author}</span>
              </div>

              {selectedStory.coverImage && (
                <div className="rounded-xl overflow-hidden mb-6 h-64 w-full border border-slate-200">
                  <img
                    src={selectedStory.coverImage}
                    alt={selectedStory.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/glacier-mountains-sea.jpg';
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap space-y-4 font-sans font-medium">
                {selectedStory.body}
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedStory(null)}
                  className="btn-glacier-primary px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                >
                  Close Release
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ContainerTag>
  );
}
