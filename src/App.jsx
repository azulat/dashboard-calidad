import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  SlidersHorizontal,
  Layers,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  CalendarRange,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  LabelList,
} from 'recharts';

// Deterministic dataset covering all 26 Sprints from Sprint 1 to Sprint 26
const RAW_SPRINT_DATA = [
  { num: 1, period: '08 Ene – 19 Ene', hu: 24, huca: 18, div: 4 },
  { num: 2, period: '22 Ene – 02 Feb', hu: 26, huca: 20, div: 3 },
  { num: 3, period: '05 Feb – 16 Feb', hu: 28, huca: 23, div: 3 },
  { num: 4, period: '19 Feb – 01 Mar', hu: 30, huca: 27, div: 1 },
  { num: 5, period: '04 Mar – 15 Mar', hu: 32, huca: 29, div: 1 },
  { num: 6, period: '18 Mar – 29 Mar', hu: 28, huca: 24, div: 2 },
  { num: 7, period: '01 Abr – 12 Abr', hu: 34, huca: 31, div: 1 },
  { num: 8, period: '15 Abr – 26 Abr', hu: 36, huca: 33, div: 1 },
  { num: 9, period: '29 Abr – 10 May', hu: 30, huca: 26, div: 3 },
  { num: 10, period: '13 May – 24 May', hu: 35, huca: 32, div: 1 },
  { num: 11, period: '27 May – 07 Jun', hu: 38, huca: 35, div: 1 },
  { num: 12, period: '10 Jun – 21 Jun', hu: 36, huca: 31, div: 3 },
  { num: 13, period: '24 Jun – 05 Jul', hu: 40, huca: 37, div: 2 },
  { num: 14, period: '08 Jul – 19 Jul', hu: 42, huca: 39, div: 1 },
  { num: 15, period: '22 Jul – 02 Ago', hu: 38, huca: 35, div: 1 },
  { num: 16, period: '05 Ago – 16 Ago', hu: 34, huca: 29, div: 3 },
  { num: 17, period: '19 Ago – 30 Ago', hu: 36, huca: 33, div: 1 },
  { num: 18, period: '02 Sep – 13 Sep', hu: 40, huca: 37, div: 1 },
  { num: 19, period: '16 Sep – 27 Sep', hu: 44, huca: 41, div: 2 },
  { num: 20, period: '30 Sep – 11 Oct', hu: 40, huca: 36, div: 2 },
  { num: 21, period: '14 Oct – 25 Oct', hu: 30, huca: 25, div: 3 },
  { num: 22, period: '28 Oct – 08 Nov', hu: 35, huca: 30, div: 2 },
  { num: 23, period: '11 Nov – 22 Nov', hu: 40, huca: 37, div: 2 },
  { num: 24, period: '25 Nov – 06 Dic', hu: 38, huca: 33, div: 3 },
  { num: 25, period: '09 Dic – 20 Dic', hu: 42, huca: 40, div: 1 },
  { num: 26, period: '23 Dic – 03 Ene', hu: 40, huca: 38, div: 1 },
];

const SPRINTS = RAW_SPRINT_DATA.map((s) => ({
  ...s,
  id: `SP-${s.num}`,
  shortLabel: `S${s.num}`,
  name: `Sprint ${s.num}`,
  tag: s.num === 26 ? 'Actual' : 'Cerrado',
})).reverse();

function computeMetrics(huRaw, hucaRaw, divRaw) {
  const hu = Math.max(1, Math.round(Number(huRaw) || 1));
  const huca = Math.min(hu, Math.max(0, Math.round(Number(hucaRaw) || 0)));
  const div = Math.min(hu, Math.max(0, Math.round(Number(divRaw) || 0)));

  const pctClarity = (huca / hu) * 100;
  const pctDrift = (div / hu) * 100;
  const indexScore = (pctClarity + (100 - pctDrift)) / 2;

  const clarityOk = pctClarity >= 90;
  const driftOk = pctDrift <= 5;
  const approved = clarityOk && driftOk;

  return {
    hu,
    huca,
    div,
    pctClarity,
    pctDrift,
    indexScore,
    clarityOk,
    driftOk,
    approved,
  };
}

// Horizontal threshold bullet chart with fixed bar color (always green for clarity, always red for drift)
function ThresholdBulletChart({
  title,
  value,
  count,
  total,
  threshold,
  isMinimumTarget,
  barColor,
  maxScale = 100,
}) {
  const clampedVal = Math.min(maxScale, Math.max(0, value));
  const valPercent = (clampedVal / maxScale) * 100;
  const thresholdPercent = (threshold / maxScale) * 100;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-executive flex flex-col justify-between">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        <div className="text-right">
          <div className="font-mono text-3xl font-extrabold text-[#0B1B3D] leading-none">
            {value.toFixed(1)}%
          </div>
          <div className="font-mono text-xs font-bold text-[#C6922A] mt-1">
            {count} de {total}
          </div>
        </div>
      </div>

      <div className="my-5">
        <div className="relative h-7 bg-slate-100 rounded-lg overflow-visible border border-slate-200/80">
          {isMinimumTarget ? (
            <div
              className="absolute top-0 bottom-0 right-0 bg-emerald-500/10 rounded-r-lg border-l border-dashed border-emerald-500/30"
              style={{ left: `${thresholdPercent}%` }}
            />
          ) : (
            <div
              className="absolute top-0 bottom-0 left-0 bg-emerald-500/10 rounded-l-lg border-r border-dashed border-emerald-500/30"
              style={{ width: `${thresholdPercent}%` }}
            />
          )}

          <div className="absolute inset-y-1.5 left-1.5 right-1.5 flex items-center">
            <div
              className="h-full rounded transition-all duration-300"
              style={{
                width: `${Math.max(2, valPercent)}%`,
                backgroundColor: barColor,
              }}
            />
          </div>

          <div
            className="absolute -top-2 -bottom-2 w-0.5 bg-[#0B1B3D] z-10"
            style={{ left: `${thresholdPercent}%` }}
          >
            <div className="absolute -top-5 -translate-x-1/2 bg-[#0B1B3D] text-[#D4A038] font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
              Umbral {threshold}%
            </div>
          </div>
        </div>

        <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2.5">
          <span>0%</span>
          <span>{maxScale / 2}%</span>
          <span>{maxScale}%</span>
        </div>
      </div>
    </div>
  );
}

// Semi-circular radial gauge with threshold marker on the arc
function SemiCircleGauge({ score, threshold = 92.5, approved }) {
  const radius = 80;
  const circumference = Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  const angleRad = Math.PI * (1 - threshold / 100);
  const cx = 100;
  const cy = 95;
  const innerR = radius - 12;
  const outerR = radius + 12;
  const x1 = cx + innerR * Math.cos(angleRad);
  const y1 = cy - innerR * Math.sin(angleRad);
  const x2 = cx + outerR * Math.cos(angleRad);
  const y2 = cy - outerR * Math.sin(angleRad);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg viewBox="0 0 200 115" className="w-60 h-36 overflow-visible">
        <path
          d="M 20 95 A 80 80 0 0 1 180 95"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 20 95 A 80 80 0 0 1 180 95"
          fill="none"
          stroke={approved ? '#10B981' : '#EF4444'}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#D4A038"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <div className="-mt-10 text-center">
        <div className="font-mono text-4xl font-extrabold text-white tracking-tight">
          {score.toFixed(1)}%
        </div>
        <div className="text-[11px] font-mono text-[#D4A038] mt-0.5">
          Umbral {threshold}%
        </div>
      </div>
    </div>
  );
}

// Sprint range selector bar for historical charts
function SprintRangeFilter({ startSprint, endSprint, onChangeStart, onChangeEnd }) {
  const numbers = Array.from({ length: 26 }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap items-center gap-2 bg-slate-100/90 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
      <CalendarRange className="w-3.5 h-3.5 text-[#C6922A]" />
      <span className="font-medium text-slate-600">Intervalo</span>
      <select
        value={startSprint}
        onChange={(e) => {
          const val = Number(e.target.value);
          onChangeStart(val);
          if (val > endSprint) onChangeEnd(val);
        }}
        className="bg-white border border-slate-300 rounded px-2 py-0.5 font-mono font-bold text-[#0B1B3D] focus:outline-none focus:border-[#C6922A]"
      >
        {numbers.map((n) => (
          <option key={n} value={n}>
            Sprint {n}
          </option>
        ))}
      </select>
      <span className="text-slate-400">a</span>
      <select
        value={endSprint}
        onChange={(e) => {
          const val = Number(e.target.value);
          onChangeEnd(val);
          if (val < startSprint) onChangeStart(val);
        }}
        className="bg-white border border-slate-300 rounded px-2 py-0.5 font-mono font-bold text-[#0B1B3D] focus:outline-none focus:border-[#C6922A]"
      >
        {numbers.map((n) => (
          <option key={n} value={n}>
            Sprint {n}
          </option>
        ))}
      </select>
    </div>
  );
}

// Custom tooltip for historical charts
function HistoricalTooltip({ active, payload, mode }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;

  return (
    <div className="bg-[#0B1B3D] text-white px-3.5 py-2.5 rounded-lg border border-[#C6922A] shadow-md font-mono text-xs space-y-1">
      <div className="text-[#D4A038] font-bold">{data.name}</div>
      {mode === 'index' && (
        <>
          <div className="text-white font-extrabold text-sm">
            Índice: {data.indexScore}%
          </div>
          <div className="text-emerald-400">
            Con Criterios Claros: {data.huca} de {data.hu}
          </div>
          <div className="text-rose-400">
            Con Desvío: {data.div} de {data.hu}
          </div>
        </>
      )}
      {mode === 'clarity' && (
        <div className="text-emerald-400 font-extrabold text-sm">
          {data.pctClarity}% — {data.huca} de {data.hu}
        </div>
      )}
      {mode === 'drift' && (
        <div className="text-rose-400 font-extrabold text-sm">
          {data.pctDrift}% — {data.div} de {data.hu}
        </div>
      )}
      {mode === 'counts' && (
        <>
          <div className="text-slate-200">Total Evaluadas: {data.hu}</div>
          <div className="text-emerald-400">Con Criterios Claros: {data.huca}</div>
          <div className="text-rose-400">Con Desvío: {data.div}</div>
        </>
      )}
    </div>
  );
}

export default function App() {
  // activeView is either 'sprint' (individual sprint analysis) or 'history' (global historical section)
  const [activeView, setActiveView] = useState('sprint');
  const [selectedSprintId, setSelectedSprintId] = useState('SP-26');
  const [isSimulating, setIsSimulating] = useState(false);

  // Sprint range interval for historical charts (defaults to Sprint 15 – Sprint 26 in individual, or customizable 1 – 26)
  const [startSprint, setStartSprint] = useState(15);
  const [endSprint, setEndSprint] = useState(26);

  const baseSprint = useMemo(
    () => SPRINTS.find((s) => s.id === selectedSprintId) || SPRINTS[0],
    [selectedSprintId]
  );

  const [simValues, setSimValues] = useState({
    hu: baseSprint.hu,
    huca: baseSprint.huca,
    div: baseSprint.div,
  });

  const handleSelectSprint = (sprintId) => {
    const target = SPRINTS.find((s) => s.id === sprintId);
    setSelectedSprintId(sprintId);
    setActiveView('sprint');
    setIsSimulating(false);
    if (target) {
      setSimValues({ hu: target.hu, huca: target.huca, div: target.div });
    }
  };

  const handleOpenHistorySection = () => {
    setActiveView('history');
    setStartSprint(1);
    setEndSprint(26);
  };

  const updateSimulation = (field, rawValue) => {
    setIsSimulating(true);
    const parsed = Math.max(0, Math.round(Number(rawValue) || 0));

    setSimValues((prev) => {
      if (field === 'hu') {
        const nextHu = Math.max(1, Math.min(100, parsed));
        return {
          hu: nextHu,
          huca: Math.min(prev.huca, nextHu),
          div: Math.min(prev.div, nextHu),
        };
      }
      if (field === 'huca') {
        return { ...prev, huca: Math.min(prev.hu, parsed) };
      }
      if (field === 'div') {
        return { ...prev, div: Math.min(prev.hu, parsed) };
      }
      return prev;
    });
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSimValues({ hu: baseSprint.hu, huca: baseSprint.huca, div: baseSprint.div });
  };

  const activeRaw = isSimulating ? simValues : baseSprint;
  const current = useMemo(
    () => computeMetrics(activeRaw.hu, activeRaw.huca, activeRaw.div),
    [activeRaw]
  );

  // Filtered chronological dataset between startSprint and endSprint
  const filteredTrendData = useMemo(() => {
    return [...SPRINTS]
      .reverse()
      .filter((s) => s.num >= startSprint && s.num <= endSprint)
      .map((s) => {
        const source = s.id === selectedSprintId && isSimulating ? simValues : s;
        const m = computeMetrics(source.hu, source.huca, source.div);
        return {
          id: s.id,
          shortLabel: s.shortLabel,
          num: s.num,
          name: s.name,
          hu: m.hu,
          huca: m.huca,
          div: m.div,
          clarityRatio: `${m.huca}/${m.hu}`,
          driftRatio: `${m.div}/${m.hu}`,
          pctClarity: Number(m.pctClarity.toFixed(1)),
          pctDrift: Number(m.pctDrift.toFixed(1)),
          indexScore: Number(m.indexScore.toFixed(1)),
          approved: m.approved,
        };
      });
  }, [startSprint, endSprint, selectedSprintId, isSimulating, simValues]);

  // Direct metrics bars with permanent green for clarity and permanent red for drift
  const directChartData = [
    {
      name: 'Total Evaluadas',
      value: current.hu,
      color: '#0B1B3D',
    },
    {
      name: 'Con Criterios Claros',
      value: current.huca,
      color: '#10B981',
    },
    {
      name: 'Con Desvío',
      value: current.div,
      color: '#EF4444',
    },
  ];

  const showBarLabels = filteredTrendData.length <= 14;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col lg:flex-row">
      {/* Left Sidebar */}
      <aside className="w-full lg:w-72 lg:h-screen lg:sticky lg:top-0 bg-[#0B1B3D] text-white flex flex-col justify-between border-b lg:border-b-0 lg:border-r-2 border-[#C6922A] shrink-0">
        <div className="flex flex-col min-h-0 flex-1">
          {/* Brand Header */}
          <div className="p-5 border-b border-white/10 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-[#0F2042] border border-[#C6922A] flex items-center justify-center shrink-0">
              <span className="font-serif font-bold text-base tracking-tighter text-white">
                P<span className="text-[#D4A038]">&amp;</span>A
              </span>
            </div>
            <div>
              <div className="font-serif font-bold text-base tracking-wide text-white leading-tight">
                Pareto &amp; Asociados
              </div>
              <div className="text-[11px] text-[#D4A038] font-medium">
                Calidad de historias
              </div>
            </div>
          </div>

          {/* Dedicated Historical Section Button */}
          <div className="p-3 border-b border-white/10 shrink-0">
            <div className="text-[10px] font-mono tracking-wider text-slate-400 px-2 mb-1.5">
              Panorama general
            </div>
            <button
              type="button"
              onClick={handleOpenHistorySection}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-2.5 border ${
                activeView === 'history'
                  ? 'bg-[#C6922A] border-[#D4A038] text-[#0B1B3D] font-bold shadow-sm'
                  : 'bg-[#0F2042]/70 border-white/10 text-slate-200 hover:bg-white/10'
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span className="text-xs font-bold">
                 Panorama Histórico Global
              </span>
            </button>
          </div>

          {/* Scrollable List of all 26 Sprints */}
          <div className="p-3 flex-1 min-h-0 flex flex-col">
            <div className="text-[10px] font-mono tracking-wider text-slate-400 px-2 mb-1.5 shrink-0">
              Sprints 1 al 26
            </div>
            <div className="space-y-1 overflow-y-auto pr-1 flex-1 max-h-64 lg:max-h-none">
              {SPRINTS.map((s) => {
                const isSelected = activeView === 'sprint' && s.id === selectedSprintId;
                const source = s.id === selectedSprintId && isSimulating ? simValues : s;
                const m = computeMetrics(source.hu, source.huca, source.div);

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectSprint(s.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-[#0F2042] border-[#C6922A] text-white shadow-sm'
                        : 'border-transparent text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          m.approved ? 'bg-emerald-400' : 'bg-rose-500'
                        }`}
                      />
                      <div>
                        <div className="text-xs font-bold leading-none">{s.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {s.period}
                        </div>
                      </div>
                    </div>
                    {s.tag === 'Actual' && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#C6922A]/20 text-[#D4A038] border border-[#C6922A]/40">
                        Actual
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Simulation Panel inside Sidebar (visible when inspecting a Sprint) */}
        {activeView === 'sprint' && (
          <div className="p-3.5 m-3 rounded-xl bg-[#0F2042] border border-white/10 shrink-0">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#D4A038]">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Simulador</span>
              </div>
              {isSimulating && (
                <button
                  type="button"
                  onClick={resetSimulation}
                  className="text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">Total Evaluadas</span>
                  <span className="font-mono font-bold text-white">{current.hu}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={80}
                  value={current.hu}
                  onChange={(e) => updateSimulation('hu', e.target.value)}
                  className="w-full pareto-slider"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">Con Criterios Claros</span>
                  <span className="font-mono font-bold text-emerald-400">{current.huca}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={current.hu}
                  value={current.huca}
                  onChange={(e) => updateSimulation('huca', e.target.value)}
                  className="w-full pareto-slider"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">Con Desvío</span>
                  <span className="font-mono font-bold text-rose-400">{current.div}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={current.hu}
                  value={current.div}
                  onChange={(e) => updateSimulation('div', e.target.value)}
                  className="w-full pareto-slider"
                />
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeView === 'sprint' ? (
          <>
            {/* Top Bar for Selected Sprint */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-[#0B1B3D]">{baseSprint.name}</h1>
                  <span className="text-xs font-mono text-slate-400">{baseSprint.period}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Métricas de historias de usuario del sprint
                </p>
              </div>

              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide text-white shadow-sm ${
                  current.approved ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              >
                {current.approved ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>
                  {current.approved ? 'Prototipado habilitado' : 'Bloqueado'}
                </span>
              </div>
            </header>

            {/* Individual Sprint Dashboard Grid */}
            <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
              {/* Row 1: Composite Index Gauge (4 cols) + Bullet Charts (8 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 bg-gradient-to-br from-[#0B1B3D] to-[#0F2042] text-white rounded-xl p-6 border border-[#C6922A]/60 shadow-navy-glow flex flex-col items-center justify-between">
                  <div className="w-full flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-200">
                      Índice de Comprensibilidad
                    </h2>
                    <span
                      className={`w-3 h-3 rounded-full ${
                        current.approved ? 'bg-emerald-400' : 'bg-rose-500'
                      }`}
                    />
                  </div>

                  <div className="my-2">
                    <SemiCircleGauge
                      score={current.indexScore}
                      threshold={92.5}
                      approved={current.approved}
                    />
                  </div>
                </div>

                {/* Bullet Charts: Con Criterios Claros (always green) & Con Desvío (always red) */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ThresholdBulletChart
                    title="Con Criterios Claros"
                    value={current.pctClarity}
                    count={current.huca}
                    total={current.hu}
                    threshold={90}
                    isMinimumTarget={true}
                    barColor="#10B981"
                    maxScale={100}
                  />

                  <ThresholdBulletChart
                    title="Con Desvío"
                    value={current.pctDrift}
                    count={current.div}
                    total={current.hu}
                    threshold={5}
                    isMinimumTarget={false}
                    barColor="#EF4444"
                    maxScale={25}
                  />
                </div>
              </div>

              {/* Row 2: Direct Counts (4 cols) + Wide Historical Index Bar Chart (8 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Direct Metrics Horizontal Bars */}
                <div className="lg:col-span-4 bg-white rounded-xl p-6 border border-slate-200/90 shadow-executive flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-700">
                      Cantidad de Historias de Usuario
                    </h3>
                    <Layers className="w-4 h-4 text-[#C6922A]" />
                  </div>

                  <div className="space-y-5 my-auto">
                    {directChartData.map((item) => {
                      const pct = current.hu > 0 ? (item.value / current.hu) * 100 : 0;
                      return (
                        <div key={item.name}>
                          <div className="flex justify-between items-baseline mb-1.5">
                            <span className="text-xs font-semibold text-slate-600">
                              {item.name}
                            </span>
                            <span className="font-mono text-2xl font-extrabold text-[#0B1B3D]">
                              {item.value}
                            </span>
                          </div>
                          <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.max(3, pct)}%`,
                                backgroundColor: item.color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Wide Vertical Bar Chart: Historical Comprehensibility Index above Threshold */}
                <div className="lg:col-span-8 bg-white rounded-xl p-6 border border-slate-200/90 shadow-executive flex flex-col justify-between">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700">
                        Histórico del Índice de Comprensibilidad
                      </h3>
                    </div>

                    <SprintRangeFilter
                      startSprint={startSprint}
                      endSprint={endSprint}
                      onChangeStart={setStartSprint}
                      onChangeEnd={setEndSprint}
                    />
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredTrendData}
                        margin={{ top: 22, right: 16, left: -16, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis
                          dataKey="shortLabel"
                          tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[70, 100]}
                          ticks={[70, 80, 92.5, 100]}
                          tickFormatter={(v) => `${v}%`}
                          tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip content={<HistoricalTooltip mode="index" />} />
                        <ReferenceLine
                          y={92.5}
                          stroke="#C6922A"
                          strokeDasharray="6 4"
                          strokeWidth={2}
                        />
                        <Bar dataKey="indexScore" radius={[5, 5, 0, 0]} maxBarSize={38}>
                          {showBarLabels && (
                            <LabelList
                              dataKey="indexScore"
                              position="top"
                              formatter={(v) => `${v}%`}
                              offset={6}
                              style={{
                                fill: '#0B1B3D',
                                fontSize: '10px',
                                fontFamily: 'JetBrains Mono',
                                fontWeight: 700,
                              }}
                            />
                          )}
                          {filteredTrendData.map((entry) => (
                            <Cell
                              key={entry.id}
                              fill={entry.approved ? '#10B981' : '#EF4444'}
                              stroke={entry.id === selectedSprintId ? '#0B1B3D' : 'none'}
                              strokeWidth={entry.id === selectedSprintId ? 2 : 0}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </main>
          </>
        ) : (
          /* GLOBAL HISTORICAL SECTION ACROSS ALL SPRINTS */
          <>
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-[#0B1B3D]">
                  Evolución Histórica de Métricas por Sprint
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Serie histórica completa de historias de usuario
                </p>
              </div>

              <SprintRangeFilter
                startSprint={startSprint}
                endSprint={endSprint}
                onChangeStart={setStartSprint}
                onChangeEnd={setEndSprint}
              />
            </header>

            <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
              {/* Full-Width Chart 1: Índice de Comprensibilidad across Sprints */}
              <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-executive">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-[#0B1B3D]">
                    Índice de Comprensibilidad por Sprint
                  </h2>
                  <span className="font-mono text-xs font-bold text-[#0B1B3D] bg-[#FBF6EC] border border-[#C6922A]/40 px-2.5 py-1 rounded">
                    Umbral 92.5%
                  </span>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={filteredTrendData}
                      margin={{ top: 20, right: 16, left: -16, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis
                        dataKey="shortLabel"
                        tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[70, 100]}
                        ticks={[70, 80, 92.5, 100]}
                        tickFormatter={(v) => `${v}%`}
                        tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<HistoricalTooltip mode="index" />} />
                      <ReferenceLine
                        y={92.5}
                        stroke="#C6922A"
                        strokeDasharray="6 4"
                        strokeWidth={2}
                      />
                      <Bar dataKey="indexScore" radius={[4, 4, 0, 0]} maxBarSize={32}>
                        {showBarLabels && (
                          <LabelList
                            dataKey="indexScore"
                            position="top"
                            formatter={(v) => `${v}%`}
                            offset={6}
                            style={{
                              fill: '#0B1B3D',
                              fontSize: '10px',
                              fontFamily: 'JetBrains Mono',
                              fontWeight: 700,
                            }}
                          />
                        )}
                        {filteredTrendData.map((entry) => (
                          <Cell
                            key={entry.id}
                            fill={entry.approved ? '#10B981' : '#EF4444'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Row 2: Wide Side-by-Side Percentage History Charts (Con Criterios Claros & Con Desvío) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Con Criterios Claros (Always Green) */}
                <div className="lg:col-span-6 bg-white rounded-xl p-6 border border-slate-200/90 shadow-executive">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-[#0B1B3D]">
                      Porcentaje Con Criterios Claros
                    </h3>
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                      Umbral 90%
                    </span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={filteredTrendData}
                        margin={{ top: 20, right: 16, left: -16, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="greenArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis
                          dataKey="shortLabel"
                          tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[60, 105]}
                          ticks={[60, 75, 90, 100]}
                          tickFormatter={(v) => `${v}%`}
                          tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip content={<HistoricalTooltip mode="clarity" />} />
                        <ReferenceLine
                          y={90}
                          stroke="#0B1B3D"
                          strokeDasharray="5 4"
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="pctClarity"
                          stroke="#10B981"
                          strokeWidth={2.5}
                          fill="url(#greenArea)"
                          dot={{ r: 3.5, fill: '#10B981', stroke: '#fff', strokeWidth: 1.5 }}
                        >
                          {showBarLabels && (
                            <LabelList
                              dataKey="clarityRatio"
                              position="top"
                              offset={8}
                              style={{
                                fill: '#065F46',
                                fontSize: '9px',
                                fontFamily: 'JetBrains Mono',
                                fontWeight: 700,
                              }}
                            />
                          )}
                        </Area>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Con Desvío (Always Red) */}
                <div className="lg:col-span-6 bg-white rounded-xl p-6 border border-slate-200/90 shadow-executive">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-[#0B1B3D]">
                      Porcentaje Con Desvío
                    </h3>
                    <span className="font-mono text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded">
                      Umbral 5%
                    </span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredTrendData}
                        margin={{ top: 20, right: 16, left: -16, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis
                          dataKey="shortLabel"
                          tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[0, 20]}
                          ticks={[0, 5, 10, 15, 20]}
                          tickFormatter={(v) => `${v}%`}
                          tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip content={<HistoricalTooltip mode="drift" />} />
                        <ReferenceLine
                          y={5}
                          stroke="#0B1B3D"
                          strokeDasharray="5 4"
                          strokeWidth={2}
                        />
                        <Bar dataKey="pctDrift" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={28}>
                          {showBarLabels && (
                            <LabelList
                              dataKey="driftRatio"
                              position="top"
                              offset={6}
                              style={{
                                fill: '#991B1B',
                                fontSize: '9px',
                                fontFamily: 'JetBrains Mono',
                                fontWeight: 700,
                              }}
                            />
                          )}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Row 3: Full-Width Direct Counts Evolution across Sprints */}
              <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-executive">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <h3 className="text-sm font-bold text-[#0B1B3D]">
                    Cantidad de Historias de Usuario por Sprint
                  </h3>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-[#0B1B3D] font-semibold">
                      <span className="w-3 h-3 rounded-sm bg-[#0B1B3D]" />
                      Total Evaluadas
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <span className="w-3 h-3 rounded-sm bg-[#10B981]" />
                      Con Criterios Claros
                    </span>
                    <span className="flex items-center gap-1.5 text-rose-700 font-semibold">
                      <span className="w-3 h-3 rounded-sm bg-[#EF4444]" />
                      Con Desvío
                    </span>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={filteredTrendData}
                      margin={{ top: 12, right: 16, left: -16, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis
                        dataKey="shortLabel"
                        tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<HistoricalTooltip mode="counts" />} />
                      <Bar
                        dataKey="huca"
                        name="Con Criterios Claros"
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={22}
                      />
                      <Bar
                        dataKey="div"
                        name="Con Desvío"
                        fill="#EF4444"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={22}
                      />
                      <Line
                        type="monotone"
                        dataKey="hu"
                        name="Total Evaluadas"
                        stroke="#0B1B3D"
                        strokeWidth={2.5}
                        dot={{ r: 3.5, fill: '#0B1B3D', stroke: '#D4A038', strokeWidth: 1.5 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </main>
          </>
        )}
      </div>
    </div>
  );
}
