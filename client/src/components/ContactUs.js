import React from "react";
import { motion } from "framer-motion";

const coral = "#FF6F61";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: "easeOut" },
  },
});

export default function ContactUs() {
  return (
    <main className="bg-white text-dark" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Hero / Header */}
      <motion.section
        className="text-white text-center d-flex align-items-center justify-content-center"
        style={{
          background: `linear-gradient(135deg, ${coral}, #ffa07a)`,
          height: "50vh",
        }}
        initial="hidden"
        animate="visible"
        variants={fadeUp(0.2)}
      >
        <div className="px-3">
          <h1 className="display-4 fw-bold">Get in Touch</h1>
          <p className="lead">We’re here to help and answer any questions you might have.</p>
        </div>
      </motion.section>

      {/* Contact Section */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5">
            {/* Contact Info */}
            <motion.div
              className="col-lg-5"
              initial="hidden"
              whileInView="visible"
              variants={fadeUp(0.1)}
              viewport={{ once: true }}
            >
              <div className="bg-light rounded-4 shadow-sm p-4 h-100">
                <h4 className="fw-bold mb-4" style={{ color: coral }}>
                  Contact Details
                </h4>
                <ul className="list-unstyled mb-0">
                  <li className="mb-3">
                    📍 <strong>Address:</strong> InteDecor HQ, Main Market Road, Rajkot, Gujarat, India
                  </li>
                  <li className="mb-3">
                    📞 <strong>Phone:</strong> <a href="tel:+919876543210" className="text-dark text-decoration-none">+91 98765 43210</a>
                  </li>
                  <li className="mb-3">
                    ✉️ <strong>Email:</strong> <a href="mailto:contact@intedecor.com" className="text-dark text-decoration-none">contact@intedecor.com</a>
                  </li>
                  <li>
                    🕒 <strong>Working Hours:</strong> Mon - Sat, 9:00AM - 7:00PM
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className="col-lg-7"
              initial="hidden"
              whileInView="visible"
              variants={fadeUp(0.2)}
              viewport={{ once: true }}
            >
              <div className="bg-white shadow-lg rounded-4 p-4">
                <h4 className="fw-bold mb-4" style={{ color: coral }}>
                  Send Us a Message
                </h4>
                <form noValidate>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label visually-hidden">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control rounded-pill px-3"
                        placeholder="Your Name"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label visually-hidden">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control rounded-pill px-3"
                        placeholder="Your Email"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="subject" className="form-label visually-hidden">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        className="form-control rounded-pill px-3"
                        placeholder="Subject"
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="message" className="form-label visually-hidden">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        className="form-control rounded-4 px-3 py-2"
                        rows="5"
                        placeholder="Your Message"
                        required
                      ></textarea>
                    </div>
                    <div className="col-12 text-end">
                      <button
                        type="submit"
                        className="btn btn-lg rounded-pill px-4 text-white"
                        style={{ backgroundColor: coral }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
