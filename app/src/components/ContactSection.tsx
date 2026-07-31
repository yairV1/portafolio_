import { motion } from 'framer-motion';
import { Mail, FileText } from 'lucide-react';
import { profile } from '../data/content';
import { asset } from '../lib/asset';
import { GithubIcon } from './icons/GithubIcon';
import { LinkedinIcon } from './icons/LinkedinIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const contactMethods = [
  { href: `mailto:${profile.email}`, label: 'Email', Icon: Mail, primary: true },
  { href: profile.whatsapp, label: 'WhatsApp', Icon: WhatsAppIcon, primary: false },
  { href: profile.linkedin, label: 'LinkedIn', Icon: LinkedinIcon, primary: false },
];

const footerLinks = [
  { href: profile.github, label: 'GitHub', Icon: GithubIcon },
  { href: profile.linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
  { href: profile.whatsapp, label: 'WhatsApp', Icon: WhatsAppIcon },
];

export function ContactSection() {
  return (
    <>
      <section
        id="contacto"
        data-nav-label="Contacto"
        className="relative mx-auto w-full max-w-4xl overflow-hidden px-6 py-28 text-center md:px-12"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 50% at 50% 40%, rgba(168,85,247,0.14), transparent 65%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
          className="relative z-10"
        >
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-text md:text-5xl">
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-text-muted">
            Hablemos de cómo puedo ayudarte a llevarlo a cabo. Respondo en menos de 24 horas.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {contactMethods.map(({ href, label, Icon, primary }) => (
              <a
                key={label}
                href={href}
                target={label === 'Email' ? undefined : '_blank'}
                rel={label === 'Email' ? undefined : 'noopener noreferrer'}
                className={
                  primary
                    ? 'inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-white shadow-[0_8px_24px_rgba(168,85,247,0.35)] transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-accent-2'
                    : 'inline-flex items-center gap-2 rounded-xl border border-border-strong px-6 py-3 font-semibold text-text transition-colors duration-300 hover:border-accent hover:text-accent'
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
            <a
              href={asset(profile.cv)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border-strong px-6 py-3 font-semibold text-text transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              <FileText className="h-4 w-4" />
              Hoja de Vida
            </a>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-border px-6 py-10 text-center">
        <div className="mb-5 flex items-center justify-center gap-4">
          {footerLinks.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          ))}
        </div>
        <p className="text-sm text-text-dim">
          © {new Date().getFullYear()} {profile.name}. Construido con pasión y código limpio.
        </p>
      </footer>
    </>
  );
}
