import { Link } from "react-router-dom";

const Brand = ({ to = "/", className = "" }) => (
  <Link className={`brand-lockup ${className}`} to={to} aria-label="NEXUS home">
    <img className="brand-lockup-mark" src="/nexus-mark.png" alt="" />
    <span>NEXUS</span>
  </Link>
);

export default Brand;
