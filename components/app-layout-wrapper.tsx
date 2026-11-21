'use client';

import React, { useEffect } from 'react';
import { usePathname } from '@/navigation';
import { BottomNav } from '@/components/bottom-nav';
import { usePersona } from '@/components/persona-context';

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Match /doctor exactly (not the patient-side /doctors page).
  const isDoctorPortal = /^\/doctor(\/|$)/.test(pathname);
  const { currentPersona, setPersonaType } = usePersona();

  // Keep the persona switcher in step with the page being viewed.
  useEffect(() => {
    const wanted = isDoctorPortal ? 'doctor' : 'patient';
    if (currentPersona.type !== wanted) setPersonaType(wanted);
  }, [isDoctorPortal, currentPersona.type, setPersonaType]);

  if (isDoctorPortal) {
    return (
      <main className="flex-1 pb-16 pt-0 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
        {children}
      </main>
    );
  }

  return (
    <>
      <main className="flex-1 pb-24 pt-1">
        <div className="mx-auto max-w-md sm:max-w-lg px-3.5 sm:px-4">
          {children}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
