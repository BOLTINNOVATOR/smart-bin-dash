import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Home } from '@/pages/Home';
import { Demo } from '@/pages/Demo';
import { Citizen } from '@/pages/Citizen';
import { Admin } from '@/pages/Admin';

export default function Index() {
  const { currentPage } = useAppStore();

  const renderPage = () => {
    switch (currentPage) {
      case '/':
        return <Home />;
      case '/demo':
        return <Demo />;
      case '/citizen':
        return <Citizen />;
      case '/collector':
        return <div className="min-h-screen py-8 px-4 text-center"><h1 className="text-3xl">Collector App - Coming Soon</h1></div>;
      case '/admin':
        return <Admin />;
      case '/docs':
        return <div className="min-h-screen py-8 px-4 text-center"><h1 className="text-3xl">API Documentation - Coming Soon</h1></div>;
      case '/about':
        return <div className="min-h-screen py-8 px-4 text-center"><h1 className="text-3xl">About - Coming Soon</h1></div>;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}
