import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { Link } from 'react-router-dom';
import { configService } from '../../services/config/configService';
import './styles.scss';

export function ConfigEndpoint() {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  
  // Load current configuration values
  useEffect(() => {
    const config = configService.getConfig();
    form.setFieldsValue({
      oauthAppId: config.oauthAppId,
      oauthUrl: config.oauthUrl,
      wsUrl: config.wsUrl,
      authUrl: config.authUrl,
      derivUrl: config.derivUrl,
    });
  }, [form]);
  
  // Handle form submission
  const handleSubmit = (values: any) => {
    setIsLoading(true);
    
    try {
      // Save each value to the configuration service
      Object.entries(values).forEach(([key, value]) => {
        configService.setValue(key as any, value as string);
      });
      
      message.success('Configuration saved successfully');
    } catch (error) {
      console.error('Error saving configuration:', error);
      message.error('Failed to save configuration');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle reset to defaults
  const handleReset = () => {
    setIsLoading(true);
    
    try {
      // Clear all overrides
      configService.clearOverrides();
      
      // Reset form with default values
      const defaults = configService.getDefaults();
      form.setFieldsValue(defaults);
      
      message.success('Configuration reset to defaults');
    } catch (error) {
      console.error('Error resetting configuration:', error);
      message.error('Failed to reset configuration');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="config-endpoint">
      <Card className="config-endpoint__card">
        <div className="config-endpoint__header">
          <h1 className="config-endpoint__title">Authentication Configuration</h1>
          <Link to="/" className="config-endpoint__home-link">Back to Home</Link>
        </div>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="config-endpoint__form"
        >
          <Form.Item
            label="OAuth App ID"
            name="oauthAppId"
            rules={[{ required: true, message: 'Please enter the OAuth App ID' }]}
          >
            <Input placeholder="e.g., 9999" />
          </Form.Item>
          
          <Form.Item
            label="OAuth URL"
            name="oauthUrl"
            rules={[{ required: true, message: 'Please enter the OAuth URL' }]}
          >
            <Input placeholder="e.g., https://qa10.deriv.dev/oauth2/authorize" />
          </Form.Item>
          
          <Form.Item
            label="WebSocket URL"
            name="wsUrl"
            rules={[{ required: true, message: 'Please enter the WebSocket URL' }]}
          >
            <Input placeholder="e.g., wss://qa10.deriv.dev/websockets/v3" />
          </Form.Item>
          
          <Form.Item
            label="Auth URL"
            name="authUrl"
            rules={[{ required: true, message: 'Please enter the Auth URL' }]}
          >
            <Input placeholder="e.g., https://qa10.deriv.dev/websockets/authorize?app_id=9999&l=en&brand=deriv" />
          </Form.Item>
          
          <Form.Item
            label="Deriv URL"
            name="derivUrl"
            rules={[{ required: true, message: 'Please enter the Deriv URL' }]}
          >
            <Input placeholder="e.g., wss://qa10.deriv.dev/websockets/v3?app_id=9999&l=en&brand=deriv" />
          </Form.Item>
          
          <div className="config-endpoint__actions">
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              size="large"
              className="config-endpoint__save-button"
            >
              Save Configuration
            </Button>
            <Button
              onClick={handleReset}
              loading={isLoading}
              size="large"
              className="config-endpoint__reset-button"
            >
              Reset to Defaults
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
