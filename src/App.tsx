/**
 * @file: App.tsx
 * @description: Main application component that orchestrates the application layout,
 *               authentication flow, WebSocket connections, and routing.
 *
 * @components:
 *   - MainApp: Root application component
 *   - MainContent: Content area with routing outlet
 * @dependencies:
 *   - React: useEffect and core functionality
 *   - antd: Layout components
 *   - react-router-dom: Routing (Outlet, useLocation)
 *   - Multiple contexts: AuthContext, NavigationContext, BalanceContext
 *   - Services: oauthService, balanceService
 *   - Components: Navigation, Header
 * @usage:
 *   // In main.tsx or index.tsx
 *   <BrowserRouter>
 *     <AppProviders>
 *       <MainApp />
 *     </AppProviders>
 *   </BrowserRouter>
 *
 * @architecture: Component composition with hooks for state management
 * @relationships:
 *   - Parent: Root of the application tree
 *   - Children: Header, MainContent (which contains Outlet for routes)
 *   - Uses: Multiple contexts and services for auth, navigation, and data
 * @dataFlow:
 *   - Authentication: Manages auth flow with WebSocket and OAuth
 *   - Balance: Retrieves and displays balance data from SSE or context
 *   - Navigation: Syncs URL with active tab state
 *
 * @ai-hints: This component serves as the application shell and coordinates
 *            multiple data sources (WebSocket, SSE, contexts). It handles
 *            authentication state and initializes core connections.
 */
import { useEffect } from "react";
import { Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import { oauthService } from "./services/oauth/oauthService";
import { useWebSocket } from "./hooks/useWebSocket";
import { useAuth } from "./contexts/AuthContext";
import { useNavigation } from "./contexts/NavigationContext";
import { useBalance } from "./contexts/BalanceContext";
import { useBalanceSSE } from "./hooks/useBalanceSSE";
import { balanceService } from "./services/balance/balanceService";
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
  const { balanceData } = useBalance();
  
  // Initialize balance SSE connection and get the connection status
  const { balanceData: sseBalanceData } = useBalanceSSE();

  const accountType = "Real";
  
  // Prefer SSE balance data if available, otherwise fall back to context data
  const effectiveBalanceData = sseBalanceData || balanceData;
  
  const balance = balanceService.formatBalance(effectiveBalanceData?.balance || "0.00");
  const currency = effectiveBalanceData?.currency || "USD";
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
          isLoggedIn={true}
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