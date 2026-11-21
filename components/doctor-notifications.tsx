'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname, useRouter } from '@/navigation';
import {
  Bell,
  X,
  Siren,
  ClipboardCheck,
  FlaskConical,
  CalendarClock,
  MessageSquare,
  CheckCheck,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Lock,
} from 'lucide-react';
import {
  DOCTOR_NOTIFICATIONS,
  DOCTOR_NOTIF_GROUPS,
  DOCTOR_NAV_EVENT,
  DoctorNotification,
  DoctorNotifGroup,
  DoctorNavTarget,
} from '@/data/doctor-notifications';

const GROUP_ORDER: DoctorNotifGroup[] = ['urgent', 'approvals', 'results', 'today', 'team'];

const GROUP_STYLE: Record<
  DoctorNotifGroup,
  { icon: React.ElementType; iconBox: string; stripe: string; button: string }
> = {
  urgent: {
    icon: Siren,
    iconBox: 'bg-red-100 text-red-600',
    stripe: 'border-l-red-500',
    button: 'bg-red-600 hover:bg-red-700 text-white',
  },
  approvals: {
    icon: ClipboardCheck,
    iconBox: 'bg-indigo-100 text-brand-purple',
    stripe: 'border-l-brand-purple',
    button: 'bg-brand-purple hover:bg-brand-purpleHover text-white',
  },
  results: {
    icon: FlaskConical,
    iconBox: 'bg-amber-100 text-amber-700',
    stripe: 'border-l-amber-400',
    button: 'bg-slate-900 hover:bg-slate-700 text-white',
  },
  today: {
    icon: CalendarClock,
    iconBox: 'bg-emerald-100 text-emerald-700',
    stripe: 'border-l-emerald-400',
    button: 'bg-slate-900 hover:bg-slate-700 text-white',
  },
  team: {
    icon: MessageSquare,
    iconBox: 'bg-slate-100 text-slate-600',
    stripe: 'border-l-slate-300',
    button: 'bg-slate-900 hover:bg-slate-700 text-white',
  },
};

const SOURCE_STYLE: Record<DoctorNotification['source'], string> = {
  'Guideline red flag': 'bg-red-50 text-red-700 border-red-200',
  'Learned from patient': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Your rule': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Lab upload': 'bg-amber-50 text-amber-800 border-amber-200',
  'Patient message': 'bg-rose-50 text-rose-700 border-rose-200',
  'Care team': 'bg-sky-50 text-sky-700 border-sky-200',
  Schedule: 'bg-slate-50 text-slate-600 border-slate-200',
};

type Filter = 'all' | DoctorNotifGroup;

/** Bell + slide-over panel shown in the top bar on the doctor portal. */
export function DoctorNotificationBell() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [items, setItems] = useState<DoctorNotification[]>(DOCTOR_NOTIFICATIONS);
  const [hideNames, setHideNames] = useState(true);
  const [digest, setDigest] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const unread = items.filter((n) => n.unread);
  const hasUrgentUnread = unread.some((n) => n.group === 'urgent');

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: unread.length };
    GROUP_ORDER.forEach((g) => (c[g] = unread.filter((n) => n.group === g).length));
    return c;
  }, [unread]);

  const visibleGroups = GROUP_ORDER.filter((g) => filter === 'all' || filter === g)
    .map((g) => ({ group: g, list: items.filter((n) => n.group === g) }))
    .filter((g) => g.list.length > 0);

  const markRead = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  const goTo = (n: DoctorNotification) => {
    markRead(n.id);
    setOpen(false);
    const t: DoctorNavTarget = n.target;
    if (/^\/doctor(\/|$)/.test(pathname)) {
      window.dispatchEvent(new CustomEvent(DOCTOR_NAV_EVENT, { detail: t }));
    } else {
      const q = new URLSearchParams({ section: t.section });
      if (t.tab) q.set('tab', t.tab);
      if (t.inboxItemId) q.set('item', t.inboxItemId);
      router.push(`/doctor?${q.toString()}`);
    }
  };

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'urgent', label: 'Urgent' },
    { id: 'approvals', label: 'Sign-off' },
    { id: 'results', label: 'Results' },
    { id: 'today', label: 'Today' },
    { id: 'team', label: 'Messages' },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative flex w-9 h-9 items-center justify-center rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 shadow-xs transition"
        aria-label={`Notifications, ${unread.length} unread`}
      >
        <Bell className="w-4 h-4 text-white" />
        {unread.length > 0 && (
          <span
            className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-[#1E171B] ${
              hasUrgentUnread ? 'bg-red-500 text-white' : 'bg-brand-purple text-white'
            }`}
          >
            {unread.length}
          </span>
        )}
      </button>

      {open && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Doctor notifications">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in" onClick={() => setOpen(false)} />

          <aside className="relative h-full w-full max-w-[440px] bg-[#FBFAFC] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="px-5 pt-5 pb-3 bg-white border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-lg font-bold text-slate-900 leading-tight">Notifications</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {unread.length > 0 ? `${unread.length} unread across ${new Set(unread.map((n) => n.patientName)).size} patients` : 'You’re all caught up'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={markAllRead}
                    disabled={unread.length === 0}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-brand-purple hover:bg-indigo-50 disabled:text-slate-300 disabled:hover:bg-transparent transition"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
                    aria-label="Close notifications"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filter chips */}
              <div className="mt-3 flex gap-1.5 overflow-x-auto [scrollbar-width:none] -mx-1 px-1">
                {filters.map((f) => {
                  const active = filter === f.id;
                  const count = counts[f.id] ?? 0;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFilter(f.id)}
                      className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition ${
                        active
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {f.label}
                      {count > 0 && (
                        <span
                          className={`rounded-full px-1.5 text-[10px] font-bold ${
                            f.id === 'urgent'
                              ? 'bg-red-500 text-white'
                              : active
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
              {visibleGroups.length === 0 && (
                <div className="text-center text-sm text-slate-500 py-16">Nothing here right now.</div>
              )}

              {visibleGroups.map(({ group, list }) => {
                const meta = DOCTOR_NOTIF_GROUPS[group];
                return (
                  <section key={group}>
                    <div className="px-1 mb-2">
                      <h3 className={`text-[11px] font-bold uppercase tracking-wider ${group === 'urgent' ? 'text-red-600' : 'text-slate-500'}`}>
                        {meta.label}
                      </h3>
                      {meta.hint && <p className="text-[10px] text-slate-400 mt-0.5">{meta.hint}</p>}
                    </div>

                    <div className="space-y-2">
                      {list.map((n) => (
                        <NotificationCard key={n.id} n={n} onOpen={() => goTo(n)} onMarkRead={() => markRead(n.id)} />
                      ))}
                    </div>
                  </section>
                );
              })}

              {/* The rule, restated where the doctor acts */}
              <div className="flex items-start gap-2 rounded-2xl bg-indigo-50/60 border border-indigo-100 p-3">
                <Sparkles className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
                <p className="text-[11px] text-indigo-950 leading-relaxed">
                  Ritu only drafts and flags. Nothing reaches the patient or changes her plan until you approve it.
                </p>
              </div>
            </div>

            {/* Delivery settings */}
            <div className="border-t border-slate-100 bg-white px-5 py-3 space-y-2.5">
              <SettingRow
                icon={Siren}
                label="Urgent alerts: instant, always"
                sub="Red-flag cases can’t be muted"
                locked
              />
              <SettingRow
                icon={CalendarClock}
                label="Batch everything else"
                sub="Digest at 8 AM and 2 PM, before OPD"
                checked={digest}
                onChange={setDigest}
              />
              <SettingRow
                icon={ShieldCheck}
                label="Hide patient names on lock screen"
                sub="Shows “1 urgent case” instead of the name"
                checked={hideNames}
                onChange={setHideNames}
              />
            </div>
          </aside>
        </div>,
        document.body
      )}
    </>
  );
}

function NotificationCard({
  n,
  onOpen,
  onMarkRead,
}: {
  n: DoctorNotification;
  onOpen: () => void;
  onMarkRead: () => void;
}) {
  const s = GROUP_STYLE[n.group];
  const Icon = s.icon;
  return (
    <article
      className={`relative rounded-2xl border border-l-4 ${s.stripe} p-3.5 transition ${
        n.unread ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/60 border-slate-100'
      }`}
    >
      <div className="flex gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.iconBox}`}>
          <Icon className="w-4 h-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-slate-500 truncate">{n.patientName}</span>
            <span className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] text-slate-400">{n.time}</span>
              {n.unread && <span className="w-2 h-2 rounded-full bg-brand-pink" aria-label="Unread" />}
            </span>
          </div>

          <h4 className={`text-[13px] leading-snug mt-0.5 ${n.unread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
            {n.title}
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.detail}</p>

          {n.why && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${SOURCE_STYLE[n.source]}`}>{n.source}</span>
              <span className="text-[10px] text-slate-500">{n.why}</span>
            </div>
          )}

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={onOpen}
              className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold shadow-xs transition ${s.button}`}
            >
              {n.primaryLabel}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            {n.unread && (
              <button
                type="button"
                onClick={onMarkRead}
                className="rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 transition"
              >
                Mark read
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function SettingRow({
  icon: Icon,
  label,
  sub,
  checked,
  onChange,
  locked,
}: {
  icon: React.ElementType;
  label: string;
  sub: string;
  checked?: boolean;
  onChange?: (v: boolean) => void;
  locked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon className="w-4 h-4 text-slate-400 shrink-0" />
        <div className="min-w-0">
          <div className="text-xs font-semibold text-slate-800">{label}</div>
          <div className="text-[10px] text-slate-500">{sub}</div>
        </div>
      </div>
      {locked ? (
        <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-label="Always on" />
      ) : (
        <button
          type="button"
          role="switch"
          aria-checked={!!checked}
          aria-label={label}
          onClick={() => onChange?.(!checked)}
          className={`relative w-9 h-5 rounded-full transition shrink-0 ${checked ? 'bg-brand-purple' : 'bg-slate-300'}`}
        >
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${checked ? 'left-[18px]' : 'left-0.5'}`} />
        </button>
      )}
    </div>
  );
}
