import { useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser, signOut, subscribeToAuth } from "../data/authStore";

const AccountControl = () => {
  const user = useSyncExternalStore(subscribeToAuth, getCurrentUser, getCurrentUser);

  if (!user) {
    return <Link className="login-trigger" to="/login">Log in</Link>;
  }

  return (
    <div className="account-control">
      <span className="account-email" title={user.identifier}>{user.identifier}</span>
      <button className="sign-out-button" type="button" onClick={signOut}>Log out</button>
    </div>
  );
};

export default AccountControl;
