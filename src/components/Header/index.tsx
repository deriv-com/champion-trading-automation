/**
 * @file: Header/index.tsx
 * @description: Application header component that displays authentication state,
 *               account information, and provides login/deposit functionality.
 *
 * @components: Header - Main header component with conditional rendering based on auth state
 * @dependencies:
 *   - antd: Button, Space components
 *   - assets/favicon.svg: Logo image
 *   - styles.scss: Component styling
 * @usage:
 *   <Header
 *     isLoggedIn={true}
 *     accountType="Real"
 *     balance="1000.00"
 *     currency="USD"
 *     onDepositClick={() => {}}
 *   />
 *
 * @architecture: Presentational component with conditional rendering
 * @relationships:
 *   - Used by: App.tsx
 *   - Related to: AccountHeader component
 * @dataFlow: Receives auth state and account data as props, triggers login/deposit actions
 *
 * @ai-hints: This component uses conditional rendering based on isLoggedIn prop
 *            to display different UI states. The component is purely presentational
 *            and doesn't manage its own state.
 */
import { Button, Space } from "antd";
import DerivLogo from "../../assets/favicon.svg";
import "./styles.scss";

interface HeaderProps {
  isLoggedIn?: boolean;
  onLogin?: () => void;
  accountType?: string;
  balance?: string;
  currency?: string;
  onDepositClick?: () => void;
}

export function Header({
  isLoggedIn = false,
  onLogin,
  accountType,
  balance,
  currency,
  onDepositClick,
}: HeaderProps) {
  return (
    <header className="app-header">
      {!isLoggedIn ? (
        // Not logged in - show logo and login button
        <>
          <div className="app-header__logo-section">
            <img
              src={DerivLogo}
              alt="Deriv Logo"
              className="app-header__logo"
            />
          </div>
          <Space>
            {onLogin && (
              <Button 
                type="default"
                onClick={onLogin}
                className="app-header__deposit-btn"
              >
                Log in
              </Button>
            )}
          </Space>
        </>
      ) : (
        <>
          <div className="app-header__user-section">
            <div className="app-header__logo-section">
              <img
                src={DerivLogo}
                alt="Deriv Logo"
                className="app-header__logo"
              />
            </div>
            <div className="app-header__account-info">
              <div className="app-header__account-type">{accountType}</div>
              <div className="app-header__account-balance">
                {balance} {currency}
              </div>
            </div>
          </div>
          <Space>
            {onDepositClick && (
              <Button
                type="default"
                className="app-header__deposit-btn"
                onClick={onDepositClick}
              >
                Deposit
              </Button>
            )}
          </Space>
        </>
      )}
    </header>
  );
}
