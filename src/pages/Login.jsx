import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Lock, User, Mail, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label.jsx';
import { useToast } from '../components/ui/use-toast';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // API endpoint - अपने actual backend URL से replace करें
  const API_URL = 'http://localhost:5000/api/auth/login'; // या आपका live backend URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Login successful
        localStorage.setItem('ksev_auth', 'true');
        localStorage.setItem('ksev_user', JSON.stringify(data.user));
        localStorage.setItem('ksev_token', data.token || 'authenticated');
        
        toast({
          title: "Login Successful! 🎉",
          description: `Welcome back, ${data.user.name}!`,
        });
        onLogin();
      } else {
        // Login failed
        toast({
          title: "Login Failed",
          description: data.message || "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Network Error",
        description: "Unable to connect to server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Demo login के लिए (optional - अगर चाहें तो हटा सकते हैं)
  const handleDemoLogin = () => {
    setEmail('demo@example.com');
    setPassword('1234567890');
  };

  return (
    <>
      <Helmet>
        <title>Login - KSEV Admin Panel</title>
        <meta name="description" content="Secure login to KSEV Company admin dashboard" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 via-purple-600 to-sky-500">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 mx-auto mb-4 rounded-full gradient-bg flex items-center justify-center"
              >
                <Lock className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold gradient-text mb-2">KSEV Admin Panel</h1>
              <p className="text-gray-600">Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password (Contact Number)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your contact number"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Enter your registered contact number as password
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full gradient-bg text-white hover:opacity-90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Demo button (optional) */}
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleDemoLogin}
                disabled={loading}
              >
                Fill Demo Credentials
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-500">
                  Use your registered email and contact number
                </p>
                <p className="text-xs text-gray-400">
                  Contact admin if you forgot your credentials
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;