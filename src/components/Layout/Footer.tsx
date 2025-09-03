import { useAppStore } from '@/store/useAppStore';

export const Footer = () => {
  const { language } = useAppStore();

  const content = {
    en: {
      tagline: "Building cleaner, greener cities through smart waste management",
      compliance: "Compliant with Solid Waste Management Rules, 2016",
      team: "Team Bolt Innovator",
      sih: "Smart India Hackathon 2024",
      links: {
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        contact: "Contact Us",
        support: "Support"
      }
    },
    hi: {
      tagline: "स्मार्ट अपशिष्ट प्रबंधन के माध्यम से स्वच्छ, हरित शहर बनाना",
      compliance: "ठोस अपशिष्ट प्रबंधन नियम, 2016 के अनुपालन में",
      team: "टीम बोल्ट इनोवेटर",
      sih: "स्मार्ट इंडिया हैकथॉन 2024",
      links: {
        privacy: "गोपनीयता नीति",
        terms: "सेवा की शर्तें",
        contact: "संपर्क करें",
        support: "सहायता"
      }
    }
  };

  const t = content[language];

  return (
    <footer className="border-t bg-card/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⚡</span>
              <span className="font-bold text-lg">Bolt Innovator</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.tagline}
            </p>
            <div className="text-xs text-muted-foreground">
              <div>{t.compliance}</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <div className="text-muted-foreground hover:text-foreground cursor-pointer">
                Smart Bin Demo
              </div>
              <div className="text-muted-foreground hover:text-foreground cursor-pointer">
                Waste Guidelines
              </div>
              <div className="text-muted-foreground hover:text-foreground cursor-pointer">
                API Documentation
              </div>
              <div className="text-muted-foreground hover:text-foreground cursor-pointer">
                Open Data
              </div>
            </div>
          </div>

          {/* Waste Categories */}
          <div className="space-y-3">
            <h3 className="font-semibold">Waste Categories</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[hsl(var(--wet-waste))]"></div>
                <span className="text-muted-foreground">Wet (Organic)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[hsl(var(--dry-waste))]"></div>
                <span className="text-muted-foreground">Dry (Recyclable)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[hsl(var(--hazardous-waste))]"></div>
                <span className="text-muted-foreground">Hazardous</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="font-semibold">Support</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>{t.links.privacy}</div>
              <div>{t.links.terms}</div>
              <div>{t.links.contact}</div>
              <div>{t.links.support}</div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <div>© 2024 {t.team}. All rights reserved.</div>
            <div className="mt-2 sm:mt-0">{t.sih}</div>
          </div>
        </div>
      </div>
    </footer>
  );
};