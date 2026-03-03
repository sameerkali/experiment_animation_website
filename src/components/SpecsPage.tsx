import { motion } from 'framer-motion';

const specs = [
  {
    icon: '⚡',
    title: '12 TOPS Performance',
    desc: 'Tera-operations per second for lightning-fast inference on edge and cloud.',
  },
  {
    icon: '🧠',
    title: '256B Parameters',
    desc: 'Industry-leading model capacity. Run the largest foundation models natively.',
  },
  {
    icon: '🔒',
    title: 'Hardware-Level Security',
    desc: 'Encrypted memory lanes, secure boot, and a dedicated cryptographic co-processor.',
  },
  {
    icon: '🌐',
    title: '800 Gbps I/O',
    desc: 'Ultra-low-latency interconnects designed for distributed AI workloads.',
  },
  {
    icon: '♻️',
    title: '35W TDP',
    desc: 'Unmatched performance-per-watt keeps data center costs and carbon footprint low.',
  },
  {
    icon: '🛠️',
    title: 'Full SDK & Toolchain',
    desc: 'PyTorch, TensorFlow, ONNX — first-class support from day one.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

const SpecsPage = () => (
  <section id="specs-page" className="relative min-h-screen w-full bg-[#050505] bg-grid overflow-hidden">
    {/* Radial glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[160px] pointer-events-none" />

    <div className="relative z-10 max-w-6xl mx-auto px-6 py-28">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-20"
      >
        <p className="text-xs tracking-[0.4em] uppercase text-indigo-400/70 mb-4">Technical Specifications</p>
        <h2 className="text-4xl md:text-6xl font-extrabold text-white">
          Built to <span className="text-gradient">Dominate</span>
        </h2>
        <p className="mt-4 text-white/30 max-w-lg mx-auto text-lg">
          Every detail of NeuralCore X1 was engineered for one purpose — unmatched AI performance.
        </p>
      </motion.div>

      {/* Cards grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {specs.map((s, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            className="group relative rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-8 hover:border-indigo-500/30 transition-all duration-500"
          >
            {/* Hover glow */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-indigo-600/10 via-transparent to-violet-600/10 pointer-events-none" />

            <span className="text-3xl mb-5 block">{s.icon}</span>
            <h3 className="text-xl font-semibold text-white mb-2">{s.title}</h3>
            <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom stat bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-20 flex flex-wrap justify-center gap-12 border-t border-white/5 pt-12"
      >
        {[
          { value: '5nm', label: 'Process Node' },
          { value: '128', label: 'CUDA Cores (K)' },
          { value: '40 GB', label: 'HBM3 Memory' },
          { value: '<1ms', label: 'Latency' },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-gradient">{s.value}</p>
            <p className="text-xs text-white/30 mt-1 tracking-wider uppercase">{s.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default SpecsPage;
