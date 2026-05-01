import HeroSplit from '@/components/dom/HeroSplit';
import Marquee from '@/components/dom/Marquee';
import AboutSplit from '@/components/dom/AboutSplit';
import ProjectsCompile from '@/components/dom/ProjectsCompile';
import SkillsConnect from '@/components/dom/SkillsConnect';
import ExperienceCommits from '@/components/dom/ExperienceCommits';
import ContactTerminal from '@/components/dom/ContactTerminal';

export default function Home() {
  return (
    <main className="relative w-full text-white bg-[var(--background)]">
      <HeroSplit />
      <Marquee />
      <AboutSplit />
      <ProjectsCompile />
      <SkillsConnect />
      <ExperienceCommits />
      <ContactTerminal />
    </main>
  );
}
