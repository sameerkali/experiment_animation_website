import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'What workloads does NeuralCore X1 support?',
    a: 'NeuralCore X1 is optimised for large-language-model inference, computer vision, speech recognition, and generative-AI workloads across data-center and edge deployments.',
  },
  {
    q: 'Is there SDK support for popular frameworks?',
    a: 'Yes — we ship first-class plugins for PyTorch, TensorFlow, JAX, and ONNX Runtime, along with a comprehensive C++ SDK for custom pipelines.',
  },
  {
    q: 'What cooling solutions are recommended?',
    a: 'The 35 W TDP allows passive cooling in most rack configurations. For sustained peak loads we recommend a single 80 mm fan or liquid-cooled cold-plate.',
  },
  {
    q: 'When will NeuralCore X1 be available?',
    a: 'Engineering samples ship Q3 2026. General availability is slated for Q1 2027 through our direct channel and authorised partners.',
  },
];

const timelineItems = [
  { year: '2023', event: 'Research kick-off at DeepSilicon Labs' },
  { year: '2024', event: 'First silicon tape-out on TSMC 5 nm' },
  { year: '2025', event: 'Internal benchmarks surpass all competitors' },
  { year: '2026', event: 'NeuralCore X1 unveiled to the world' },
];

const FooterPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="footer-page" className="relative min-h-screen w-full bg-[#030303] overflow-hidden">
      {/* Gradients */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-violet-700/10 blur-[180px] pointer-events-none" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full bg-indigo-700/10 blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-28">
        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mb-28"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-violet-400/70 mb-4 text-center">Our Journey</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-16">
            From Lab to <span className="text-gradient">Launch</span>
          </h2>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/40 via-violet-500/20 to-transparent hidden md:block" />

            <div className="flex flex-col gap-12">
              {timelineItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className={`flex items-center gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:text-left text-center`}
                >
                  <div className="md:w-1/2 flex justify-end md:justify-center">
                    <span className="text-5xl font-black text-gradient">{item.year}</span>
                  </div>
                  <div className="hidden md:block w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20 z-10 shrink-0" />
                  <div className="md:w-1/2">
                    <p className="text-white/50 text-base">{item.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mb-28"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-indigo-400/70 mb-4 text-center">Common Questions</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-12">
            FAQ
          </h2>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
                >
                  <span className="text-white font-medium text-base">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-white/40 text-2xl shrink-0 ml-4"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm text-white/35 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 rounded-3xl border border-white/5 bg-gradient-to-br from-indigo-600/10 via-transparent to-violet-600/10 p-12 md:p-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Ready to Build the Future?</h2>
          <p className="text-white/35 max-w-md mx-auto mb-8">Join the developer preview and be among the first to harness NeuralCore X1.</p>
          <button className="px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm tracking-wide transition-colors duration-300 glow-accent cursor-pointer">
            Request Early Access
          </button>
        </motion.div>

        {/* Footer */}
        <footer className="border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/20">
          <p>© 2026 NeuralCore — All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/50 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/50 transition-colors">Contact</a>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default FooterPage;
