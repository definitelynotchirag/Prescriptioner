import {
    ArrowRightIcon,
    Bars3Icon,
    BellIcon,
    BoltIcon,
    CalendarIcon,
    CameraIcon,
    CheckCircleIcon,
    CircleStackIcon,
    CpuChipIcon,
    PlayIcon,
    ShieldCheckIcon,
    StarIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./landingPage.css";

// Feature Card Components
const MainFeatureCard = ({ icon, title, description, features, accentColor }) => {
    const colorClasses = {
        primary: "border-primary-500/30 hover:border-primary-400",
        blue: "border-accent-blue/30 hover:border-accent-blue",
        purple: "border-accent-purple/30 hover:border-accent-purple",
        green: "border-accent-green/30 hover:border-accent-green",
        orange: "border-accent-orange/30 hover:border-accent-orange",
        red: "border-accent-red/30 hover:border-accent-red",
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02, y: -8 }}
            transition={{ duration: 0.6 }}
            className={`bg-dark-800/80 backdrop-blur-sm p-10 rounded-3xl border ${colorClasses[accentColor]} transition-all duration-500 group feature-card`}
        >
            <div className="mb-8 group-hover:scale-110 transition-transform duration-300">{icon}</div>
            <h3 className="text-3xl font-bold mb-6 text-white group-hover:text-primary-400 transition-colors duration-300">
                {title}
            </h3>
            <p className="text-dark-300 leading-relaxed mb-8 text-lg">{description}</p>
            <ul className="space-y-3">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center text-dark-400">
                        <CheckCircleIcon className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
};

const SecondaryFeatureCard = ({ icon, title, description, accentColor }) => {
    const colorClasses = {
        primary: "border-primary-500/20 hover:border-primary-400 hover:bg-primary-500/5",
        blue: "border-accent-blue/20 hover:border-accent-blue hover:bg-accent-blue/5",
        purple: "border-accent-purple/20 hover:border-accent-purple hover:bg-accent-purple/5",
        green: "border-accent-green/20 hover:border-accent-green hover:bg-accent-green/5",
        orange: "border-accent-orange/20 hover:border-accent-orange hover:bg-accent-orange/5",
        red: "border-accent-red/20 hover:border-accent-red hover:bg-accent-red/5",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.6 }}
            className={`bg-dark-800/60 backdrop-blur-sm p-8 rounded-2xl border ${colorClasses[accentColor]} transition-all duration-300 group h-full`}
        >
            <div className="mb-6 group-hover:scale-110 transition-transform duration-300">{icon}</div>
            <h3 className="text-xl font-bold mb-4 text-white group-hover:text-primary-400 transition-colors duration-300">
                {title}
            </h3>
            <p className="text-dark-300 leading-relaxed text-sm">{description}</p>
        </motion.div>
    );
};

const LandingPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }

        // Handle scroll to show/hide scroll-to-top button
        const handleScroll = () => {
            setShowScrollTop(window.pageYOffset > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        localStorage.removeItem("user");
        navigate("/");
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const scrollToSection = sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 text-white font-bricolage overflow-x-hidden">
            {/* Navbar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8 }}
                className="fixed top-0 left-0 right-0 z-50 bg-dark-900/90 backdrop-blur-xl border-b border-dark-700/50"
            >
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <motion.div whileHover={{ scale: 1.05 }} className="text-3xl font-bold text-primary-400">
                            Prescriptioner
                        </motion.div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            {!isLoggedIn && (
                                <>
                                    <NavLink onClick={() => scrollToSection("features")}>Features</NavLink>
                                    <NavLink onClick={() => scrollToSection("how-it-works")}>How it Works</NavLink>
                                    <NavLink onClick={() => scrollToSection("testimonials")}>Reviews</NavLink>
                                </>
                            )}
                        </div>

                        <div className="flex items-center space-x-4">
                            {isLoggedIn ? (
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <img
                                            src="https://via.placeholder.com/40"
                                            alt="User"
                                            className="w-10 h-10 rounded-full border-2 border-primary-400 ring-2 ring-primary-400/20"
                                        />
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-dark-900"></div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleLogout}
                                        className="px-6 py-2 border border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-dark-900 transition-all duration-300 rounded-xl font-medium backdrop-blur-sm"
                                    >
                                        Logout
                                    </motion.button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <div className="hidden sm:flex items-center space-x-4">
                                        <Link to="/login">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-6 py-2 border border-primary-500/50 text-primary-400 hover:border-primary-400 hover:bg-primary-500/10 transition-all duration-300 rounded-xl font-medium backdrop-blur-sm"
                                            >
                                                Login
                                            </motion.button>
                                        </Link>
                                        <Link to="/signup">
                                            <motion.button
                                                whileHover={{
                                                    scale: 1.05,
                                                    boxShadow: "0 20px 40px rgba(251, 191, 36, 0.3)",
                                                }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-8 py-2 bg-primary-500 text-dark-900 rounded-xl hover:bg-primary-400 transition-all duration-300 font-semibold shadow-lg"
                                            >
                                                Get Started
                                            </motion.button>
                                        </Link>
                                    </div>

                                    {/* Mobile Menu Button */}
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                        className="sm:hidden p-2 text-primary-400 hover:text-primary-300 transition-colors duration-300"
                                    >
                                        {isMobileMenuOpen ? (
                                            <XMarkIcon className="w-6 h-6" />
                                        ) : (
                                            <Bars3Icon className="w-6 h-6" />
                                        )}
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && !isLoggedIn && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="sm:hidden bg-dark-900/95 backdrop-blur-xl border-b border-dark-700/50"
                    >
                        <div className="container mx-auto px-6 py-4 space-y-4">
                            <button
                                onClick={() => {
                                    scrollToSection("features");
                                    setIsMobileMenuOpen(false);
                                }}
                                className="block w-full text-left text-dark-300 hover:text-primary-400 transition-colors duration-300 font-medium py-2"
                            >
                                Features
                            </button>
                            <button
                                onClick={() => {
                                    scrollToSection("how-it-works");
                                    setIsMobileMenuOpen(false);
                                }}
                                className="block w-full text-left text-dark-300 hover:text-primary-400 transition-colors duration-300 font-medium py-2"
                            >
                                How it Works
                            </button>
                            <button
                                onClick={() => {
                                    scrollToSection("testimonials");
                                    setIsMobileMenuOpen(false);
                                }}
                                className="block w-full text-left text-dark-300 hover:text-primary-400 transition-colors duration-300 font-medium py-2"
                            >
                                Reviews
                            </button>
                            <div className="pt-4 space-y-3">
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <button className="w-full px-6 py-3 border border-primary-500/50 text-primary-400 hover:border-primary-400 hover:bg-primary-500/10 transition-all duration-300 rounded-xl font-medium">
                                        Login
                                    </button>
                                </Link>
                                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                    <button className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-400 text-dark-900 rounded-xl transition-all duration-300 font-semibold">
                                        Get Started
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden moving-gradient">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-hero-pattern opacity-30"></div>
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

                {/* Floating Particles */}
                <div className="floating-particles">
                    <span className="particle"></span>
                    <span className="particle"></span>
                    <span className="particle"></span>
                    <span className="particle"></span>
                </div>

                {/* Floating Orbs */}
                <div className="floating-orbs">
                    <div className="orb"></div>
                    <div className="orb"></div>
                    <div className="orb"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-6xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="mb-8"
                        >
                            <div className="inline-flex items-center px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-medium mb-8">
                                <StarIcon className="w-4 h-4 mr-2" />
                                AI-Powered Healthcare Solution
                            </div>

                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
                                <span className="text-primary-400">Scan</span>
                                <span className="text-white"> Prescriptions,</span>
                                <br />
                                <span className="text-white">Never </span>
                                <span className="text-accent-blue">Miss</span>
                                <span className="text-white"> a Dose</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-dark-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                                Revolutionary AI-powered prescription scanning that automatically creates
                                <span className="text-primary-400 font-semibold">
                                    {" "}
                                    intelligent medication reminders{" "}
                                </span>
                                in your Google Calendar
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-col sm:flex-row justify-center gap-6 mb-16"
                        >
                            <Link to="/dashboard">
                                <motion.button
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: "0 25px 50px rgba(251, 191, 36, 0.4)",
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group px-10 py-4 bg-primary-500 text-dark-900 rounded-2xl hover:bg-primary-400 transition-all duration-300 font-bold text-lg shadow-2xl flex items-center justify-center pulse-glow glow-button"
                                >
                                    <CameraIcon className="mr-3 group-hover:rotate-12 transition-transform duration-300 w-6 h-6" />
                                    Start Scanning Now
                                    <ArrowRightIcon className="ml-3 group-hover:translate-x-1 transition-transform duration-300 w-6 h-6" />
                                </motion.button>
                            </Link>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group px-10 py-4 border-2 border-primary-500 text-primary-400 rounded-2xl hover:bg-primary-500 hover:text-dark-900 transition-all duration-300 font-bold text-lg backdrop-blur-sm flex items-center justify-center glass"
                            >
                                <PlayIcon className="mr-3 group-hover:scale-110 transition-transform duration-300 w-5 h-5" />
                                Watch Demo
                            </motion.button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                        >
                            <StatCard number="99.9%" label="AI Accuracy Rate" />
                            <StatCard number="< 5 sec" label="Processing Time" />
                            <StatCard number="24/7" label="Always Available" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section id="how-it-works" className="py-32 bg-dark-800 relative">
                <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl md:text-6xl font-black mb-6 text-primary-400">How It Works</h2>
                        <p className="text-xl text-dark-300 max-w-2xl mx-auto">
                            Three simple steps to never miss your medication again
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        <ProcessStep
                            number="1"
                            icon={<CameraIcon className="w-10 h-10" />}
                            title="Capture Prescription"
                            description="Simply take a photo of your prescription using your smartphone camera. Our advanced image processing handles any lighting or angle."
                            delay={0.2}
                        />
                        <ProcessStep
                            number="2"
                            icon={<CpuChipIcon className="w-10 h-10" />}
                            title="AI Magic"
                            description="Our cutting-edge AI powered by Amazon Textract and Mixtral AI extracts medication details, dosage, and timing with 99.9% accuracy."
                            delay={0.4}
                        />
                        <ProcessStep
                            number="3"
                            icon={<CalendarIcon className="w-10 h-10" />}
                            title="Smart Reminders"
                            description="Intelligent reminders are automatically created in your Google Calendar, perfectly timed with your meal schedule and lifestyle."
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-32 relative">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl md:text-6xl font-black mb-6 text-primary-400">Powerful Features</h2>
                        <p className="text-xl text-dark-300 max-w-3xl mx-auto">
                            Built with cutting-edge technology to provide the most accurate and reliable medication
                            management experience
                        </p>
                    </motion.div>

                    <div className="max-w-7xl mx-auto">
                        {/* Main Feature Grid */}
                        <div className="grid lg:grid-cols-2 gap-8 mb-16">
                            {/* Large Feature Card 1 */}
                            <MainFeatureCard
                                icon={<BoltIcon className="w-16 h-16 text-primary-400" />}
                                title="Lightning-Fast OCR"
                                description="Amazon Textract technology extracts text from prescriptions in milliseconds with industry-leading accuracy"
                                features={["Real-time processing", "Multi-language support", "Handwriting recognition"]}
                                accentColor="primary"
                            />

                            {/* Large Feature Card 2 */}
                            <MainFeatureCard
                                icon={<CpuChipIcon className="w-16 h-16 text-accent-blue" />}
                                title="Advanced AI Processing"
                                description="Mixtral AI intelligently understands complex medication instructions and dosage patterns"
                                features={["Natural language processing", "Context understanding", "Error detection"]}
                                accentColor="blue"
                            />
                        </div>

                        {/* Secondary Features Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <SecondaryFeatureCard
                                icon={<CalendarIcon className="w-12 h-12 text-accent-purple" />}
                                title="Smart Calendar Integration"
                                description="Seamlessly integrates with Google Calendar for personalized medication schedules"
                                accentColor="purple"
                            />
                            <SecondaryFeatureCard
                                icon={<ShieldCheckIcon className="w-12 h-12 text-accent-green" />}
                                title="Bank-Grade Security"
                                description="Your health data is protected with enterprise-level security and encryption"
                                accentColor="green"
                            />
                            <SecondaryFeatureCard
                                icon={<CircleStackIcon className="w-12 h-12 text-accent-orange" />}
                                title="Reliable Data Storage"
                                description="MongoDB and Firebase ensure your prescription history is always accessible"
                                accentColor="orange"
                            />
                            <SecondaryFeatureCard
                                icon={<BellIcon className="w-12 h-12 text-accent-red" />}
                                title="Never Miss Again"
                                description="Intelligent notifications adapt to your routine and ensure perfect adherence"
                                accentColor="red"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            {/* <section id="testimonials" className="py-32 bg-dark-900 relative">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl md:text-6xl font-black mb-6 text-primary-400">Beta Testers Love It</h2>
                        <p className="text-xl text-dark-300">Early feedback from our beta testing program</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <TestimonialCard
                            name="Dr. Sarah Johnson"
                            role="Internal Medicine"
                            content="The AI accuracy is remarkable. During our beta testing, it correctly identified medication details from even challenging handwritten prescriptions."
                            rating={5}
                        />
                        <TestimonialCard
                            name="Beta Tester Mike"
                            role="Early Adopter"
                            content="The calendar integration is seamless. Setting up medication reminders has never been this effortless and intelligent."
                            rating={5}
                        />
                        <TestimonialCard
                            name="Healthcare Researcher"
                            role="Beta Program"
                            content="The technology behind this app is impressive. Amazon Textract combined with AI creates a powerful solution for medication management."
                            rating={5}
                        />
                    </div>
                </div>
            </section> */}

            {/* Tech Stack */}
            <section className="py-32 relative">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl md:text-6xl font-black mb-6 text-primary-400">
                            Built with Modern Technology
                        </h2>
                        <p className="text-xl text-dark-300 mb-8">
                            Powered by industry-leading technologies for maximum reliability and performance
                        </p>
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
                        <TechBadge name="React" color="blue" />
                        <TechBadge name="Node.js" color="green" />
                        <TechBadge name="MongoDB" color="green" />
                        <TechBadge name="Firebase" color="orange" />
                        <TechBadge name="Amazon Textract" color="orange" />
                        <TechBadge name="Mixtral AI" color="purple" />
                        <TechBadge name="Google Calendar API" color="blue" />
                        <TechBadge name="Tailwind CSS" color="primary" />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-dark-800 relative">
                <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h2 className="text-5xl md:text-6xl font-black mb-8 text-primary-400">Ready to Get Started?</h2>
                        <p className="text-xl md:text-2xl text-dark-300 mb-12 leading-relaxed">
                            Experience the future of medication management with cutting-edge AI technology
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
                            <Link to="/signup">
                                <motion.button
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: "0 25px 50px rgba(251, 191, 36, 0.4)",
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-12 py-4 bg-primary-500 text-dark-900 rounded-2xl hover:bg-primary-400 transition-all duration-300 font-bold text-xl shadow-2xl glow-button"
                                >
                                    Register Now
                                </motion.button>
                            </Link>
                        </div>

                        {/* <div className="flex justify-center items-center space-x-8 text-dark-400 mb-16">
                            <div className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2" />
                                Free forever
                            </div>
                            <div className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2" />
                                No credit card required
                            </div>
                            <div className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2" />
                                Setup in 30 seconds
                            </div>
                        </div> */}

                        {/* Newsletter Signup */}
                        {/* <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="max-w-md mx-auto"
                        >
                            <h3 className="text-xl font-semibold text-white mb-4">Stay Updated</h3>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-3 bg-dark-800/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors duration-300"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-3 bg-primary-500 text-dark-900 rounded-xl hover:bg-primary-400 transition-colors duration-300 font-semibold"
                                >
                                    Subscribe
                                </motion.button>
                            </div>
                        </motion.div> */}
                    </motion.div>
                </div>
            </section>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <motion.button
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 w-16 h-16 bg-primary-500 text-dark-900 rounded-full shadow-lg flex items-center justify-center text-2xl font-bold hover:bg-primary-600 transition-all duration-300"
                >
                    ↑
                </motion.button>
            )}

            {/* Footer */}
            <footer className="border-t border-dark-700/50 py-12 bg-dark-900/90 backdrop-blur-xl">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-primary-400 mb-4">Prescriptioner</h3>
                            <p className="text-dark-400 mb-4">
                                AI-powered medication management for a healthier tomorrow.
                            </p>
                            {/* <div className="flex space-x-4">
                                <SocialLink />
                                <SocialLink />
                                <SocialLink />
                            </div> */}
                        </div>

                        {/* <div>
                            <h4 className="font-semibold text-white mb-4">Product</h4>
                            <FooterLink text="Features" />
                            <FooterLink text="How it Works" />
                            <FooterLink text="Pricing" />
                            <FooterLink text="API" />
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Company</h4>
                            <FooterLink text="About" />
                            <FooterLink text="Blog" />
                            <FooterLink text="Careers" />
                            <FooterLink text="Contact" />
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Support</h4>
                            <FooterLink text="Help Center" />
                            <FooterLink text="Privacy Policy" />
                            <FooterLink text="Terms of Service" />
                            <FooterLink text="Security" />
                        </div> */}
                    </div>

                    <div className="border-t border-dark-700/50 pt-8 text-center text-dark-400">
                        <p>Built for healthcare innovation with ❤️</p>
                    </div>
                </div>
            </footer>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-3 bg-primary-500 text-dark-900 rounded-full shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 hover:scale-110"
                >
                    <ArrowRightIcon className="w-6 h-6 transform -rotate-90" />
                </motion.button>
            )}
        </div>
    );
};

// Component definitions
const NavLink = ({ onClick, children }) => (
    <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        className="text-dark-300 hover:text-primary-400 transition-colors duration-300 font-medium"
    >
        {children}
    </motion.button>
);

const StatCard = ({ number, label }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className="text-center p-6 bg-dark-800/50 backdrop-blur-sm border border-dark-700/50 rounded-2xl"
    >
        <div className="text-3xl font-bold text-primary-400 mb-2">{number}</div>
        <div className="text-dark-300">{label}</div>
    </motion.div>
);

const ProcessStep = ({ number, icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        whileHover={{ scale: 1.05 }}
        className="text-center group"
    >
        <div className="relative mb-8">
            <div className="w-20 h-20 bg-primary-500 text-dark-900 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black shadow-2xl group-hover:shadow-primary-500/50 transition-all duration-300">
                {number}
            </div>
            <div className="absolute -top-3 -right-3 bg-dark-800 rounded-2xl p-3 text-primary-400 border border-primary-500/30 group-hover:border-primary-400 transition-all duration-300">
                {icon}
            </div>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-primary-400">{title}</h3>
        <p className="text-dark-300 leading-relaxed">{description}</p>
    </motion.div>
);

const TestimonialCard = ({ name, role, content, rating }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.6 }}
        className="bg-dark-800/50 p-8 rounded-3xl border border-dark-700/50 backdrop-blur-sm"
    >
        <div className="flex mb-4">
            {[...Array(rating)].map((_, i) => (
                <StarIcon key={i} className="w-5 h-5 text-primary-400 fill-current" />
            ))}
        </div>
        <p className="text-dark-200 leading-relaxed mb-6 italic">"{content}"</p>
        <div>
            <div className="font-semibold text-white">{name}</div>
            <div className="text-dark-400">{role}</div>
        </div>
    </motion.div>
);

const TechBadge = ({ name, color = "primary" }) => {
    const colorClasses = {
        primary: "bg-primary-500 text-dark-900",
        blue: "bg-accent-blue text-white",
        green: "bg-accent-green text-white",
        purple: "bg-accent-purple text-white",
        orange: "bg-accent-orange text-white",
        red: "bg-accent-red text-white",
    };

    return (
        <motion.div
            whileHover={{ scale: 1.1, y: -5 }}
            className={`px-6 py-3 ${colorClasses[color]} rounded-2xl font-semibold shadow-lg cursor-pointer`}
        >
            {name}
        </motion.div>
    );
};

const FooterLink = ({ text }) => (
    <button className="block text-dark-400 hover:text-primary-400 transition-colors duration-300 mb-2 text-left">
        {text}
    </button>
);

const SocialLink = () => (
    <div className="w-10 h-10 bg-dark-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors duration-300 cursor-pointer">
        <div className="w-4 h-4 bg-dark-400 rounded-full"></div>
    </div>
);

export default LandingPage;
