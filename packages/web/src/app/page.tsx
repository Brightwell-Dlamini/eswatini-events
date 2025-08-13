import Categories from '@/components/landing/Categories_landing';
import ExperienceSection from '@/components/landing/ExperienceSection';
import FeaturedEvents from '@/components/landing/FeaturedEvents';
import Footer from '@/components/landing/Footer';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Navbar from '@/components/landing/Navbar';
import UpcomingHighlights from '@/components/landing/UpcomingHighlights';
import OrganizerCTA from '@/components/organizer/OrginizerCTA';

import Head from 'next/head';
export default function Home() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>
          Eswatini Events | Discover & Book Tickets for Local Events
        </title>
        <meta
          name="description"
          content="Discover and book tickets for the most exciting events in Eswatini"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#111827"
          media="(prefers-color-scheme: dark)"
        />
      </Head>

      <Navbar />

      <main>
        <Hero />
        <HowItWorks />
        <Categories />
        <UpcomingHighlights />
        <ExperienceSection />
        <FeaturedEvents />
        <OrganizerCTA />
      </main>

      <Footer />
    </div>
  );
}
