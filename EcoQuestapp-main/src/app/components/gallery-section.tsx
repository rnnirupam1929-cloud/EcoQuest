import { motion } from "motion/react";

const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1703012349431-95c3304d098f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwcGxhbnRpbmclMjBlbnZpcm9ubWVudHxlbnwxfHx8fDE3ODAzODM4Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Tree Planting",
    category: "Conservation",
  },
  {
    url: "https://images.unsplash.com/photo-1710093072218-0024b8391475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGNvbW11bml0eSUyMHBlb3BsZXxlbnwxfHx8fDE3ODAzODM4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Community Action",
    category: "Together",
  },
  {
    url: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xpbmclMjBlY28lMjBmcmllbmRseXxlbnwxfHx8fDE3ODAzODM4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Recycling",
    category: "Sustainability",
  },
  {
    url: "https://images.unsplash.com/photo-1658242106760-7a5c8f177180?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRlY2hub2xvZ3klMjBpbm5vdmF0aW9ufGVufDF8fHx8MTc4MDM4Mzg3OXww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Green Technology",
    category: "Innovation",
  },
  {
    url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMHJlbmV3YWJsZSUyMGVuZXJneXxlbnwxfHx8fDE3ODAzNDEzMDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Renewable Energy",
    category: "Future",
  },
  {
    url: "https://images.unsplash.com/photo-1506099914961-765be7a97019?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBjb25zZXJ2YXRpb24lMjB3aWxkbGlmZXxlbnwxfHx8fDE3ODAzODM4ODB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Wildlife Conservation",
    category: "Nature",
  },
];

export function GallerySection() {
  return (
    <section className="py-24 bg-gradient-to-b from-emerald-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">
            Eco Activities Gallery
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the impact our community is making around the world
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group relative overflow-hidden rounded-3xl shadow-xl cursor-pointer"
            >
              <div className="aspect-[4/3] relative">
                <img 
                  src={image.url} 
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/80 backdrop-blur-sm mb-2">
                    {image.category}
                  </div>
                  <h3 className="text-xl font-bold">{image.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
