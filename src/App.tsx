import { useEffect } from "react";
import { Layout, Row, Col } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { oauthService } from "./services/oauth/oauthService";
import { useWebSocket } from "./hooks/useWebSocket";
import { useAuth } from "./contexts/AuthContext";
import { useNavigation } from "./contexts/NavigationContext";
import { AuthorizeResponse } from "./types/auth";
import { StrategyList } from "./components/StrategyList";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { Settings } from "./components/Settings";
import Positions from "./components/Positions";
import { ConfigEndpoint } from "./components/ConfigEndpoint";

import "./styles/App.scss";

const { Content } = Layout;

function MainContent() {
  const { activeTab } = useNavigation();

  const renderContent = () => {
    switch (activeTab) {
      case "strategies":
        return <StrategyList />;
      case "trade-logs":
        return <Positions />;
      case "templates":
        return <div>Templates (Coming Soon)</div>;
      case "settings":
        return <Settings />;
      default:
        return <StrategyList />;
    }
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={24} md={6} lg={5} xl={4}>
        <Navigation />
      </Col>
      <Col xs={24} md={18} lg={19} xl={20}>
        {renderContent()}
      </Col>
    </Row>
  );
}

function MainApp() {
  const { authParams, setAuthParams, authorizeResponse, setAuthorizeResponse } =
    useAuth();

  const { send, isConnected, connect } = useWebSocket<AuthorizeResponse>({
    onMessage: (response) => {
      if (response.msg_type === "authorize" && response.authorize) {
        setAuthorizeResponse({
          msg_type: "authorize",
          authorize: response.authorize,
        });
      }
    },
    autoConnect: false,
  });

  useEffect(() => {
    const params = oauthService.getAuthParams();
    if (params) {
      setAuthParams(params);
    }
  }, [setAuthParams]);

  useEffect(() => {
    if (authParams?.token1) {
      connect();
    }
  }, [authParams, connect]);

  useEffect(() => {
    if (authParams?.token1 && isConnected) {
      send({ authorize: authParams.token1 });
    }
  }, [authParams, isConnected, send]);

  const handleLogin = () => {
    setAuthParams(null);
    setAuthorizeResponse(null);
    oauthService.initiateLogin();
  };

  const handleLogout = () => {
    setAuthParams(null);
    setAuthorizeResponse(null);
  };

  const isLoggedIn = !!authorizeResponse?.authorize;

  return (
    <Layout className="app-layout">
      <Header
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <Content className="app-main">
        <MainContent />
      </Content>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/endpoint" element={<ConfigEndpoint />} />
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

export default App;