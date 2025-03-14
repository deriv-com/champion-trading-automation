# Balance Stream Service

This service provides real-time balance updates via Server-Sent Events (SSE) from the endpoint `https://mock.mobile-bot.deriv.dev/v1/accounting/balance/stream`.

## Components

The balance stream implementation consists of several parts:

1. **Balance Types** (`balance.ts`)
   - TypeScript interfaces for balance data
   - Extension of SSE message types for balance updates
   - ExternalAPIHeaders type for non-authenticated API calls

2. **Balance Context** (`BalanceContext.tsx`)
   - React context for sharing balance data across the application
   - State management for balance updates
   - Error handling and loading states

3. **External SSE Hook** (`useExternalSSE.ts`)
   - Specialized hook for external API SSE connections
   - No authentication headers required
   - Simplified connection management

4. **Balance SSE Hook** (`useBalanceSSE.ts`)
   - React hook for connecting to the balance stream
   - Utilizes the specialized External SSE hook
   - No authentication headers required for external API

5. **Balance Updates Component** (`BalanceUpdates/index.tsx`)
   - UI component for displaying balance updates
   - Shows current balance and optional history
   - Visual indicators for balance changes

## Usage

### Basic Usage

```typescript
import { useBalance } from '../contexts/BalanceContext';

function MyComponent() {
  const { balanceData, isLoading, error } = useBalance();

  if (isLoading) {
    return <div>Loading balance...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      Current Balance: {balanceData?.balance} {balanceData?.currency}
    </div>
  );
}
```

### Using the BalanceUpdates Component

```typescript
import { BalanceUpdates } from '../components/BalanceUpdates';

function MyComponent() {
  return (
    <div>
      <h2>Account Balance</h2>
      <BalanceUpdates showHistory={true} />
    </div>
  );
}
```

## Configuration

The balance stream service can be configured with the following environment variables:

- `VITE_EXTERNAL_API_BASE_URL`: The base URL for the external API (defaults to `https://mock.mobile-bot.deriv.dev/v1`)

## Data Format

The balance stream provides data in the following format:

```json
{
  "data": {
    "balance": "9995.80",
    "change": "0.00",
    "contract_id": "",
    "currency": "USD",
    "timestamp": "2025-03-10T06:39:50Z"
  }
}
```

## Error Handling

The service includes built-in error handling:

- Connection errors are logged to console
- Connection status is tracked and exposed via `isConnected`
- Graceful degradation to show default values when the stream is unavailable

## Security Considerations

- Authentication headers are included in the SSE request
- URLs are configured via environment variables
- Sensitive data is handled securely in message handlers