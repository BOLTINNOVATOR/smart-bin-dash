import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ContactSection = () => {
  const teamMembers = [
    {
      name: 'Alex Thompson',
      role: 'Project Lead',
      email: 'alex@boltinnovators.com',
      icon: '👨‍💼'
    },
    {
      name: 'Sarah Chen',
      role: 'IoT Engineer',
      email: 'sarah@boltinnovators.com',
      icon: '👩‍🔧'
    },
    {
      name: 'Michael Rodriguez',
      role: 'ML Specialist',
      email: 'michael@boltinnovators.com',
      icon: '👨‍💻'
    },
    {
      name: 'Emily Johnson',
      role: 'UI/UX Designer',
      email: 'emily@boltinnovators.com',
      icon: '👩‍🎨'
    }
  ];

  const supportCategories = [
    {
      title: 'Device Issues',
      description: 'Hardware problems, connectivity issues',
      icon: '🔧',
      contact: 'support@boltinnovators.com'
    },
    {
      title: 'App Support',
      description: 'Dashboard problems, account issues',
      icon: '📱',
      contact: 'app-support@boltinnovators.com'
    },
    {
      title: 'Technical Support',
      description: 'Setup, configuration, troubleshooting',
      icon: '💻',
      contact: 'tech@boltinnovators.com'
    },
    {
      title: 'General Inquiries',
      description: 'Questions, feedback, partnerships',
      icon: '💬',
      contact: 'hello@boltinnovators.com'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-2">
          📞 Contact & Support
        </h2>
        <p className="text-[hsl(var(--muted-foreground))]">
          Get help from our team or learn more about Bolt Innovators
        </p>
      </div>

      {/* Company Info */}
      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl">⚡</span>
            <CardTitle className="text-2xl text-[hsl(var(--foreground))]">
              Bolt Innovators
            </CardTitle>
          </div>
          <p className="text-[hsl(var(--muted-foreground))]">
            Smart Waste Segregation and Recycling System
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-2xl">📍</div>
              <div className="font-semibold">Address</div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]">
                123 Innovation Drive<br />
                Tech City, TC 12345
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl">📞</div>
              <div className="font-semibold">Phone</div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]">
                +1 (555) 123-4567
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl">✉️</div>
              <div className="font-semibold">Email</div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]">
                info@boltinnovators.com
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {supportCategories.map((category, index) => (
          <Card key={index} className="shadow-[var(--shadow-soft)] hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">{category.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2">
                    {category.title}
                  </h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
                    {category.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => window.location.href = `mailto:${category.contact}`}
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Members */}
      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[hsl(var(--foreground))]">
            👥 Meet Our Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="text-4xl">{member.icon}</div>
                <div>
                  <div className="font-semibold text-[hsl(var(--foreground))]">
                    {member.name}
                  </div>
                  <div className="text-sm text-[hsl(var(--eco-green))] font-medium">
                    {member.role}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-xs"
                  onClick={() => window.location.href = `mailto:${member.email}`}
                >
                  {member.email}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[hsl(var(--foreground))]">
            ❓ Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                q: 'How does the smart bin classify waste?',
                a: 'Our IoT device uses advanced sensors and machine learning to automatically identify and sort organic, recyclable, and hazardous waste materials.'
              },
              {
                q: 'How do I earn points?',
                a: 'You earn points automatically when you dispose of waste properly. The more you recycle and the better you sort, the more points you earn!'
              },
              {
                q: 'What rewards can I redeem?',
                a: 'You can redeem gift cards, eco-friendly products, device upgrades, and green technology items using your accumulated points.'
              },
              {
                q: 'Is my data secure?',
                a: 'Yes, we use industry-standard encryption and privacy practices to protect all your personal and usage data.'
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-[hsl(var(--border))] pb-4 last:border-b-0">
                <div className="font-semibold text-[hsl(var(--foreground))] mb-2">
                  {faq.q}
                </div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="shadow-[var(--shadow-soft)] border-[hsl(var(--eco-warning))] bg-[hsl(var(--eco-warning))] bg-opacity-5">
        <CardContent className="p-6 text-center">
          <div className="text-2xl mb-2">🚨</div>
          <div className="font-semibold text-[hsl(var(--foreground))] mb-2">
            Emergency Support
          </div>
          <div className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
            For urgent device malfunctions or safety concerns
          </div>
          <Button 
            className="bg-[hsl(var(--eco-warning))] text-black hover:bg-[hsl(var(--eco-warning))] hover:opacity-90"
            onClick={() => window.location.href = 'tel:+15551234567'}
          >
            📞 Call Emergency Line
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactSection;