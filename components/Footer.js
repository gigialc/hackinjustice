export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>MedBnB</h3>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">How It Works</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Support</h3>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Safety Information</a></li>
              <li><a href="#">Cancellation Options</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Hosting</h3>
            <ul>
              <li><a href="#">List Your Property</a></li>
              <li><a href="#">Host Resources</a></li>
              <li><a href="#">Community Forum</a></li>
              <li><a href="#">Host Responsibly</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Medical Travel</h3>
            <ul>
              <li><a href="#">Patient Resources</a></li>
              <li><a href="#">Hospital Partnerships</a></li>
              <li><a href="#">Accessibility Guide</a></li>
              <li><a href="#">Insurance Information</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} MedBnB. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 