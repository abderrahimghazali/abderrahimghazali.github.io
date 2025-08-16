import { Link } from 'react-router-dom'

function About() {
  return (
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
              I'm a passionate full-stack developer with deep expertise in building scalable web applications and intelligent automation systems. My mission is to bridge the gap between complex technical requirements and elegant, user-friendly solutions.
            </p>
          </section>

          {/* Drupal Expertise */}
          <section>
            <h2 className="text-2xl font-semibold text-[#333] mb-4">Drupal Expertise</h2>
            <div className="description">
              <p>
                As a <strong>Drupal expert</strong>, I've architected and delivered enterprise-level content management solutions for organizations worldwide. My experience spans custom module development, complex site building, performance optimization, and seamless third-party integrations. I specialize in creating maintainable, scalable Drupal applications that grow with your business needs.
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
                Ready to transform your ideas into powerful digital solutions? Let's build something extraordinary together.
              </p>
            </div>
            
            <div className="flex justify-center flex-wrap gap-5 mt-8">
              <a 
                href="https://github.com/abderrahimghazali" 
                target="_blank"
                className="nav-link">
                View My Work
              </a>
              <a 
                href="https://www.linkedin.com/in/abderrahim-ghazali-5121b855" 
                target="_blank"
                className="nav-link">
                Let's Connect
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
  )
}

export default About