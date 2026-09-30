import React, { useState, useEffect } from 'react';
import { Radio, Wind, Thermometer, Compass, Activity, Droplets, Sun, ChevronRight, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import LocationPin from './LocationPin';

export default function StationStatusStrip() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stations/live')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStations(data.stations);
        }
      })
      .catch((err) => console.warn('Could not fetch station status:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white/80 border-y border-slate-200/80 py-3.5 px-4 animate-pulse">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <Radio className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            <span>Establishing live telemetry uplinks with Antarctic & Arctic bases...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border-y border-slate-800 py-6 sm:py-8 shadow-xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h3 className="text-base sm:text-xl font-heading font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>Live Station Telemetry Stream</span>
            </h3>
            <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-400/25 text-xs font-semibold tracking-wide">
              NCPOR / MoES Network
            </span>
          </div>
          <Link
            to="/datasets"
            className="btn-glacier-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm text-white shrink-0 self-start sm:self-auto"
          >
            <span>Explore All Sensor Data</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* 4 Enhanced Station Telemetry Cards with Bold Station Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stations.slice(0, 4).map((station) => (
            <div
              key={station.id}
              className="card-glacier p-5 rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Station Name - Bold & Highlighted with Location Pin */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <LocationPin className="w-4 h-4 text-sky-600 shrink-0" />
                    <h4 className="font-heading font-black text-base sm:text-lg text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors">
                      {station.name}
                    </h4>
                  </div>
                  <span className="text-[10px] font-sans px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold tracking-wide">
                    {station.status}
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-mono font-medium mb-3 truncate">
                  {station.coordinates}
                </div>
              </div>

              {/* Station Metrics */}
              <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100 text-xs font-mono">
                {station.telemetry.surfaceTemp && (
                  <div className="p-2.5 rounded-xl bg-slate-50/90 border border-slate-100">
                    <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center space-x-1 font-sans">
                      <Thermometer className="w-3.5 h-3.5 text-sky-600" />
                      <span>Temp</span>
                    </div>
                    <div className="font-extrabold text-sm text-slate-900 mt-0.5">{station.telemetry.surfaceTemp}</div>
                  </div>
                )}
                {station.telemetry.windSpeed && (
                  <div className="p-2.5 rounded-xl bg-slate-50/90 border border-slate-100">
                    <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center space-x-1 font-sans">
                      <Wind className="w-3.5 h-3.5 text-blue-600" />
                      <span>Wind</span>
                    </div>
                    <div className="font-extrabold text-sm text-slate-900 mt-0.5">{station.telemetry.windSpeed}</div>
                  </div>
                )}
                {station.telemetry.waterTemp100m && (
                  <div className="p-2.5 rounded-xl bg-slate-50/90 border border-slate-100">
                    <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center space-x-1 font-sans">
                      <Waves className="w-3.5 h-3.5 text-cyan-600" />
                      <span>100m Depth</span>
                    </div>
                    <div className="font-extrabold text-sm text-slate-900 mt-0.5">{station.telemetry.waterTemp100m}</div>
                  </div>
                )}
                {station.telemetry.salinity && (
                  <div className="p-2.5 rounded-xl bg-slate-50/90 border border-slate-100">
                    <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center space-x-1 font-sans">
                      <Droplets className="w-3.5 h-3.5 text-teal-600" />
                      <span>Salinity</span>
                    </div>
                    <div className="font-extrabold text-sm text-slate-900 mt-0.5">{station.telemetry.salinity}</div>
                  </div>
                )}
                {station.telemetry.solarRadiation && (
                  <div className="p-2.5 rounded-xl bg-slate-50/90 border border-slate-100">
                    <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center space-x-1 font-sans">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Solar</span>
                    </div>
                    <div className="font-extrabold text-sm text-slate-900 mt-0.5">{station.telemetry.solarRadiation}</div>
                  </div>
                )}
                {station.telemetry.pressure && (
                  <div className="p-2.5 rounded-xl bg-slate-50/90 border border-slate-100">
                    <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center space-x-1 font-sans">
                      <Activity className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Pressure</span>
                    </div>
                    <div className="font-extrabold text-sm text-slate-900 mt-0.5">{station.telemetry.pressure}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
