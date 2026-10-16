import { motion } from "motion/react";
import { Download, CheckCircle2, Coins, Globe2 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Download,
    title: "Download EcoQuest",
    description: "Get the app from App Store or Google Play and create your eco profile",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    number: "02",
    icon: CheckCircle2,
    title: "Complete Eco Tasks",
    description: "Participate in daily challenges and sustainability missions",
    color: "lime",
    gradient: "from-lime-500 to-green-600",
  },
  {
    number: "03",
    icon: Coins,
    title: "Earn Green Points",
    description: "Collect rewards and unlock achievements for your contributions",
    color: "yellow",
    gradient: "from-yellow-500 to-amber-600",
  },
  {
    number: "04",
    icon: Globe2,
    title: "Save the Planet",
    description: "Make a real impact on the environment and inspire others",
    color: "sky",
    gradient: "from-sky-500 to-blue-600",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-emerald-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-lime-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start your eco journey in four simple steps
          </p>
        </motion.div>

        {/* Desktop View - Roadmap */}
        <div className="hidden lg:block relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-300 via-lime-300 to-sky-300 -translate-y-1/2" />
          
          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {/* Step Number Badge */}
                <motion.div
                  className={`absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white font-bold text-xl shadow-xl z-10`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {step.number}
                </motion.div>

                {/* Card */}
                <motion.div
                  className="bg-white/80 backdrop-blur-lg border border-emerald-200/50 rounded-3xl p-8 mt-12 shadow-xl hover:shadow-2xl transition-all duration-300"
                  whileHover={{ y: -10 }}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 mx-auto`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-center text-gray-800">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center text-sm leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile View - Vertical */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex gap-6"
            >
              <div className="flex flex-col items-center flex-shrink-0">
                <motion.div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white font-bold text-lg shadow-xl`}
                  whileHover={{ scale: 1.1 }}
                >
                  {step.number}
                </motion.div>
                {index < steps.length - 1 && (
                  <div className="w-1 flex-grow bg-gradient-to-b from-emerald-300 to-lime-300 my-2" />
                )}
              </div>

              <motion.div
                className="flex-grow bg-white/80 backdrop-blur-lg border border-emerald-200/50 rounded-3xl p-6 shadow-xl"
                whileHover={{ x: 10 }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-4`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-lg font-bold mb-2 text-gray-800">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
