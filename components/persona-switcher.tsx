'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePersona, PersonaType } from './persona-context';
import { useRouter, usePathname } from '@/navigation';
import {
  User,
  Stethoscope,
  ChevronDown,
  Check,
  Sparkles,
} from 'lucide-react';

export function PersonaSwitcher() {
  const { currentPersona, setPersonaType, allPersonas } = usePersona();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (type: PersonaType) => {
    setPersonaType(type);
    setIsOpen(false);
    if (type === 'doctor') {
      router.push('/doctor');
    } else {
      router.push('/today');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-white/15 transition cursor-pointer"
        title="Switch between Patient and Doctor"
      >
        <div className={`flex h-5 w-5 items-center justify-center rounded-full font-bold text-[10px] ${currentPersona.avatarBg}`}>
          {currentPersona.avatarText}
        </div>
        <span className="font-heading tracking-tight truncate max-w-[85px] sm:max-w-none text-white">
          {currentPersona.type === 'doctor' ? 'Dr. Sen' : currentPersona.name.split(' ')[0]}
        </span>
        <span className="text-[10px] text-rose-200/90 font-normal">
          ({currentPersona.badge})
        </span>
        <ChevronDown className="h-3 w-3 text-rose-200/80 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-3xl border border-slate-200/90 bg-white p-2.5 shadow-xl animate-in fade-in zoom-in-95 text-slate-900">
          <div className="mb-2 px-2 pt-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
              <Sparkles className="h-3 w-3 text-brand-pink" />
              Switch Role (Instant Access)
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Toggle between the Patient mobile companion and Doctor clinical portal:
            </p>
          </div>

          <div className="space-y-1.5">
            {allPersonas.map((p) => {
              const isSelected = p.type === currentPersona.type;
              return (
                <button
                  key={p.type}
                  type="button"
                  onClick={() => handleSelect(p.type)}
                  className={`flex w-full items-start justify-between rounded-2xl p-2.5 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border border-indigo-200 bg-indigo-50/70 shadow-xs'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-bold text-[10px] ${p.avatarBg}`}>
                      {p.avatarText}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 font-heading">
                          {p.name}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${p.badgeClass}`}
                        >
                          {p.badge}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] leading-tight text-slate-500 font-body">
                        {p.description}
                      </p>
                    </div>
                  </div>
                  {isSelected && <Check className="mt-1 h-4 w-4 shrink-0 text-indigo-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
