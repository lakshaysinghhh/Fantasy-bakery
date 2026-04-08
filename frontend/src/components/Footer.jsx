const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "About Us", action: () => scrollToSection("about") },
        { name: "Products", action: () => scrollToSection("products") },
        { name: "Contact", action: () => scrollToSection("contact") },
      ],
    },
    {
      title: "Services",
      links: [
        { name: "Custom Cakes", action: () => scrollToSection("products") },
        { name: "Delivery", action: () => scrollToSection("contact") },
        { name: "Gift Cards", action: () => scrollToSection("contact") },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", action: () => window.open("/privacy", "_blank") },
        { name: "Terms of Service", action: () => window.open("/terms", "_blank") },
        { name: "Refund Policy", action: () => window.open("/refund", "_blank") },
      ],
    },
  ];

  const socialLinks = [
    { icon: "📘", url: "#" },
    { icon: "📷", url: "#" },
    { icon: "🐦", url: "#" },
    { icon: "📧", url: "mailto:info@fantasybakery.com" },
  ];

  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-white/10">
      <div className="container mx-auto px-4 py-14">

        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🧁</span>
              <span className="text-lg font-semibold text-white">
                Fantasy Bakery
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Premium bakery experience with handcrafted cakes, desserts, and
              delightful flavors made fresh every day.
            </p>

            <div className="flex gap-3">
              {socialLinks.map((social, i) => (
                <button
                  key={i}
                  onClick={() => social.url && window.open(social.url, "_blank")}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition"
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section, i) => (
            <div key={i}>
              <h3 className="text-white font-semibold mb-4 text-sm tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <button
                      onClick={link.action}
                      className="text-sm text-gray-400 hover:text-white transition"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/10 pt-10 mb-10 text-center">
          <h3 className="text-white text-lg font-semibold mb-2">
            Subscribe for Updates
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Get latest offers and new product updates
          </p>

          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            />
            <button className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-300 transition text-sm">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2026 Fantasy Bakery. All rights reserved.</p>

          <div className="flex items-center gap-1 mt-3 md:mt-0">
            <span>Made with</span>
            <span className="text-red-400">♥</span>
            <span>in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;