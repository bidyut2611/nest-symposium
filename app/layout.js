import { Geist, Geist_Mono, Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "NEST Cluster Symposium 2026",
  description: "Advancing Science, Engineering & Technology for a Better Tomorrow",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        {/* Main Navigation */}
        <nav className="navbar" style={{ position: 'sticky', top: 0, padding: '10px 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', maxWidth: '100%', padding: '0 2rem' }}>
            
            {/* Left Side: Logos (50% width) */}
            <div style={{ flex: '0 0 50%', display: 'flex', justifyContent: 'flex-start' }}>
              <a href="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/nest-logo.png" alt="NEST Cluster Logo" style={{ height: '75px', width: 'auto' }} />
                <img src="/iitg-logo.svg" alt="IIT Guwahati Logo" style={{ height: '75px', width: 'auto' }} />
                <div style={{ width: '2px', height: '40px', backgroundColor: 'var(--border)', margin: '0 8px' }}></div>
                <img src="/mdoner-logo.png" alt="MDoNER Logo" style={{ height: '40px', width: 'auto' }} />
                <img src="/nec-logo.png" alt="North Eastern Council Logo" style={{ height: '45px', width: 'auto' }} />
              </a>
            </div>

            {/* Right Side: Buttons (Start exactly at middle, 50% width) */}
            <div style={{ flex: '0 0 50%', display: 'flex', justifyContent: 'flex-start' }}>
              <ul className="nav-links" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', margin: 0, padding: 0 }}>
                <li><a href="/" className="nav-link">Home</a></li>
                <li><a href="/program" className="nav-link">Program</a></li>
                <li><a href="/speakers" className="nav-link">Speakers</a></li>
                <li><a href="/register" className="nav-link">Registration</a></li>
                <li><a href="/sponsorship" className="nav-link">Sponsorship</a></li>
                <li><a href="/accommodation" className="nav-link">Accommodation</a></li>
                <li><a href="/contact" className="nav-link">Contact</a></li>
                <li><a href="/admin" className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Admin</a></li>
              </ul>
            </div>
            
          </div>
        </nav>

        <main style={{ minHeight: 'calc(100vh - 200px)' }}>
          {children}
        </main>
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div>
                <h3 className="footer-heading">NEST Cluster</h3>
                <p className="text-muted">Advancing Science, Engineering & Technology.</p>
              </div>
              <div>
                <h3 className="footer-heading">Links</h3>
                <ul className="footer-links">
                  <li><a href="/program">Program Schedule</a></li>
                  <li><a href="/speakers">Keynote Speakers</a></li>
                  <li><a href="/register">Registration</a></li>
                  <li><a href="/sponsorship">Sponsorship & Exhibition</a></li>
                  <li><a href="/accommodation">Accommodation</a></li>
                  <li><a href="/contact">Contact Us</a></li>
                </ul>
              </div>
              <div>
                <h3 className="footer-heading">Contact</h3>
                <p className="text-muted">symposium@nestcluster.edu.in<br/>+91 361 258 2000</p>
              </div>
            </div>
            <div className="footer-bottom">
              &copy; 2026 NEST Cluster Symposium. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
