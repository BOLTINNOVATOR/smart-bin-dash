import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { Menu, X, Globe, User, LogIn, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header = () => {
  const { user, language, toggleLanguage, setUser, setCurrentPage } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Demo', href: '/demo', icon: '🤖' },
    { name: 'Citizen Portal', href: '/citizen', icon: '👤' },
    { name: 'Collector App', href: '/collector', icon: '🚛' },
    { name: 'Admin Dashboard', href: '/admin', icon: '📊' },
    { name: 'API Docs', href: '/docs', icon: '📚' },
    { name: 'About', href: '/about', icon: 'ℹ️' },
  ];

  const handleNavClick = (href: string) => {
    setCurrentPage(href);
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    // Mock login for demo
    setUser({
      id: 'user-1',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      role: 'citizen',
      ward: 'Ward 12',
      society: 'Green Valley Society',
      points: 285
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl">⚡</div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Bolt Innovator
              </h1>
              <p className="text-xs text-muted-foreground">
                Smart Waste Management
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                size="sm"
                onClick={() => handleNavClick(item.href)}
                className="flex items-center gap-2 transition-all duration-200"
              >
                <span>{item.icon}</span>
                {item.name}
              </Button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'EN' : 'हि'}
            </Button>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.points} points
                  </div>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {user.role}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleLogin}
                className="flex items-center gap-2"
                size="sm"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="lg:hidden border-t bg-card"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavClick(item.href)}
                  className="justify-start gap-2"
                >
                  <span>{item.icon}</span>
                  {item.name}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};