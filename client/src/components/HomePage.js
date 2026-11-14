// ✨ World-Class UI Design for HomePage.jsx (E-Commerce)
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import heroImg from "./image/home.jpg";
import { useNavigate } from "react-router-dom";

const coral = "#FF6F61";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: "easeOut" } },
});

const features = [
  { title: "Quality Craftsmanship", desc: "Built with precision and premium materials.", icon: "🛠️" },
  { title: "Modern Designs", desc: "Sleek, stylish, and contemporary.", icon: "🎨" },
  { title: "Weatherproof Build", desc: "Engineered for all environments.", icon: "🌦️" },
  { title: "Budget Friendly", desc: "Luxury railing at a fair price.", icon: "💸" },
];

const products = [
  {
    name: "Elegant Steel Railing",
    image: "https://i.pinimg.com/736x/e1/3f/fc/e13ffc7d64c40e27dd1ae99d61ed00f0.jpg",
    price: "$199",
  },
  {
    name: "Modern Glass Railing",
    image: "https://i.pinimg.com/736x/1e/19/20/1e192085aff265580159e5ffb4cde9b6.jpg",
    price: "$299",
  },
  {
    name: "Classic Wooden Handrail",
    image: "https://i.pinimg.com/736x/c7/dd/d3/c7ddd35e43911213b09fb009dd36728c.jpg",
    price: "$149",
  },
];

export default function HomePage() {
  const heroRef = useRef(null);
  const productRef = useRef(null);
  const ctaRef = useRef(null);
  const navigate = useNavigate();

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const scaleHero = useTransform(heroScroll, [0, 1], [1, 0.95]);
  const opacityHero = useTransform(heroScroll, [0, 1], [1, 0]);

  const { scrollYProgress: productScroll } = useScroll({ target: productRef, offset: ["start end", "end start"] });
  const yProduct = useTransform(productScroll, [0, 1], ["50px", "-50px"]);

  const { scrollYProgress: ctaScroll } = useScroll({ target: ctaRef, offset: ["start end", "end start"] });
  const opacityCTA = useTransform(ctaScroll, [0, 1], [1, 0.5]);
  const scaleCTA = useTransform(ctaScroll, [0, 1], [1, 0.97]);

  return (
    <main className="bg-white text-dark" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{
          height: "100vh",
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          scale: scaleHero,
          opacity: opacityHero,
        }}
        className="d-flex align-items-center justify-content-center text-center text-white position-relative"
      >
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: "rgba(0,0,0,0.6)" }}></div>
        <div className="position-relative px-4 z-2" style={{ maxWidth: 800 }}>
          <motion.h1 className="display-4 fw-bold mb-4" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            Premium Railings, Perfected for Life
          </motion.h1>
          <motion.p className="lead mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            Strong. Stunning. Sustainable.
          </motion.p>
          <motion.div className="d-flex justify-content-center gap-3 flex-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <motion.button whileHover={{ scale: 1.08 }} className="btn btn-lg rounded-pill px-4 text-white fw-semibold" style={{ backgroundColor: coral }} onClick={() => navigate("/PublicProductList")}>
              Shop Now
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features */}
      <section className="py-5 bg-light text-center">
        <div className="container">
          <motion.h2 className="fw-bold mb-5" variants={fadeUp()} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Why Customers Love Us
          </motion.h2>
          <div className="row gy-4">
            {features.map(({ title, desc, icon }, i) => (
              <motion.div key={i} className="col-12 col-md-6 col-lg-3" variants={fadeUp(i * 0.15)} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="bg-white rounded-4 shadow-sm h-100 p-4">
                  <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ background: "#fff0ec", width: 60, height: 60, fontSize: 28, color: coral }}>
                    {icon}
                  </div>
                  <h5 className="fw-semibold">{title}</h5>
                  <p className="text-muted small mb-0">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section ref={productRef} className="py-5 text-center bg-white">
        <div className="container">
          <motion.h2 className="fw-bold mb-5" variants={fadeUp()} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Featured Products
          </motion.h2>
          <div className="row g-4">
            {products.map(({ name, image, price }, i) => (
              <motion.div key={i} className="col-12 col-md-6 col-lg-4" style={{ y: yProduct }} variants={fadeUp(i * 0.15)} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }}>
                <div className="card h-100 border-0 shadow-lg rounded-4 overflow-hidden">
                  <img src={image} alt={name} className="card-img-top" style={{ height: 240, objectFit: "cover" }} />
                  <div className="card-body d-flex flex-column text-start">
                    <h5 className="fw-bold">{name}</h5>
                    <p className="text-danger fw-semibold fs-5">{price}</p>
                    <div className="mt-auto d-flex gap-2">
                      <button className="btn btn-sm btn-danger flex-fill">👁 Quick View</button>
                      <button className="btn btn-sm btn-outline-secondary flex-fill">❤️ Wishlist</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <motion.section ref={ctaRef} className="py-5 text-white text-center" style={{ background: `linear-gradient(135deg, ${coral}, #ffa07a)`, opacity: opacityCTA, scale: scaleCTA }}>
        <div className="container">
          <h2 className="fw-bold mb-3">Transform Your Home Today</h2>
          <p className="lead mb-4">Elegant, safe, and built to last—explore our premium railing selection.</p>
          <button className="btn btn-lg btn-light text-danger rounded-pill px-5">Start Shopping</button>
        </div>
      </motion.section>
    </main>
  );
}
