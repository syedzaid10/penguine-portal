import React, { useState, useEffect } from 'react';
import {
  Database,
  BarChart3,
  Table as TableIcon,
  Download,
  Info,
  Layers,
  Thermometer,
  Waves,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import LocationPin from '../components/LocationPin';

export default function Datasets({ isEmbedded = false }) {
  const { t } = useLanguage();
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('chart'); // 'chart' or 'table'

  useEffect(() => {
    fetch('/api/datasets')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setDatasets(data.data);
          setSelectedDataset(data.data[0]);
        }
      })
      .catch((err) => console.warn('Could not fetch datasets:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadCSV = (dataset) => {
    if (!dataset.datasetDetails?.previewRows) return;
    const rows = dataset.datasetDetails.previewRows;
    const headers = dataset.datasetDetails.columnHeaders || Object.keys(rows[0] || {});

    const csvContent =
      headers.join(',') +
      '\n' +
      rows.map((row) => headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${dataset.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="flex items-center space-x-3 text-blue-600 font-mono text-sm animate-pulse">
          <Database className="w-5 h-5 animate-spin" />
          <span>Streaming telemetry and scientific datasets...</span>
        </div>
      </div>
    );
  }

  const details = selectedDataset?.datasetDetails || {};
  const previewRows = details.previewRows || [];
  const columnHeaders = details.columnHeaders || [];
  const chartConfig = details.chartConfig || { xAxis: 'time', yAxis: [] };

  const ContainerTag = isEmbedded ? 'section' : 'div';

  return (
    <ContainerTag
      id={isEmbedded ? 'datasets' : undefined}
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
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>Verified Open Telemetry & Cryosphere Sensor Feeds</span>
            </div>
            <div className="flex items-center space-x-3">
              {!isEmbedded && (
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
                  <Database className="w-5 h-5" />
                </div>
              )}
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight">
                {isEmbedded ? (
                  <>Interactive Scientific Telemetry & Datasets</>
                ) : (
                  t('navDatasets')
                )}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-3xl leading-relaxed">
              Standardized polar telemetry, depth curves, and climate proxy datasets with dynamic Recharts visualizations.
            </p>
          </div>
        </div>

        {/* Main Grid: Left selector & Right detail/chart view */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Datasets List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="card-glacier px-4 py-3 rounded-2xl flex items-center justify-between mb-3 shadow-xs border border-slate-200">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Available Sensor Datasets
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                {datasets.length}
              </span>
            </div>

            {datasets.map((ds) => {
              const isSelected = selectedDataset?._id === ds._id;
              return (
                <div
                  key={ds._id}
                  onClick={() => setSelectedDataset(ds)}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500/30'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                    <span className="px-2 py-0.5 rounded bg-blue-100/70 text-blue-700 font-semibold border border-blue-200 inline-flex items-center gap-1.5">
                      <LocationPin className="w-3.5 h-3.5" />
                      <span>{ds.station}</span>
                    </span>
                    <span className="text-slate-500 font-medium">{ds.year}</span>
                  </div>
                  <h3
                    className={`font-heading font-bold text-sm leading-snug line-clamp-2 ${
                      isSelected ? 'text-blue-900' : 'text-slate-800'
                    }`}
                  >
                    {ds.title}
                  </h3>
                  <div className="text-[11px] text-slate-700 font-mono mt-2.5 flex items-center justify-between font-medium">
                    <span>{ds.datasetDetails?.previewRows?.length || 0} Data Points</span>
                    <span className="text-slate-600 font-semibold">{ds.datasetDetails?.units?.split(',')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Visualization & Metadata */}
          {selectedDataset && (
            <div className="lg:col-span-8 space-y-6">
              {/* Metadata Card */}
              <div className="card-glacier p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-semibold inline-flex items-center gap-1.5">
                      <LocationPin className="w-3.5 h-3.5" />
                      <span>{selectedDataset.station}</span>
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-xs font-mono font-medium">
                      {selectedDataset.year}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDownloadCSV(selectedDataset)}
                    className="btn-glacier-primary px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV Dataset</span>
                  </button>
                </div>

                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 mb-2">
                  {selectedDataset.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {selectedDataset.summary}
                </p>

                {/* Telemetry Metadata Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs font-mono">
                  <div>
                    <span className="text-[11px] text-slate-700 uppercase block font-bold mb-0.5">Instrument</span>
                    <span className="text-slate-900 font-bold">{details.instrument || 'Telemetry Sensor'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-700 uppercase block font-bold mb-0.5">Units of Measurement</span>
                    <span className="text-slate-900 font-bold">{details.units || 'SI Metric Units'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-700 uppercase block font-bold mb-0.5">Data Licence</span>
                    <span className="text-emerald-800 font-bold">{details.licence || 'Open Government Data'}</span>
                  </div>
                </div>
              </div>

              {/* View Mode Toggle: Interactive Chart vs Table */}
              <div className="card-glacier p-2.5 sm:p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setViewMode('chart')}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'chart'
                        ? 'bg-white text-blue-700 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t('chartView')}</span>
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'table'
                        ? 'bg-white text-blue-700 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <TableIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t('previewTable')}</span>
                  </button>
                  <button
                    onClick={() => setViewMode('specs')}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'specs'
                        ? 'bg-white text-emerald-700 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>CF-1.8 & Satellite Specs</span>
                  </button>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-900 flex items-center space-x-2 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                  <span className="text-slate-700 font-medium">
                    {viewMode === 'specs' ? 'OGC & Climate-Forecast Standard' : 'Visualized with Recharts v2 • High-Precision Plot'}
                  </span>
                </div>
              </div>

              {/* View 1: Dynamic Recharts Chart */}
              {viewMode === 'chart' && (
                <div className="card-glacier p-6">
                  <h4 className="font-heading font-bold text-xs text-blue-700 uppercase font-mono tracking-wider mb-4">
                    Dynamic Telemetry Curve: {chartConfig.unitLabel || selectedDataset.title}
                  </h4>

                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartConfig.type === 'area' ? (
                        <AreaChart data={previewRows}>
                          <defs>
                            <linearGradient id="colorArea1" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                            </linearGradient>
                            <linearGradient id="colorArea2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                          <XAxis
                            dataKey={chartConfig.xAxis}
                            stroke="#64748B"
                            fontSize={11}
                            fontFamily="JetBrains Mono"
                          />
                          <YAxis stroke="#64748B" fontSize={11} fontFamily="JetBrains Mono" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#FFFFFF',
                              borderColor: '#2563EB',
                              borderRadius: '12px',
                              fontFamily: 'JetBrains Mono',
                              fontSize: '11px',
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            }}
                          />
                          <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: '11px' }} />
                          {chartConfig.yAxis?.map((metric, i) => (
                            <Area
                              key={metric}
                              type="monotone"
                              dataKey={metric}
                              stroke={i === 0 ? '#2563EB' : '#8B5CF6'}
                              fillOpacity={1}
                              fill={i === 0 ? 'url(#colorArea1)' : 'url(#colorArea2)'}
                              strokeWidth={2.5}
                            />
                          ))}
                        </AreaChart>
                      ) : (
                        <LineChart data={previewRows}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                          <XAxis
                            dataKey={chartConfig.xAxis}
                            stroke="#64748B"
                            fontSize={11}
                            fontFamily="JetBrains Mono"
                          />
                          <YAxis stroke="#64748B" fontSize={11} fontFamily="JetBrains Mono" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#FFFFFF',
                              borderColor: '#2563EB',
                              borderRadius: '12px',
                              fontFamily: 'JetBrains Mono',
                              fontSize: '11px',
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            }}
                          />
                          <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: '11px' }} />
                          {chartConfig.yAxis?.map((metric, i) => (
                            <Line
                              key={metric}
                              type="monotone"
                              dataKey={metric}
                              stroke={i === 0 ? '#2563EB' : i === 1 ? '#059669' : '#8B5CF6'}
                              strokeWidth={2.5}
                              dot={{ fill: '#FFFFFF', stroke: i === 0 ? '#2563EB' : '#059669', r: 3, strokeWidth: 2 }}
                              activeDot={{ r: 6 }}
                            />
                          ))}
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* View 2: CSV Preview Table */}
              {viewMode === 'table' && (
                <div className="card-glacier overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-800 font-bold">
                      Raw Record Stream Preview ({previewRows.length} Rows)
                    </span>
                    <span className="text-slate-500">{columnHeaders.length} Column Fields</span>
                  </div>

                  <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] border-b border-slate-200 sticky top-0">
                        <tr>
                          {columnHeaders.map((col) => (
                            <th key={col} className="px-4 py-3 font-bold">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {previewRows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                            {columnHeaders.map((col) => (
                              <td key={col} className="px-4 py-2.5 text-slate-700">
                                {typeof row[col] === 'number'
                                  ? row[col].toFixed(2)
                                  : String(row[col] ?? '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* View 3: Data Product Specifications & Space Technology Alignment */}
              {viewMode === 'specs' && (
                <div className="card-glacier p-6 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-heading font-bold text-sm text-slate-900">
                        Standardized Data Product Specifications & Schema
                      </h4>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                        Interoperable with ISRO MOSDAC, OGC WMS/WFS, and World Data System (WDS)
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
                      CF-1.8 / ACDD-1.3 COMPLIANT
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Product File Format</span>
                      <span className="text-blue-700 font-bold">NetCDF-4 (.nc) / HDF5 / CSV</span>
                      <div className="text-[10px] text-slate-500">Unidata NetCDF Classic Data Model</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Coordinate Reference System (CRS)</span>
                      <span className="text-purple-700 font-bold">
                        {selectedDataset.station === 'Himadri' || selectedDataset.station === 'IndARC'
                          ? 'EPSG:3995 (WGS 84 / Arctic Polar Stereographic)'
                          : 'EPSG:3031 (WGS 84 / Antarctic Polar Stereographic)'}
                      </span>
                      <div className="text-[10px] text-slate-500">Standard polar conformal projection</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Temporal Resolution & Revisit</span>
                      <span className="text-emerald-700 font-bold">10-Min Telemetry / Daily Swath</span>
                      <div className="text-[10px] text-slate-500">Real-time AWS uplink via Iridium / Inmarsat</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Associated Space Missions (ISRO / ESA)</span>
                      <span className="text-amber-700 font-bold">Oceansat-3, SARAL-AltiKa, CryoSat-2</span>
                      <div className="text-[10px] text-slate-500">Ground-truth validation for satellite scatterometers</div>
                    </div>
                  </div>

                  {/* Schema NetCDF Attributes Sample */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 font-mono text-[11px] text-slate-100">
                    <span className="text-blue-300 uppercase text-[10px] block font-bold">
                      CF-1.8 Global Attributes Header (Machine-Readable Preview):
                    </span>
                    <pre className="text-slate-300 overflow-x-auto leading-relaxed text-[11px] whitespace-pre-wrap">
{`:title = "${selectedDataset.title}" ;
:institution = "National Centre for Polar and Ocean Research (NCPOR), MoES, India" ;
:source = "${details.instrument || 'Automated Station Telemetry'}" ;
:conventions = "CF-1.8, ACDD-1.3" ;
:geospatial_lat_min = "-70.76" ;
:geospatial_lat_max = "-69.40" ;
:spatial_resolution = "1 km polar grid / in-situ sensor cast" ;
:doi = "10.21044/NCPOR.POLAR.${selectedDataset.year}.${selectedDataset._id.slice(-4)}" ;
:license = "${details.licence || 'Open Government Data (OGD) India'}" ;`}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ContainerTag>
  );
}
