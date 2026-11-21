'use client';

import React, { useState } from 'react';
import { Link, usePathname } from '@/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Locale } from '@/i18n';
import { getDictionary } from '@/lib/i18n-dictionary';
import { LanguageSwitcher } from './language-switcher';
import { PersonaSwitcher } from './persona-switcher';
import { usePersona, PERSONAS } from './persona-context';
import { DoctorNotificationBell } from './doctor-notifications';
import {
  Bell,
  X,
  Heart,
  Sparkles,
  ChevronRight,
  Smile,
  Calendar,
  CheckCircle2,
  ShoppingCart,
  Menu,
} from 'lucide-react';

export function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const dict = getDictionary(locale);
  const pathname = usePathname();
  const { currentPersona } = usePersona();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  // The doctor portal is decided by the route, so /doctor always gets the doctor header and notifications.
  const isDoctorView = /^\/doctor(\/|$)/.test(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  const notifications = [
    {
      id: 'n1',
      title: dict.navbar.ovulationNotif,
      subtitle: dict.navbar.ovulationSub,
      icon: Heart,
      iconColor: 'bg-brand-purpleLight text-brand-purple',
      time: 'Just now',
      unread: true,
    },
    {
      id: 'n2',
      title: dict.navbar.energyNotif,
      subtitle: dict.navbar.energySub,
      icon: Smile,
      iconColor: 'bg-pastel-peach text-brand-pink',
      time: '2h ago',
      unread: true,
    },
    {
      id: 'n3',
      title: dict.navbar.smartCartNotif,
      subtitle: dict.navbar.smartCartSub,
      icon: ShoppingCart,
      iconColor: 'bg-pastel-yellow text-amber-800',
      time: '4h ago',
      unread: false,
    },
    {
      id: 'n4',
      title: dict.navbar.medsNotif,
      subtitle: dict.navbar.medsSub,
      icon: CheckCircle2,
      iconColor: 'bg-pastel-mint text-emerald-700',
      time: '6h ago',
      unread: false,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#1E171B]/85 backdrop-blur-md border-b border-white/10 text-white shadow-sm">
        <div className={`mx-auto ${isDoctorView ? 'max-w-7xl px-4 sm:px-6' : 'max-w-md sm:max-w-lg px-3.5 sm:px-4'} py-2.5`}>
          <div className="flex items-center justify-between">
            {/* Left: User / Doctor Welcome */}
            <Link
              href={isDoctorView ? '/doctor' : '/today'}
              className="flex items-center gap-2"
            >
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-rose-200/70 leading-none">
                  {isDoctorView ? 'Clinical Doctor Portal' : dict.navbar.welcome}
                </span>
                <span className="font-heading text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  {isDoctorView ? PERSONAS.doctor.name : currentPersona.name}
                  {isDoctorView && (
                    <span className="text-[10px] bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 px-2 py-0.5 rounded-full font-sans font-medium">
                      OPD Lead
                    </span>
                  )}
                </span>
              </div>
            </Link>

            {/* Right: Controls & Notification Bell */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <PersonaSwitcher />
              <LanguageSwitcher />

              {/* Notification Bell: doctor and patient get different notifications */}
              {isDoctorView ? (
                <DoctorNotificationBell />
              ) : (
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(true)}
                  className="relative flex w-9 h-9 items-center justify-center rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 shadow-xs transition"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4 text-white" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notification Drawer */}
      {notificationsOpen && !isDoctorView && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-3 animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setNotificationsOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-4xl p-5 shadow-2xl border border-rose-100 z-10 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg font-bold text-slate-900">
                  {dict.navbar.notifications}
                </span>
                <span className="rounded-full bg-brand-pinkLight px-2 py-0.5 text-[10px] font-bold text-brand-pink">
                  {dict.navbar.unreadCount}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setNotificationsOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notifications list with H2 Pattern Watch pinned */}
            <div className="mt-3 space-y-2.5 max-h-[400px] overflow-y-auto">
              {/* H2. Pattern Watch ("Ritu noticed") - Pinned with Periwinkle border */}
              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 border-l-4 border-l-brand-purple transition">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-purple text-white text-[10px]">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-bold text-indigo-950 font-heading">
                      {dict.navbar.patternWatchTitle}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-brand-purple bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                    {dict.navbar.patternWatchConfidence}
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                  {dict.navbar.patternWatchDesc}
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <Link
                    href="/care"
                    onClick={() => setNotificationsOpen(false)}
                    className="inline-flex items-center gap-1 rounded-xl bg-brand-purple text-white text-[11px] font-bold px-3 py-1.5 hover:bg-brand-purpleDark shadow-xs transition"
                  >
                    {dict.navbar.addQuestionsBtn}
                  </Link>
                  <Link
                    href="/labs"
                    onClick={() => setNotificationsOpen(false)}
                    className="inline-flex items-center gap-1 rounded-xl bg-white text-brand-purple border border-indigo-200 text-[11px] font-semibold px-2.5 py-1.5 hover:bg-indigo-50 transition"
                  >
                    {dict.navbar.bookTestBtn}
                  </Link>
                </div>
              </div>
              {notifications.map((n) => {
                const Icon = n.icon;
                return (
                  <div
                    key={n.id}
                    className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                      n.unread
                        ? 'bg-rose-50/40 border-rose-200/80'
                        : 'bg-white border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${n.iconColor}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-snug">
                          {n.title}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                          {n.subtitle}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
