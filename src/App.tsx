import { useEffect } from "react";
import { Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import { oauthService } from "./services/oauth/oauthService";
import { useWebSocket } from "./hooks/useWebSocket";
import { useAuth } from "./contexts/AuthContext";
import { useNavigation } from "./contexts/NavigationContext";
import { AuthorizeResponse } from "./types/auth";
import { Navigation } from "./components/Navigation";
import { Header } from "./components/Header";
import { pathToTab } from "./router";

import "./styles/App.scss";

const { Content } = Layout;

/**
 * MainContent: Renders the main content area with routing outlet and navigation.
 * Inputs: None
 * Output: JSX.Element - Content container with Outlet for routes and Navigation component
 */
function MainContent() {
  const location = useLocation();
  const { setActiveTab } = useNavigation();

  // Sync the active tab with the current URL
  useEffect(() => {
    const tab = pathToTab[location.pathname] || pathToTab["/"];
    setActiveTab(tab as "discover" | "bots" | "positions" | "menu");
  }, [location.pathname, setActiveTab]);

  return (
    <div className="app-content">
      <Outlet />
      <Navigation />
    </div>
  );
}
/**
 * MainApp: Main application component that handles authentication flow and WebSocket connection.
 * Inputs: None
 * Output: JSX.Element - Application layout with AccountHeader and MainContent components
 */
function MainApp() {
  const { authParams, setAuthParams, setAuthorizeResponse } = useAuth();


  const accountType = "Real";
  const balance = "10,000.00";
  const currency = "USD";
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
  /**
   * handleDepositClick: Handles user deposit button click action.
   * Inputs: None
   * Output: void - Currently logs the action to console
   */
  const handleDepositClick = () => {
    // Handle deposit action
    console.log("Deposit clicked");
  };
  return (
    <Layout className="app-layout">
      <Content className="app-main">
        <Header
          isLoggedIn={!!authParams?.token1}
          onLogin={() => oauthService.initiateLogin()}
          accountType={accountType}
          balance={balance}
          currency={currency}
          onDepositClick={handleDepositClick}
        />
        <MainContent />
      </Content>
    </Layout>
  );
}

export default MainApp;
