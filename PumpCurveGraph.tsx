import React from "react";
import { PumpModel } from "../data/catalogData";

interface PumpCurveGraphProps {
  pump: PumpModel;
  operatingQ: number;
  operatingH: number;
}

export default function PumpCurveGraph({ pump, operatingQ, operatingH }: PumpCurveGraphProps) {
  // Find extreme points to define graph scales
  const sortedCurve = [...pump.curveData].sort((a, b) => a.q - b.q);
  const maxCurveQ = sortedCurve[sortedCurve.length - 1]?.q || pump.maxFlow || 5;
  const maxCurveH = Math.max(...pump.curveData.map((d) => d.h)) || 100;

  // Add 15% headroom for beautiful plotting margins
  const qMax = Math.ceil(maxCurveQ * 1.15);
  const hMax = Math.ceil(maxCurveH * 1.15);

  // SVG Dimension constants
  const width = 500;
  const height = 280;
  const paddingLeft = 55;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Mapping functions
  const getX = (q: number) => paddingLeft + (q / qMax) * chartWidth;
  const getY = (h: number) => height - paddingBottom - (h / hMax) * chartHeight;

  // Generate grid lines
  const qTicks = Array.from({ length: 6 }, (_, i) => (qMax / 5) * i);
  const hTicks = Array.from({ length: 6 }, (_, i) => (hMax / 5) * i);

  // Generate curve path string
  let curvePath = "";
  if (sortedCurve.length > 0) {
    curvePath = sortedCurve
      .map((pt, idx) => `${idx === 0 ? "M" : "L"} ${getX(pt.q)} ${getY(pt.h)}`)
      .join(" ");
  }

  // Calculate coordinates for the customer's actual operating point
  const opX = getX(operatingQ);
  const opY = getY(operatingH);

  // Check if operating point is within standard bounds
  const isWithinQ = operatingQ <= qMax;
  const isWithinH = operatingH <= hMax;
  const isValidPoint = isWithinQ && isWithinH && operatingQ > 0 && operatingH > 0;

  return (
    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-slate-100" id="pump-curve-graph-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h4 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">H-Q Performans Karakteristik Eğrisi</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Seçilen <span className="text-white font-bold">{pump.name}</span> pompasının debi-basınç grafiği ve çalışma noktanız.
          </p>
        </div>
        <div className="flex gap-4 text-[10px] text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-500 inline-block"></span>
            <span>Pompa Eğrisi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block animate-pulse"></span>
            <span>Çalışma Noktası</span>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto" id="svg-graph-wrapper">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[450px] h-auto font-mono text-[9px] select-none"
        >
          {/* Grid Lines & Ticks */}
          {/* Horizontal lines (Head / h) */}
          {hTicks.map((h, i) => {
            const y = getY(h);
            return (
              <g key={`h-grid-${i}`} className="opacity-20">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#94a3b8"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#94a3b8"
                  className="font-bold"
                >
                  {Math.round(h)}
                </text>
              </g>
            );
          })}

          {/* Vertical lines (Flow / Q) */}
          {qTicks.map((q, i) => {
            const x = getX(q);
            return (
              <g key={`q-grid-${i}`} className="opacity-20">
                <line
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={height - paddingBottom}
                  stroke="#94a3b8"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
                <text
                  x={x}
                  y={height - paddingBottom + 12}
                  textAnchor="middle"
                  fill="#94a3b8"
                  className="font-bold"
                >
                  {q.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Graph Axis */}
          <line
            x1={paddingLeft}
            y1={height - paddingBottom}
            x2={width - paddingRight}
            y2={height - paddingBottom}
            stroke="#475569"
            strokeWidth="1.5"
          />
          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={paddingLeft}
            y2={height - paddingBottom}
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* Axis Titles */}
          <text
            x={width - paddingRight - 10}
            y={height - paddingBottom + 26}
            textAnchor="end"
            fill="#64748b"
            className="font-bold"
          >
            Debi Q (m³/saat)
          </text>
          <text
            x={paddingLeft - 38}
            y={paddingTop - 10}
            textAnchor="start"
            fill="#64748b"
            className="font-bold"
            transform={`rotate(-90, ${paddingLeft - 38}, ${paddingTop - 10})`}
          >
            Basma Yüksekliği H (mSS)
          </text>

          {/* Main Pump Curve Line */}
          {curvePath && (
            <path
              d={curvePath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Operating Point Grid Intersections */}
          {isValidPoint && (
            <g id="operating-lines">
              {/* Horizontal line to Y axis */}
              <line
                x1={paddingLeft}
                y1={opY}
                x2={opX}
                y2={opY}
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="3,3"
                className="opacity-70"
              />
              {/* Vertical line to X axis */}
              <line
                x1={opX}
                y1={opY}
                x2={opX}
                y2={height - paddingBottom}
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="3,3"
                className="opacity-70"
              />

              {/* Operating Point glowing marker */}
              <circle cx={opX} cy={opY} r="7" fill="#f59e0b" className="opacity-20 animate-ping" />
              <circle cx={opX} cy={opY} r="4" fill="#d97706" stroke="#ffffff" strokeWidth="1" />
            </g>
          )}
        </svg>
      </div>

      {isValidPoint && (
        <div className="mt-3 bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-wrap gap-4 text-[11px] justify-between items-center" id="op-stats">
          <div>
            <span className="text-slate-400 block">Sizin Çalışma Noktanız:</span>
            <span className="font-bold text-amber-400">
              Q = {operatingQ.toFixed(1)} m³/h @ H = {operatingH} mSS
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Pompa Optimum Noktası (BEP):</span>
            <span className="font-bold text-blue-400">
              Q = {pump.bestFlow} m³/h @ H = {pump.bestHead} mSS
            </span>
          </div>
          <div className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400">Verimlilik Durumu:</span>
            <span className="font-bold text-emerald-400 ml-1">
              {Math.abs(operatingQ - pump.bestFlow) < 1.0 ? "Mükemmel Verim (%94+)" : "Yüksek Verim (%85+)"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
