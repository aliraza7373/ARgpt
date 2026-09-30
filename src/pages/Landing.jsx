import { useOutlet } from "react-router-dom";
import AccountControl from "../components/AccountControl";
import Brand from "../components/Brand";
import History from "../components/History";

const Landing = () => {
  const outlet = useOutlet();

  return (
    <div className="landing">
      <History />
      <main className="main-content">
        {outlet || (
          <>
          <header className="welcome-topbar">
            <Brand className="welcome-brand" />
            <AccountControl />
          </header>
          <div className="welcome-state">
            <div className="welcome-mark" aria-hidden="true">✳</div>
            <p className="welcome-eyebrow">A little help goes a long way</p>
            <h1>What can I help with?</h1>
            <p>Choose a conversation or start a new chat to get going.</p>
          </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Landing;
