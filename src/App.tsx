function App() {
  return (
    <div className="flex items-center justify-center relative min-h-screen h-auto">
      <div className="text-center max-w-[600px] w-full px-5 py-5 box-border">
        {/* Main title section */}
        <div className="m-b-md">
          <h1 className="title">
            Abderrahim GHAZALI
          </h1>
          <p className="text-custom-gray">Think bad. Do good.</p>
        </div>

        {/* Description section */}
        <div className="description">
          <p>
            Full-stack developer specializing in <strong>Drupal</strong>, <strong>DevOps</strong>, <strong>LangChain</strong>, and <strong>NextJS</strong>.
          </p>
        </div>

        {/* Links section */}
        <div className="flex justify-center flex-wrap gap-5
                        md:flex-col md:items-center md:gap-[15px]">
          <a 
            href="https://www.drupal.org/u/abdei" 
            target="_blank"
            className="nav-link">
            About
          </a>
          <a 
            href="https://github.com/abderrahimghazali" 
            target="_blank"
            className="nav-link">
            GitHub
          </a>
          <a 
            href="https://github.com/sponsors/abderrahimghazali" 
            target="_blank"
            className="nav-link">
            Sponsor Me
          </a>
          <a 
            href="https://www.linkedin.com/in/abderrahim-ghazali-5121b855" 
            target="_blank"
            className="nav-link">
            Linkedin
          </a>
        </div>
      </div>

      {/* Donation Links */}
      <div className="donation-links">
        <a 
          href="https://www.paypal.me/abderrahimghazali" 
          target="_blank"
          className="donation-link">
          <span className="icon">🍕</span>
          <span className="text">Buy me Pizza</span>
        </a>
        <a 
          href="https://buymeacoffee.com/abderrahimghazali" 
          target="_blank"
          className="donation-link">
          <span className="icon">☕</span>
          <span className="text">Buy me Coffee</span>
        </a>
      </div>
    </div>
  )
}

export default App
