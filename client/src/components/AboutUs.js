import React from "react";
import { motion } from "framer-motion";
import aboutImg from "./image/home.jpg"; // You can replace this with your actual about image

const coral = "#FF6F61";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: "easeOut" },
  },
});

export default function AboutUs() {
  return (
    <main className="bg-white text-dark" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header / Hero */}
      <motion.section
        className="text-white text-center d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: `url(${aboutImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
          position: "relative",
        }}
      >
        <div
          className="position-absolute w-100 h-100"
          style={{ background: "rgba(0,0,0,0.6)", top: 0, left: 0 }}
        ></div>
        <motion.div
          className="position-relative z-2 px-3"
          initial="hidden"
          animate="visible"
          variants={fadeUp(0.2)}
        >
          <h1 className="display-4 fw-bold">About InteDecor</h1>
          <p className="lead mt-2">Blending Safety, Style, and Smart Shopping</p>
        </motion.div>
      </motion.section>

      {/* About Abstract Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <motion.div
            className="row justify-content-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp(0.1)}
          >
            <div className="col-md-10">
              <div className="bg-white rounded-4 shadow-sm p-5">
                <h2 className="fw-bold mb-4 text-center" style={{ color: coral }}>
                  Project Overview
                </h2>
                <p className="lead text-muted" style={{ fontSize: "1.05rem", lineHeight: "1.9" }}>
                  <strong>InteDecor Steel Railing System</strong> is a durable and visually striking
                  safety and support solution, consisting of steel posts, balusters, and handrails.
                  Our platform allows customers to browse high-quality railing designs online—
                  sparking inspiration and excitement. When they’re ready to make a purchase, the
                  transaction is completed in our physical store.
                </p>
                <p className="text-muted" style={{ fontSize: "1.05rem", lineHeight: "1.9" }}>
                  This hybrid model delivers the convenience of online shopping—easy product discovery
                  and comparison—alongside the trust and experience of an in-store purchase, where
                  customers can see and touch the product before buying. It’s a perfect blend of
                  flexibility and trust for our modern shoppers.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-5 text-center">
        <div className="container">
          <motion.h2
            className="fw-bold mb-4"
            style={{ color: coral }}
            initial="hidden"
            whileInView="visible"
            variants={fadeUp()}
            viewport={{ once: true }}
          >
            Our Mission
          </motion.h2>
          <motion.p
            className="text-muted lead mx-auto"
            style={{ maxWidth: 800 }}
            initial="hidden"
            whileInView="visible"
            variants={fadeUp(0.2)}
            viewport={{ once: true }}
          >
            To create a seamless and delightful experience that merges the convenience of online
            exploration with the assurance of offline purchasing—ensuring every customer feels
            confident, inspired, and well-supported in upgrading their living spaces.
          </motion.p>
        </div>
      </section>

      {/* Call to Action */}
      <motion.section
        className="py-5 text-white text-center"
        style={{
          background: `linear-gradient(135deg, ${coral}, #ffa07a)`,
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp(0.3)}
      >
        <div className="container">
          <h2 className="fw-bold mb-3">Experience the InteDecor Difference</h2>
          <p className="lead mb-4">
            Discover the best of modern design, robust craftsmanship, and a hybrid buying journey.
          </p>
          <button className="btn btn-light text-danger fw-semibold rounded-pill px-4 py-2">
            Explore Products
          </button>
        </div>
      </motion.section>
    </main>
  );
}
