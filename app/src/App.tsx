import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { HobbiesSection } from './components/HobbiesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ContactSection } from './components/ContactSection';
import { AIAssistant } from './components/AIAssistant';

function App() {
  return (
    <main className="bg-bg text-text">
      <Hero />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <HobbiesSection />
      <ProjectsSection />
      <ContactSection />
      <AIAssistant />
    </main>
  );
}

export default App;
