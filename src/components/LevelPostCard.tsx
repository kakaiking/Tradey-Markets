"use client";

import Link from "next/link";
import { Heart, Bookmark, Share2, CheckCircle } from "lucide-react";

type Props = {
  id: string;
  title: string;
  subtitle?: string;
  lessons?: number;
  progress?: number;
  free?: boolean;
  img?: string | null;
  href?: string;
};

export default function LevelPostCard({ id, title, subtitle, lessons = 0, progress = 0, free = true, img = null, href = "/" }: Props) {
  const isDone = progress === 100;

  return (
    <article className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg min-w-0">
      <div className="relative w-full h-56 bg-gradient-to-tr from-brand-900 to-brand-700">
        {img ? (
          // simple img fallback — project can swap to Next/Image later
          <img src={img} alt={`${title} cover`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-2xl font-bold">{title}</div>
        )}

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${isDone ? 'bg-brand-500/20 text-brand-500' : 'bg-white/5 text-white/60'}`}>
            {isDone ? <CheckCircle size={18} className="text-brand-500" /> : id.slice(0,2).toUpperCase()}
          </div>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button aria-label="like" className="bg-black/40 p-2 rounded-full hover:scale-105 transition-transform"><Heart size={14} /></button>
          <button aria-label="save" className="bg-black/40 p-2 rounded-full hover:scale-105 transition-transform"><Bookmark size={14} /></button>
        </div>
      </div>

      <div className="p-4 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white/90 truncate">{title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${free ? 'badge-green' : 'badge-gold'}`}>{free ? 'Free' : 'Premium'}</span>
            {isDone && <span className="text-xs badge-green px-2 py-0.5 rounded-full">✓ Done</span>}
          </div>
          <p className="text-sm text-white/45">{subtitle}</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="progress-bar w-40 h-2 bg-[#1e2d24] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-500 to-brand-400" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs text-white/35">{progress}%</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="text-xs text-white/40">{lessons} lessons</div>
          <Link href={href} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-brand-500 to-brand-600 text-black">
            {isDone ? 'Review' : (progress > 0 ? 'Continue' : 'Start')}
          </Link>
        </div>
      </div>
    </article>
  );
}


