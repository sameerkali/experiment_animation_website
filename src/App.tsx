import ChipScroll from './components/ChipScroll';
import SpecsPage from './components/SpecsPage';
import FooterPage from './components/FooterPage';

const App = () => {
  return (
    <div>
      {/* Section 1 — Scroll-linked chip animation (self-contained) */}
      <ChipScroll />

      {/* Section 2 — Technical specs & features */}
      <SpecsPage />

      {/* Section 3 — Timeline, FAQ & Footer */}
      <FooterPage />
    </div>
  );
};

export default App;