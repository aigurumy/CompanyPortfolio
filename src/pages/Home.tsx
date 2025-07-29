import React from 'react';
import { ChevronDown, Github, Linkedin, Mail, Code, Palette, Database, Zap } from 'lucide-react';

const Home = () => {
  const skills = [
    { name: 'Frontend Development', icon: Code, color: 'text-blue-400' },
    { name: 'UI/UX Design', icon: Palette, color: 'text-purple-400' },
    { name: 'Backend Development', icon: Database, color: 'text-green-400' },
    { name: 'Performance Optimization', icon: Zap, color: 'text-yellow-400' },
  ];

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                <Code className="w-16 h-16 text-blue-400" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Alex Johnson
            </h1>
            <h2 className="text-xl md:text-2xl text-slate-300 mb-6">
              Full Stack Developer & Designer
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Crafting digital experiences with clean code and thoughtful design. 
              Passionate about building scalable applications that make a difference.
            </p>
          </div>

          <div className="flex justify-center space-x-6 mb-12">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
            >
              <Github className="w-6 h-6 text-slate-300 hover:text-blue-400 transition-colors" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
            >
              <Linkedin className="w-6 h-6 text-slate-300 hover:text-blue-400 transition-colors" />
            </a>
            <a
              href="mailto:alex@example.com"
              className="p-3 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
            >
              <Mail className="w-6 h-6 text-slate-300 hover:text-blue-400 transition-colors" />
            </a>
          </div>

          <button
            onClick={scrollToAbout}
            className="animate-bounce text-slate-400 hover:text-blue-400 transition-colors"
          >
            <ChevronDown className="w-8 h-8" />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-100">About Me</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-slate-200">
                Passionate Developer with 5+ Years Experience
              </h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                I'm a full-stack developer who loves creating digital solutions that combine 
                beautiful design with robust functionality. My journey in tech started with 
                curiosity about how websites work, and it has evolved into a passion for 
                building applications that solve real-world problems.
              </p>
              <p className="text-slate-400 leading-relaxed">
                When I'm not coding, you'll find me exploring new technologies, contributing 
                to open-source projects, or sharing knowledge with the developer community.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="p-6 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all duration-300 hover:scale-105"
                >
                  <skill.icon className={`w-8 h-8 ${skill.color} mb-4`} />
                  <h4 className="text-slate-200 font-medium">{skill.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-100">Technologies</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-6"></div>
            <p className="text-slate-400 max-w-2xl mx-auto">
              I work with modern technologies to deliver exceptional results
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'AWS'].map((tech) => (
              <div
                key={tech}
                className="text-center p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <p className="text-slate-300 font-medium">{tech}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;