"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Instagram, Linkedin, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTheme } from './ThemeContext';
import EmailCopyButton from './EmailCopyButton';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const ContactSection = ({ sectionRef }) => {
  const { darkMode, currentTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Message sent successfully! I'll get back to you soon.");
        setFormData({
          name: '',
          email: '',
          message: '',
    website: ''
        });
      } else {
        if (response.status === 429 || response.status === 400) {
          const data = await response.json().catch(() => ({}));
          toast.error(data.error || "Please check your submission.");
          return;
        }
        throw new Error("API endpoint not available");
      }
    } catch (error) {
      console.warn("API failed, using mailto fallback:", error);

      const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      const mailtoUrl = `mailto:aliqyaan12@gmail.com?subject=${subject}&body=${body}`;

      try {
        window.location.href = mailtoUrl;
        toast.success("Opening email app with your message!");

        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            message: '',
    website: ''
          });
        }, 1000);
      } catch (mailtoError) {
        const messageText = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;

        if (navigator.clipboard) {
          try {
            await navigator.clipboard.writeText(messageText);
            toast.info("Message copied to clipboard! Please email it to aliqyaan12@gmail.com");
          } catch (clipboardError) {
            toast.error("Please email your message directly to aliqyaan12@gmail.com");
          }
        } else {
          toast.error("Please email your message directly to aliqyaan12@gmail.com");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-14 sm:py-20 px-3 sm:px-6"
      aria-label="Contact information and form"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl font-bold mb-8 tracking-tight"
            style={{ paddingBottom: '0.1em' }}
          >
            Let&apos;s{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.accent})`
              }}
            >
              Connect
            </span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-xl mb-8 sm:mb-12 opacity-80 leading-relaxed text-balance"
          >
            I&apos;m always open to discussing new opportunities, collaborations, or just having a chat about technology!
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12"
          >
            <div
              className="p-6 sm:p-8 rounded-2xl flex flex-col items-center"
              style={{
                backgroundColor: currentTheme.cardBg,
                border: `1px solid ${currentTheme.cardBorder}`
              }}
            >
              <Mail size={28} style={{ color: currentTheme.primary }} className="mb-4" />
              <h3 className="font-semibold mb-2">Email</h3>
              <EmailCopyButton currentTheme={currentTheme} />
            </div>

            <div
              className="p-6 sm:p-8 rounded-2xl flex flex-col items-center"
              style={{
                backgroundColor: currentTheme.cardBg,
                border: `1px solid ${currentTheme.cardBorder}`
              }}
            >
              <Instagram size={28} style={{ color: currentTheme.primary }} className="mb-4" />
              <h3 className="font-semibold mb-2">Instagram</h3>
              <a
                href="https://instagram.com/aliqyaan_12"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline transition-colors"
                style={{ color: currentTheme.primary }}
              >
                @aliqyaan_12
              </a>
            </div>

            <div
              className="p-6 sm:p-8 rounded-2xl flex flex-col items-center"
              style={{
                backgroundColor: currentTheme.cardBg,
                border: `1px solid ${currentTheme.cardBorder}`
              }}
            >
              <Linkedin size={28} style={{ color: currentTheme.primary }} className="mb-4" />
              <h3 className="font-semibold mb-2">LinkedIn</h3>
              <a
                href="https://www.linkedin.com/in/aliqyaan-mahimwala/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline transition-colors"
                style={{ color: currentTheme.primary }}
              >
                Connect with me
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            variants={fadeInUp}
            onSubmit={handleSubmit}
            className="w-full mb-8 sm:mb-12"
          >
            <div
              className="p-6 sm:p-8 rounded-3xl text-left"
              style={{
                backgroundColor: currentTheme.cardBg,
                border: `1px solid ${currentTheme.cardBorder}`
              }}
            >
              <h3 className="text-2xl font-bold mb-6 text-center tracking-tight" style={{ paddingBottom: '0.1em' }}>Send Me a Message</h3>

              {/* Honeypot field for bot spam prevention (invisible to humans) */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="mb-4 sm:mb-6">
                <label htmlFor="name" className="block mb-2 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: currentTheme.background,
                    border: `1px solid ${currentTheme.cardBorder}`,
                    color: currentTheme.foreground,
                    '--focus-ring-color': currentTheme.primary
                  }}
                  placeholder="Your name"
                  required
                  aria-required="true"
                  autoComplete="name"
                />
              </div>

              <div className="mb-4 sm:mb-6">
                <label htmlFor="email" className="block mb-2 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: currentTheme.background,
                    border: `1px solid ${currentTheme.cardBorder}`,
                    color: currentTheme.foreground,
                    '--focus-ring-color': currentTheme.primary
                  }}
                  placeholder="Your email address"
                  required
                  aria-required="true"
                  autoComplete="email"
                />
              </div>

              <div className="mb-6 sm:mb-8">
                <label htmlFor="message" className="block mb-2 font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full p-4 rounded-xl resize-none focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: currentTheme.background,
                    border: `1px solid ${currentTheme.cardBorder}`,
                    color: currentTheme.foreground,
                    '--focus-ring-color': currentTheme.primary
                  }}
                  placeholder="Your message"
                  required
                  aria-required="true"
                ></textarea>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full min-h-[44px] py-4 rounded-xl font-medium transition-shadow duration-300 flex items-center justify-center disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  background: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.accent})`,
                  opacity: isSubmitting ? 0.7 : 1,
                  color: currentTheme.primaryText,
                  '--tw-ring-color': currentTheme.primary
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </motion.button>
            </div>
          </motion.form>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-4 sm:gap-6"
          >
            <motion.a
              href="mailto:aliqyaan12@gmail.com"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="min-h-[44px] px-6 py-3 sm:px-8 sm:py-4 rounded-full font-medium transition-shadow duration-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 inline-flex items-center"
              style={{
                background: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.accent})`,
                color: darkMode ? currentTheme.lightBgText : currentTheme.darkBgText,
                '--tw-ring-color': currentTheme.primary
              }}
              aria-label="Send email to Aliqyaan"
            >
              <Mail size={18} className="mr-2" aria-hidden="true" /> Email Me
            </motion.a>

            <motion.a
              href="https://instagram.com/aliqyaan_12"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="min-h-[44px] px-6 py-3 sm:px-8 sm:py-4 rounded-full border-2 font-medium transition-shadow duration-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 inline-flex items-center"
              style={{
                borderColor: currentTheme.primary,
                color: currentTheme.primary,
                '--tw-ring-color': currentTheme.primary
              }}
              aria-label="Visit Instagram profile"
            >
              <Instagram size={18} className="mr-2" aria-hidden="true" /> Instagram
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/aliqyaan-mahimwala/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="min-h-[44px] px-6 py-3 sm:px-8 sm:py-4 rounded-full border-2 font-medium transition-shadow duration-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 inline-flex items-center"
              style={{
                borderColor: currentTheme.primary,
                color: currentTheme.primary,
                '--tw-ring-color': currentTheme.primary
              }}
              aria-label="Visit LinkedIn profile"
            >
              <Linkedin size={18} className="mr-2" aria-hidden="true" /> LinkedIn
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
