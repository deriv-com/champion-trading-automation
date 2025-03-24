/**
 * @file: LoginPage.tsx
 * @description: Simple login page component that accepts any credentials
 *               and sets the authentication state without external validation.
 *
 * @components: LoginPage - Form with username and password fields
 * @dependencies:
 *   - React: useState for form state
 *   - antd: Form, Input, Button components for UI
 *   - useAuth: For authentication state management
 *   - useNavigate: For redirection after login
 * @usage:
 *   // In router configuration
 *   <Route path="/login" element={<LoginPage />} />
 *
 * @architecture: Presentational component with local form state
 * @relationships:
 *   - Used by: Router
 *   - Uses: AuthContext for authentication state
 * @dataFlow: Captures form input, updates auth state, redirects user
 */
import { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Alert, ConfigProvider, theme as antdTheme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '../styles/login.scss';

const { Title } = Typography;

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const { setAuthParams, setAuthorizeResponse } = useAuth();
  const { effectiveTheme } = useTheme();
  const navigate = useNavigate();

  // Animation effect when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setFormVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (values: { username: string; password: string }) => {
    setLoading(true);
    setError(null);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // Generate mock auth response - accepts any credentials
        const mockAuthParams = {
          token1: 'mock-token-123456',
          loginid: values.username,
        };
        
        const mockAuthorizeResponse = {
          msg_type: 'authorize' as 'authorize',
          authorize: {
            email: `${values.username}@example.com`,
            currency: 'USD',
            balance: 10000,
            loginid: values.username,
            fullname: `${values.username} User`,
            token1: 'mock-token-123456',
            account_list: [
              {
                loginid: values.username,
                currency: 'USD',
                balance: 10000,
              }
            ]
          }
        };
        
        // Update auth state
        setAuthParams(mockAuthParams);
        setAuthorizeResponse(mockAuthorizeResponse);
        
        // Redirect to home page
        navigate('/');
      } catch (err) {
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: effectiveTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff' as string,
          borderRadius: 6,
        } as any,
      }}
    >
      <div className={`login-page ${effectiveTheme}`}>
        <div 
          className="login-container"
          style={{ 
            opacity: formVisible ? 1 : 0, 
            transform: formVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease-in-out'
          }}
        >
          <div className="login-logo">
            <img src="/src/assets/favicon.svg" alt="Champion Trading Logo" />
          </div>
          
          <Title level={2} className="login-title">
            Champion Trading
          </Title>
          
          {error && (
            <Alert
              message="Login Error"
              description={error}
              type="error"
              showIcon
              className="login-error"
            />
          )}
          
          <Form
            name="login"
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            className="login-form"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please enter your username' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Username" 
                autoFocus
              />
            </Form.Item>
            
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Password" 
              />
            </Form.Item>
            
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="login-button"
                block
              >
                {loading ? 'Logging in...' : 'Log in'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </ConfigProvider>
  );
}