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
          <div className="app-header__account-info">
            <div className="app-header__account-type">{accountType}</div>
            <div className="app-header__account-balance">
              {balance} {currency}
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
