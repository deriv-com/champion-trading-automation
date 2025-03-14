/**
 * @file: PositionsPage.tsx
 * @description: Page component for displaying trading positions and their status,
 *               serving as a container for the Positions component.
 *
 * @components: PositionsPage - Page-level component for positions view
 * @dependencies:
 *   - components/Positions: Main positions display component
 * @usage:
 *   // Used in router configuration
 *   <Route path="/positions" element={<PositionsPage />} />
 *
 * @architecture: Simple page container component
 * @relationships:
 *   - Parent: Router/App component
 *   - Child: Positions component
 * @dataFlow: Acts as a container that delegates rendering to the Positions component
 *
 * @ai-hints: This is a minimal page component that serves primarily as a routing
 *            destination and container for the more complex Positions component.
 */
import Positions from "../components/Positions";

const PositionsPage = () => {
  return <Positions />;
};

export default PositionsPage;
