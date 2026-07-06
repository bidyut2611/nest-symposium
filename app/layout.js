import { Geist, Geist_Mono, Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from './components/Navbar';
import InaugurationScreen from './components/InaugurationScreen';

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
        <InaugurationScreen />
        <Navbar />

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
                <p className="text-muted">nestcluster@gmail.com<br/>+91 361 258 2000</p>
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
