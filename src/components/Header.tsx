import React from 'react';
import { BookOpen, Trophy, GraduationCap, Library, LogOut } from 'lucide-react';

interface HeaderProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  onLogout?: () => void;
}

export function Header({ activeModule, setActiveModule, onLogout }: HeaderProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Trophy },
    { id: 'aprende', label: 'Aprende', icon: BookOpen },
    { id: 'practica', label: 'Practica', icon: GraduationCap },
    { id: 'recursos', label: 'Recursos', icon: Library },
  ];

  return (
    <header className="bg-white border-b" style={{ borderColor: '#E2E8F0' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3B82F6' }}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl" style={{ color: '#1E293B', fontWeight: 700 }}>
              Agile Academy
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                  style={{
                    color: isActive ? '#3B82F6' : '#1E293B',
                    fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive ? '#F1F5F9' : 'transparent',
                  }}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: '#F1F5F9' }}>
              <Trophy className="w-5 h-5" style={{ color: '#F59E0B' }} />
              <span style={{ color: '#1E293B', fontWeight: 600 }}>1,250 pts</span>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-red-50"
                style={{ color: '#64748B' }}
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden lg:inline">Salir</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <nav className="md:hidden flex gap-1 pb-3 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                style={{
                  color: isActive ? '#3B82F6' : '#1E293B',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? '#F1F5F9' : 'transparent',
                }}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
