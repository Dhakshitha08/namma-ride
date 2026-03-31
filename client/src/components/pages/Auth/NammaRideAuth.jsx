
// NammaRideAuth.jsx
// Full Auth UI for Namma Ride — Sign In & Sign Up
// Stack: React + Tailwind + Framer Motion + React Router
// Drop this into your src/ folder and wrap App with <BrowserRouter>

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
// bg: #0a0a12  surface: #12121e  border: #1e1e32
// accent-from: #7c3aed  accent-to: #2563eb
// text-primary: #f1f0ff  text-muted: #6b6b8a

// ─────────────────────────────────────────────
// ICONS (inline SVG — no extra dependencies)
// ─────────────────────────────────────────────
const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
  </svg>
);
const GraduationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const SpinnerIcon = () => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

// ─────────────────────────────────────────────
// ANIMATED ROAD ILLUSTRATION
// ─────────────────────────────────────────────
const Road = () => {
  const Car = ({ y, delay, color, width = 36, height = 18, reverse }) => (
    <motion.g
      initial={{ x: reverse ? 340 : -80 }}
      animate={{ x: reverse ? -80 : 340 }}
      transition={{ duration: reverse ? 6 : 5, repeat: Infinity, ease: "linear", delay }}
    >
      {/* body */}
      <rect x={0} y={y} width={width} height={height} rx={5} fill={color} opacity={0.92}/>
      {/* cabin */}
      <rect x={width * 0.25} y={y - height * 0.5} width={width * 0.5} height={height * 0.6} rx={3} fill={color} opacity={0.7}/>
      {/* windows */}
      <rect x={width * 0.28} y={y - height * 0.45} width={width * 0.18} height={height * 0.38} rx={2} fill="#1e2a4a" opacity={0.9}/>
      <rect x={width * 0.52} y={y - height * 0.45} width={width * 0.18} height={height * 0.38} rx={2} fill="#1e2a4a" opacity={0.9}/>
      {/* wheels */}
      <circle cx={width * 0.22} cy={y + height - 3} r={5} fill="#0f1020"/>
      <circle cx={width * 0.22} cy={y + height - 3} r={2.5} fill="#2d3450"/>
      <circle cx={width * 0.78} cy={y + height - 3} r={5} fill="#0f1020"/>
      <circle cx={width * 0.78} cy={y + height - 3} r={2.5} fill="#2d3450"/>
      {/* headlight glow */}
      {!reverse && <rect x={width - 4} y={y + 4} width={5} height={8} rx={2} fill="#fbbf24" opacity={0.9}/>}
      {reverse && <rect x={-1} y={y + 4} width={5} height={8} rx={2} fill="#ef4444" opacity={0.7}/>}
    </motion.g>
  );

  const Bike = ({ y, delay, color, reverse }) => (
    <motion.g
      initial={{ x: reverse ? 340 : -50 }}
      animate={{ x: reverse ? -50 : 340 }}
      transition={{ duration: reverse ? 4.5 : 3.8, repeat: Infinity, ease: "linear", delay }}
    >
      {/* frame */}
      <line x1={8} y1={y} x2={20} y2={y + 10} stroke={color} strokeWidth={2.5} strokeLinecap="round"/>
      <line x1={20} y1={y + 10} x2={28} y2={y} stroke={color} strokeWidth={2.5} strokeLinecap="round"/>
      <line x1={8} y1={y} x2={28} y2={y} stroke={color} strokeWidth={1.5} strokeLinecap="round" opacity={0.5}/>
      {/* wheels */}
      <circle cx={8} cy={y + 10} r={7} fill="none" stroke={color} strokeWidth={2}/>
      <circle cx={28} cy={y + 10} r={7} fill="none" stroke={color} strokeWidth={2}/>
      <circle cx={8} cy={y + 10} r={2} fill={color} opacity={0.6}/>
      <circle cx={28} cy={y + 10} r={2} fill={color} opacity={0.6}/>
      {/* rider silhouette */}
      <ellipse cx={20} cy={y - 4} rx={5} ry={6} fill={color} opacity={0.5}/>
      <circle cx={20} cy={y - 12} r={4} fill={color} opacity={0.6}/>
    </motion.g>
  );

  // Dashed center line animation
  const DashLine = () => (
    <motion.g
      initial={{ x: 0 }}
      animate={{ x: -40 }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
    >
      {[0,40,80,120,160,200,240,280,320,360].map(x => (
        <rect key={x} x={x} y={119} width={24} height={3} rx={1.5} fill="#ffffff" opacity={0.12}/>
      ))}
    </motion.g>
  );

  return (
    <div className="w-full h-full flex items-center justify-center select-none">
      <svg
        viewBox="0 0 300 240"
        className="w-full max-w-xs opacity-90"
        style={{ filter: "drop-shadow(0 0 32px rgba(124,58,237,0.18))" }}
      >
        {/* Sky gradient */}
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a0a18"/>
            <stop offset="100%" stopColor="#12122a"/>
          </linearGradient>
          <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e"/>
            <stop offset="100%" stopColor="#0d0d1a"/>
          </linearGradient>
          <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="cityGlow" cx="50%" cy="100%" r="60%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.12"/>
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="300" height="240" fill="url(#skyGrad)"/>
        <rect width="300" height="240" fill="url(#cityGlow)"/>

        {/* Stars */}
        {[[20,15],[60,8],[100,20],[150,5],[200,12],[250,18],[280,8],[35,30],[170,25],[230,30]].map(([x,y],i) => (
          <motion.circle key={i} cx={x} cy={y} r={1}
            fill="#ffffff"
            animate={{ opacity: [0.2, 0.9, 0.2] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}

        {/* City skyline silhouette */}
        {[
          [10,95,18,40],[30,92,14,43],[46,98,12,38],[60,88,16,48],[78,95,10,41],
          [90,85,20,51],[112,90,14,46],[128,96,10,40],[140,82,18,54],[160,88,16,48],
          [178,93,12,43],[192,87,14,49],[208,91,16,45],[226,94,10,42],[238,84,18,52],
          [258,90,14,46],[274,96,12,40],[288,88,10,48]
        ].map(([x,y,w,h],i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="#0e0e1e" opacity={0.9}/>
        ))}
        {/* Windows on buildings */}
        {[[14,100],[34,96],[64,93],[93,93],[144,87],[162,93],[195,92],[242,89],[262,95]].map(([x,y],i) => (
          <motion.rect key={i} x={x} y={y} width={3} height={3} rx={0.5}
            fill="#7c3aed"
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 1.5 + i * 0.4, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}

        {/* Road */}
        <rect x={0} y={135} width={300} height={105} fill="url(#roadGrad)"/>
        {/* Road edge lines */}
        <line x1={0} y1={136} x2={300} y2={136} stroke="#2a2a4a" strokeWidth={1.5}/>
        <line x1={0} y1={238} x2={300} y2={238} stroke="#2a2a4a" strokeWidth={1}/>
        {/* Lane dividers */}
        <line x1={0} y1={175} x2={300} y2={175} stroke="#1e1e35" strokeWidth={1}/>
        <DashLine/>
        {/* Sidewalk */}
        <rect x={0} y={125} width={300} height={11} fill="#16162a"/>

        {/* Street lamps */}
        {[50, 150, 250].map((x, i) => (
          <g key={i}>
            <rect x={x} y={105} width={2.5} height={22} rx={1} fill="#2d2d4a"/>
            <rect x={x - 8} y={103} width={18} height={3} rx={1.5} fill="#2d2d4a"/>
            <ellipse cx={x + 9} cy={104} rx={12} ry={8} fill="url(#lampGlow)"/>
            <motion.circle cx={x + 9} cy={104} r={2.5}
              fill="#fbbf24"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            />
          </g>
        ))}

        {/* ── VEHICLES ── */}
        {/* Lane 1 (upper, going right) */}
        <Car y={141} delay={0}    color="#7c3aed" width={38} height={17}/>
        <Car y={141} delay={2.2}  color="#2563eb" width={34} height={16}/>
        <Car y={141} delay={4.1}  color="#0ea5e9" width={40} height={17}/>

        {/* Lane 1 bikes going right */}
        <Bike y={148} delay={1.1}  color="#a78bfa"/>
        <Bike y={148} delay={3.6}  color="#60a5fa"/>

        {/* Lane 2 (lower, going left) */}
        <Car y={180} delay={0.5}  color="#4f46e5" width={36} height={16} reverse/>
        <Car y={180} delay={2.8}  color="#7c3aed" width={42} height={18} reverse/>
        <Car y={180} delay={4.8}  color="#1d4ed8" width={34} height={15} reverse/>

        {/* Lane 2 bikes going left */}
        <Bike y={186} delay={1.8}  color="#818cf8" reverse/>
        <Bike y={186} delay={0.3}  color="#93c5fd" reverse/>

        {/* Pedestrian hints */}
        {[70, 180].map((x, i) => (
          <motion.g key={i}
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.25 }}
          >
            <circle cx={x} cy={128} r={3} fill="#a78bfa" opacity={0.5}/>
            <rect x={x-2} y={131} width={4} height={6} rx={1} fill="#a78bfa" opacity={0.4}/>
          </motion.g>
        ))}

        {/* Road surface gloss */}
        <rect x={0} y={135} width={300} height={2} fill="#ffffff" opacity={0.04}/>

        {/* Logo watermark */}
        <text x={150} y={228} textAnchor="middle" fontSize={8} fill="#ffffff" opacity={0.15} fontFamily="monospace" letterSpacing={3}>
          NAMMA RIDE
        </text>
      </svg>
    </div>
  );
};

// ─────────────────────────────────────────────
// REUSABLE: InputField
// ─────────────────────────────────────────────
const InputField = ({ label, type = "text", icon, value, onChange, error, placeholder, name, rightIcon, onRightIconClick }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#6b6b8a" }}>
      {label}
    </label>
    <div className="relative group">
      {/* left icon */}
      <span
        className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
        style={{ color: error ? "#f87171" : "#4a4a6a" }}
      >
        {icon}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-xl text-sm outline-none transition-all duration-200 pl-10 pr-10 py-3"
        style={{
          background: "#0f0f1e",
          border: `1.5px solid ${error ? "#ef4444" : "#1e1e36"}`,
          color: "#e8e6ff",
          boxShadow: error
            ? "0 0 0 3px rgba(239,68,68,0.08)"
            : "none",
        }}
        onFocus={e => {
          e.target.style.border = `1.5px solid ${error ? "#ef4444" : "#7c3aed"}`;
          e.target.style.boxShadow = error
            ? "0 0 0 3px rgba(239,68,68,0.12)"
            : "0 0 0 3px rgba(124,58,237,0.15)";
        }}
        onBlur={e => {
          e.target.style.border = `1.5px solid ${error ? "#ef4444" : "#1e1e36"}`;
          e.target.style.boxShadow = error ? "0 0 0 3px rgba(239,68,68,0.08)" : "none";
        }}
      />
      {/* right icon (eye toggle) */}
      {rightIcon && (
        <button
          type="button"
          onClick={onRightIconClick}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 hover:opacity-80"
          style={{ color: "#4a4a6a", background: "none", border: "none", cursor: "pointer" }}
        >
          {rightIcon}
        </button>
      )}
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="text-xs"
          style={{ color: "#f87171" }}
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

// ─────────────────────────────────────────────
// REUSABLE: SelectField
// ─────────────────────────────────────────────
const SelectField = ({ label, icon, value, onChange, error, options, name }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#6b6b8a" }}>
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: error ? "#f87171" : "#4a4a6a" }}>
        {icon}
      </span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl text-sm outline-none pl-10 pr-4 py-3 appearance-none transition-all duration-200"
        style={{
          background: "#0f0f1e",
          border: `1.5px solid ${error ? "#ef4444" : "#1e1e36"}`,
          color: value ? "#e8e6ff" : "#4a4a6a",
        }}
        onFocus={e => { e.target.style.border = "1.5px solid #7c3aed"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)"; }}
        onBlur={e => { e.target.style.border = `1.5px solid ${error ? "#ef4444" : "#1e1e36"}`; e.target.style.boxShadow = "none"; }}
      >
        <option value="" disabled style={{ color: "#4a4a6a" }}>Select {label}</option>
        {options.map(o => <option key={o} value={o} style={{ background: "#12121e", color: "#e8e6ff" }}>{o}</option>)}
      </select>
      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "#4a4a6a" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </div>
    <AnimatePresence>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="text-xs" style={{ color: "#f87171" }}>
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

// ─────────────────────────────────────────────
// REUSABLE: GradientButton
// ─────────────────────────────────────────────
const GradientButton = ({ children, loading, type = "submit" }) => (
  <motion.button
    type={type}
    disabled={loading}
    whileHover={!loading ? { scale: 1.02, boxShadow: "0 8px 32px rgba(124,58,237,0.35)" } : {}}
    whileTap={!loading ? { scale: 0.98 } : {}}
    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-200"
    style={{
      background: loading
        ? "linear-gradient(135deg, #4a2d9e, #1a3a7a)"
        : "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
      color: "#ffffff",
      border: "none",
      cursor: loading ? "not-allowed" : "pointer",
      letterSpacing: "0.1em",
      opacity: loading ? 0.7 : 1,
    }}
  >
    {loading ? <><SpinnerIcon /> Processing…</> : children}
  </motion.button>
);

// ─────────────────────────────────────────────
// REUSABLE: AuthLayout (shared shell)
// ─────────────────────────────────────────────
const AuthLayout = ({ children, title, subtitle }) => (
  <div
    className="min-h-screen flex items-stretch"
    style={{ background: "#0a0a12", fontFamily: "'Sora', 'DM Sans', sans-serif" }}
  >
    {/* ── Left: Illustration pane ── */}
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="hidden lg:flex flex-col items-center justify-center w-1/2 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0e0e20 0%, #0a0a12 100%)" }}
    >
      {/* grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "linear-gradient(#1e1e35 1px, transparent 1px), linear-gradient(90deg, #1e1e35 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* glow blob */}
      <div
        className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ width: 400, height: 400, background: "radial-gradient(circle, #7c3aed, transparent)", top: "20%", left: "10%" }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ width: 300, height: 300, background: "radial-gradient(circle, #2563eb, transparent)", bottom: "15%", right: "10%" }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-12 w-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4l3 3"/>
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight" style={{ color: "#f1f0ff", letterSpacing: "-0.03em" }}>
            Namma <span style={{ background: "linear-gradient(135deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Ride</span>
          </span>
        </motion.div>

        {/* Road animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full"
          style={{ height: 260 }}
        >
          <Road/>
        </motion.div>

        {/* Tag line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-base font-semibold" style={{ color: "#a78bfa" }}>
            Campus rides, reimagined.
          </p>
          <p className="text-sm mt-1" style={{ color: "#3d3d5c" }}>
            Share rides. Save time. Travel together.
          </p>
        </motion.div>
      </div>
    </motion.div>

    {/* ── Right: Form pane ── */}
    <div className="flex-1 flex items-center justify-center px-5 py-10 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
        className="w-full max-w-md"
      >
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
            </svg>
          </div>
          <span className="text-lg font-black" style={{ color: "#f1f0ff", letterSpacing: "-0.03em" }}>
            Namma <span style={{ background: "linear-gradient(135deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Ride</span>
          </span>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(18,18,30,0.85)",
            border: "1.5px solid #1e1e36",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.06) inset",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="mb-7">
            <h1 className="text-2xl font-black tracking-tight" style={{ color: "#f1f0ff", letterSpacing: "-0.03em" }}>
              {title}
            </h1>
            <p className="text-sm mt-1.5" style={{ color: "#4a4a6a" }}>{subtitle}</p>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// SIGN IN PAGE
// ─────────────────────────────────────────────
const SignIn = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: "" }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800)); // simulate API
    setLoading(false);
    // navigate("/dashboard"); // ← uncomment when backend ready
    alert("Signed in successfully! 🎉");
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your Namma Ride account">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="you@university.edu"
          icon={<EmailIcon/>}
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <InputField
          label="Password"
          name="password"
          type={showPass ? "text" : "password"}
          placeholder="••••••••"
          icon={<LockIcon/>}
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          rightIcon={showPass ? <EyeOffIcon/> : <EyeIcon/>}
          onRightIconClick={() => setShowPass(s => !s)}
        />

        {/* Forgot password */}
        <div className="flex justify-end -mt-1">
          <button type="button" className="text-xs transition-colors duration-150 hover:opacity-80"
            style={{ color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>
            Forgot password?
          </button>
        </div>

        <div className="mt-2">
          <GradientButton loading={loading}>Sign In →</GradientButton>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px" style={{ background: "#1e1e36" }}/>
          <span className="text-xs" style={{ color: "#2e2e4a" }}>OR</span>
          <div className="flex-1 h-px" style={{ background: "#1e1e36" }}/>
        </div>

        <p className="text-sm text-center" style={{ color: "#4a4a6a" }}>
          Don't have an account?{" "}
          <Link to="/signup"
            className="font-semibold transition-colors duration-150 hover:opacity-80"
            style={{ color: "#a78bfa", textDecoration: "none" }}>
            Sign Up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

// ─────────────────────────────────────────────
// SIGN UP PAGE
// ─────────────────────────────────────────────
const departments = [
  "Computer Science","Information Technology","Electronics & Communication",
  "Electrical Engineering","Mechanical Engineering","Civil Engineering",
  "Chemical Engineering","Biotechnology","MBA","Other",
];
const years = ["1st Year","2nd Year","3rd Year","4th Year","Postgraduate","PhD"];

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", confirmPassword: "", department: "", year: "",
  });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!form.department) e.department = "Please select your department";
    if (!form.year) e.year = "Please select your year";
    return e;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: "" }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    alert("Account created! Welcome to Namma Ride 🚗");
    navigate("/");
  };

  return (
    <AuthLayout title="Create account" subtitle="Join Namma Ride — your campus ride companion">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <InputField
          label="Full Name"
          name="fullName"
          type="text"
          placeholder="Arjun Kumar"
          icon={<UserIcon/>}
          value={form.fullName}
          onChange={handleChange}
          error={errors.fullName}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="arjun@university.edu"
          icon={<EmailIcon/>}
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Password"
            name="password"
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            icon={<LockIcon/>}
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            rightIcon={showPass ? <EyeOffIcon/> : <EyeIcon/>}
            onRightIconClick={() => setShowPass(s => !s)}
          />
          <InputField
            label="Confirm"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            icon={<LockIcon/>}
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            rightIcon={showConfirm ? <EyeOffIcon/> : <EyeIcon/>}
            onRightIconClick={() => setShowConfirm(s => !s)}
          />
        </div>
        <SelectField
          label="Department"
          name="department"
          icon={<BuildingIcon/>}
          value={form.department}
          onChange={handleChange}
          error={errors.department}
          options={departments}
        />
        <SelectField
          label="Year"
          name="year"
          icon={<GraduationIcon/>}
          value={form.year}
          onChange={handleChange}
          error={errors.year}
          options={years}
        />

        {/* Terms */}
        <p className="text-xs" style={{ color: "#3d3d5c" }}>
          By creating an account you agree to our{" "}
          <span style={{ color: "#7c3aed", cursor: "pointer" }}>Terms of Service</span> and{" "}
          <span style={{ color: "#7c3aed", cursor: "pointer" }}>Privacy Policy</span>.
        </p>

        <div className="mt-1">
          <GradientButton loading={loading}>Create Account →</GradientButton>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: "#1e1e36" }}/>
          <span className="text-xs" style={{ color: "#2e2e4a" }}>OR</span>
          <div className="flex-1 h-px" style={{ background: "#1e1e36" }}/>
        </div>

        <p className="text-sm text-center" style={{ color: "#4a4a6a" }}>
          Already have an account?{" "}
          <Link to="/"
            className="font-semibold transition-colors duration-150 hover:opacity-80"
            style={{ color: "#a78bfa", textDecoration: "none" }}>
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

// ─────────────────────────────────────────────
// GOOGLE FONT LOADER
// ─────────────────────────────────────────────
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
  return null;
};

// ─────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────
export default function NammaRideAuth() {
  return (
    <Router>
      <FontLoader/>
      <Routes>
        <Route path="/" element={<SignIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
      </Routes>
    </Router>
  );
}

// ─────────────────────────────────────────────
// HOW TO USE IN YOUR PROJECT
// ─────────────────────────────────────────────
// 1. npm install framer-motion react-router-dom
// 2. npm install -D tailwindcss && npx tailwindcss init
// 3. Copy NammaRideAuth.jsx to src/
// 4. In src/main.jsx:
//      import NammaRideAuth from './NammaRideAuth'
//      ReactDOM.createRoot(...).render(<NammaRideAuth/>)
// 5. Remove the <BrowserRouter> wrapper from this file if App.jsx already has one,
//    and export SignIn / SignUp as named exports instead.
// export default function NammaRideAuth() {
//   return (
//     <div className="bg-red-500 text-white p-5">
//       Tailwind Working Test
//     </div>
//   );
// }