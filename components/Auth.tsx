import React, { useState } from 'react';
import { Card } from './common/Card';

interface AuthProps {
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  // Simple handler for both login and registration success
  const handleAuthSuccess = () => {
    // In a real app, you would handle tokens etc.
    // Here we just notify the parent component.
    onLoginSuccess();
  };

  return (
    <div className="bg-light min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary">Cuidar+</h1>
            <p className="text-gray-600">Seu assistente de saúde pessoal.</p>
        </div>

        <Card>
          {isLoginView ? (
            // Login View
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-primary">Login</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleAuthSuccess(); }} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="password"
                  placeholder="Senha"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  Entrar
                </button>
              </form>
              <p className="text-center text-sm">
                Não tem uma conta?{' '}
                <button onClick={() => setIsLoginView(false)} className="font-semibold text-primary hover:underline">
                  Cadastre-se
                </button>
              </p>
            </div>
          ) : (
            // Register View
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-primary">Cadastro</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleAuthSuccess(); }} className="space-y-4">
                 <input
                  type="text"
                  placeholder="Nome Completo"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="password"
                  placeholder="Senha"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  Criar Conta
                </button>
              </form>
              <p className="text-center text-sm">
                Já tem uma conta?{' '}
                <button onClick={() => setIsLoginView(true)} className="font-semibold text-primary hover:underline">
                  Faça Login
                </button>
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Auth;
