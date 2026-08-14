import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 20) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true });

export function Sparkles({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><path d="m12 3-1.4 3.6L7 8l3.6 1.4L12 13l1.4-3.6L17 8l-3.6-1.4L12 3Z"/><path d="m19 14-.9 2.1L16 17l2.1.9L19 20l.9-2.1L22 17l-2.1-.9L19 14Z"/><path d="m5 14-.7 1.7L2.5 16.5l1.8.8L5 19l.7-1.7 1.8-.8-1.8-.8L5 14Z"/></svg> }
export function Search({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg> }
export function Arrow({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg> }
export function Check({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><path d="m5 12 4 4L19 6"/></svg> }
export function Shield({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg> }
export function Building({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><path d="M3 21h18"/><path d="M6 21V7l6-4 6 4v14"/><path d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01"/></svg> }
export function Wallet({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><path d="M4 6h15a2 2 0 0 1 2 2v10H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h13"/><path d="M16 11h5"/></svg> }
export function Chart({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/></svg> }
export function Handshake({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><path d="m8 11 2 2a2 2 0 0 0 3 0l3-3"/><path d="m18 8 3 3-6 6a2 2 0 0 1-3 0l-1-1"/><path d="m6 8-3 3 5 5"/><path d="M8 11 6 9a2 2 0 0 1 0-3l1-1a2 2 0 0 1 3 0l1 1"/></svg> }
export function Globe({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg> }
export function User({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg> }
export function Menu({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><path d="M4 7h16M4 12h16M4 17h16"/></svg> }
export function Close({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><path d="m6 6 12 12M18 6 6 18"/></svg> }
export function Chevron({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><path d="m9 18 6-6-6-6"/></svg> }
export function Bolt({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><path d="m13 2-9 12h8l-1 8 9-12h-8l1-8Z"/></svg> }
export function Bell({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg> }
export function Heart({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> }
export function HeartFilled({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props} fill="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> }
export function BarChart({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><rect x="3" y="12" width="4" height="8" rx="1"/><rect x="10" y="8" width="4" height="12" rx="1"/><rect x="17" y="4" width="4" height="16" rx="1"/></svg> }
export function TrendingUp({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> }
export function MessageCircle({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"/></svg> }
export function Star({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
export function StarFilled({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props} fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
export function Layers({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> }
export function Send({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> }
export function Clock({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
export function MapPin({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg> }
export function Grid({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> }
export function List({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> }
export function Target({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> }
export function Eye({ size = 20, ...props }: Props) { return <svg {...base(size)} {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg> }
