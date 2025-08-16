import { Link } from 'react-router-dom'
import SEO from './SEO'

function About() {
  return (
    <>
      <SEO 
        title="Hire AI Agent Developer & Drupal Expert | Custom Automation Solutions - Abderrahim GHAZALI"
        description="Professional AI agent development services and enterprise Drupal solutions. Custom workflow automation, LangChain integration, intelligent business process automation. Contact for AI agent development projects."
        keywords="hire AI agent developer, AI agent development services, custom AI agents, Drupal development services, workflow automation expert, LangChain consulting, intelligent automation solutions, enterprise Drupal developer, AI workflow integration, custom automation development, AI business solutions"
        url="https://abderrahimghazali.github.io/about"
      />
      <div className="flex items-center justify-center relative min-h-screen h-auto">
      <div className="text-center max-w-[800px] w-full px-5 py-5 box-border">
        {/* Header */}
        <div className="m-b-md">
          <h1 className="title">About Abderrahim GHAZALI</h1>
          <p className="text-custom-gray mb-8">Full-stack Developer & AI Workflow Specialist</p>
        </div>

        {/* Main Content */}
        <div className="text-left space-y-8">
          
          {/* Introduction */}
          <section className="description">
            <p>
              I'm a professional <strong>AI agent developer</strong> and <strong>Drupal expert</strong> who transforms businesses through intelligent automation. I specialize in creating custom AI agents that automate complex workflows, integrate seamlessly with existing systems, and deliver measurable ROI. Whether you need enterprise Drupal solutions or cutting-edge AI automation, I deliver results that scale with your business.
            </p>
          </section>

          {/* Services */}
          <section>
            <h2 className="text-2xl font-semibold text-[#333] mb-4">AI Agent Development Services</h2>
            <div className="description">
              <p>
                <strong>Custom AI Agent Development:</strong> I build intelligent agents that understand your business processes and automate them efficiently. From document processing to customer service automation, my AI agents reduce manual work by 80% while improving accuracy.
              </p>
              <br/>
              <p>
                <strong>LangChain Integration:</strong> Expert implementation of LangChain frameworks for complex AI workflows. I create agents that can reason, make decisions, and integrate with your existing tools and databases.
              </p>
              <br/>
              <p>
                <strong>Workflow Automation:</strong> Transform manual processes into intelligent, automated systems. My solutions handle everything from data entry to complex decision-making processes.
              </p>
            </div>
          </section>

          {/* Drupal Expertise */}
          <section>
            <h2 className="text-2xl font-semibold text-[#333] mb-4">Enterprise Drupal Development</h2>
            <div className="description">
              <p>
                <strong>11+ Years Drupal Expert:</strong> With over a decade of deep Drupal expertise, I architect and deliver scalable Drupal applications for large organizations. From custom module development to complex multi-site implementations, I create robust content management systems that handle millions of users.
              </p>
              <br/>
              <p>
                <strong>Drupal + AI Integration:</strong> Unique expertise combining Drupal with AI technologies. I build intelligent content systems that automatically categorize, moderate, and optimize content using AI agents.
              </p>
              <br/>
              <p>
                <strong>Performance & Security:</strong> Specialized in Drupal performance optimization and security hardening. My solutions consistently achieve 90+ PageSpeed scores and pass enterprise security audits.
              </p>
            </div>
          </section>

          {/* AI & Automation */}
          <section>
            <h2 className="text-2xl font-semibold text-[#333] mb-4">AI Agent Development</h2>
            <div className="description">
              <p>
                I create <strong>intelligent AI agents</strong> that transform business workflows and automate complex processes. Using cutting-edge technologies like <strong>LangChain</strong>, I develop custom automation solutions that understand context, make intelligent decisions, and seamlessly integrate with existing systems. Whether it's document processing, customer service automation, or workflow optimization, I build AI agents that deliver measurable results.
              </p>
            </div>
          </section>

          {/* Technical Skills */}
          <section>
            <h2 className="text-2xl font-semibold text-[#333] mb-4">Technical Mastery</h2>
            <div className="description">
              <p>
                My technical toolkit includes <strong>React</strong>, <strong>NextJS</strong>, <strong>Node.js</strong>, and modern <strong>DevOps</strong> practices. I excel at creating full-stack applications with robust backends, intuitive frontends, and automated deployment pipelines. My DevOps expertise ensures your applications are secure, scalable, and maintainable from day one.
              </p>
            </div>
          </section>

          {/* Philosophy */}
          <section>
            <h2 className="text-2xl font-semibold text-[#333] mb-4">My Approach</h2>
            <div className="description">
              <p>
                I believe in the power of <strong>"Think bad. Do good."</strong> — anticipating potential challenges and edge cases to build resilient solutions that exceed expectations. Every project is an opportunity to create something that not only works flawlessly but also makes a positive impact on users and businesses.
              </p>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center pt-8">
            <div className="description">
              <p>
                <strong>Ready to automate your business with AI agents or scale your web presence with enterprise Drupal?</strong> I deliver custom solutions that save time, reduce costs, and drive growth. Contact me for a free consultation on your AI automation or Drupal development project.
              </p>
            </div>
            
            <div className="flex justify-center flex-wrap gap-5 mt-8">
              <a 
                href="https://github.com/abderrahimghazali" 
                target="_blank"
                className="nav-link">
                View AI Projects
              </a>
              <a 
                href="https://www.linkedin.com/in/abderrahim-ghazali-5121b855" 
                target="_blank"
                className="nav-link">
                Hire Me for AI Development
              </a>
              <a 
                href="https://www.drupal.org/u/gabderrahim" 
                target="_blank"
                className="nav-link">
                Drupal Portfolio
              </a>
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link 
            to="/"
            className="nav-link inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
      </div>
    </>
  )
}

export default About