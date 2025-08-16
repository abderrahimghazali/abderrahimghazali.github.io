import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import TypeWriter from './TypeWriter'
import SEO from './SEO'
import StructuredData from './StructuredData'

function Home() {
  return (
    <>
      <SEO 
        title="AI Agent Development & Drupal Expert | Abderrahim GHAZALI - Custom Automation Solutions"
        description="Expert AI agent development and Drupal solutions by Abderrahim GHAZALI. Custom workflow automation, LangChain integration, enterprise Drupal development. Transform your business with intelligent automation."
        keywords="AI agent development, custom AI agents, workflow automation, Drupal expert, LangChain developer, intelligent automation, AI workflow solutions, enterprise Drupal, custom automation solutions, AI integration services, Drupal developer, DevOps automation"
        url="https://abderrahimghazali.github.io/"
      />
      <StructuredData 
        name="Abderrahim GHAZALI"
        jobTitle="AI Agent Developer & Drupal Expert"
        description="Expert in AI agent development, custom workflow automation, and enterprise Drupal solutions. Specializing in LangChain, intelligent automation, and scalable web applications."
        url="https://abderrahimghazali.github.io/"
        sameAs={[
          "https://github.com/abderrahimghazali",
          "https://www.linkedin.com/in/abderrahim-ghazali-5121b855",
          "https://www.drupal.org/u/gabderrahim"
        ]}
      />
      <div className="flex items-center justify-center relative min-h-screen h-auto">
      <div className="text-center max-w-[600px] w-full px-5 py-5 box-border">
        {/* Main title section */}
        <div className="m-b-md">
          <TypeWriter 
            text="Abderrahim GHAZALI"
            className="title"
            speed={80}
            delay={500}
          />
          <motion.p 
            className="text-custom-gray"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.8 }}
          >
            Think bad. Do good.
          </motion.p>
        </div>

        {/* Description section */}
        <motion.div 
          className="description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2, duration: 0.8 }}
        >
          <p>
            Expert in <strong>AI agent development</strong> and <strong>Drupal solutions</strong>. I create intelligent automation systems using <strong>LangChain</strong> and build scalable web applications with <strong>NextJS</strong> and <strong>DevOps</strong>.
          </p>
        </motion.div>

        {/* Links section */}
        <motion.div 
          className="flex justify-center flex-wrap gap-5
                     md:flex-col md:items-center md:gap-[15px]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.8, duration: 0.8 }}
        >
          <Link 
            to="/about"
            className="nav-link">
            About
          </Link>
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
        </motion.div>
      </div>

      {/* Donation Links */}
      <motion.div 
        className="donation-links"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 4.2, duration: 0.8 }}
      >
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
      </motion.div>
      </div>
    </>
  )
}

export default Home