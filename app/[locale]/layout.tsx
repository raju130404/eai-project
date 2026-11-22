import '../globals.css';
import { notFound } from 'next/navigation';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { locales } from '@/i18n';
import { Navbar } from '@/components/navbar';
import { PersonaProvider } from '@/components/persona-context';
import { AppLayoutWrapper } from '@/components/app-layout-wrapper';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <body className="flex min-h-full flex-col bg-[#FAF4F0] font-body text-[#361118] antialiased selection:bg-[#FCEEEB] selection:text-[#7A1D2E]">
        <PersonaProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {/* Top Bar Navigation */}
            <Navbar />

            {/* Responsive Layout Canvas & Conditional Navigation */}
            <AppLayoutWrapper>{children}</AppLayoutWrapper>
          </NextIntlClientProvider>
        </PersonaProvider>
      </body>
    </html>
  );
}
