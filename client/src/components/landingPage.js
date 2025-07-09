import {
    ArrowRightIcon,
    Bars3Icon,
    CalendarIcon,
    CameraIcon,
    CheckCircleIcon,
    CpuChipIcon,
    PlayIcon,
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
            className={`bg-dark-800/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border ${colorClasses[accentColor]} transition-all duration-500 group feature-card`}
        >
            <div className="mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">{icon}</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white group-hover:text-primary-400 transition-colors duration-300">
                {title}
            </h3>
            <p className="text-dark-300 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">{description}</p>
            <ul className="space-y-2">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center text-dark-400 text-sm">
                        <CheckCircleIcon className="w-4 h-4 text-primary-400 mr-2 flex-shrink-0" />
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
            className={`bg-dark-800/60 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border ${colorClasses[accentColor]} transition-all duration-300 group h-full`}
        >
            <div className="mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white group-hover:text-primary-400 transition-colors duration-300">
                {title}
            </h3>
            <p className="text-dark-300 leading-relaxed text-xs sm:text-sm">{description}</p>
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
        <div className="min-h-screen text-white font-bricolage overflow-x-hidden moving-gradient">
            {/* Navbar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8 }}
                className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-xl border-b border-dark-700/50"
            >
                <div className="container mx-auto px-4 py-2 sm:py-3">
                    <div className="flex justify-between items-center">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="text-xl sm:text-2xl font-bold text-primary-400"
                        >
                            Prescriptioner
                        </motion.div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
                            {!isLoggedIn && (
                                <>
                                    <NavLink onClick={() => scrollToSection("features")}>Features</NavLink>
                                    <NavLink onClick={() => scrollToSection("how-it-works")}>How it Works</NavLink>
                                    <NavLink onClick={() => navigate("/dashboard")}>Dashboard</NavLink>
                                </>
                            )}
                        </div>

                        <div className="flex items-center space-x-3 sm:space-x-4">
                            {isLoggedIn ? (
                                <div className="flex items-center space-x-3 sm:space-x-4">
                                    <div className="relative">
                                        <img
                                            src="https://via.placeholder.com/40"
                                            alt="User"
                                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-primary-400 ring-2 ring-primary-400/20"
                                        />
                                        <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-dark-900"></div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleLogout}
                                        className="px-3 sm:px-4 py-1 sm:py-2 border border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-dark-900 transition-all duration-300 rounded-xl text-sm sm:text-base font-medium backdrop-blur-sm"
                                    >
                                        Logout
                                    </motion.button>
                                    
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2 sm:space-x-4">
                                    <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
                                        <Link to="/login">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-3 sm:px-6 py-1 sm:py-2 border border-primary-500/50 text-primary-400 hover:border-primary-400 hover:bg-primary-500/10 transition-all duration-300 rounded-xl text-sm sm:text-base font-medium backdrop-blur-sm"
                                            >
                                                Login
                                            </motion.button>
                                        </Link>
                                        <Link to="/signup">
                                            <motion.button
                                                whileHover={{
                                                    scale: 1.05,
                                                    boxShadow: "0 10px 20px rgba(251, 191, 36, 0.3)",
                                                }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-4 sm:px-6 py-1 sm:py-2 bg-primary-500 text-dark-900 rounded-xl hover:bg-primary-400 transition-all duration-300 text-sm sm:text-base font-semibold shadow-lg"
                                            >
                                                Get Started
                                            </motion.button>
                                        </Link>
                                    </div>

                                    {/* Mobile Menu Button */}
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                        className="sm:hidden p-1 text-primary-400 hover:text-primary-300 transition-colors duration-300"
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
                        <div className="container mx-auto px-4 py-3 space-y-3">
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
                                    scrollToSection("login");
                                    setIsMobileMenuOpen(false);
                                }}
                                className="block w-full text-left text-dark-300 hover:text-primary-400 transition-colors duration-300 font-medium py-2"
                            >
                                Login
                            </button>
                            <div className="pt-2 space-y-2">
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <button className="w-full px-4 py-2 border border-primary-500/50 text-primary-400 hover:border-primary-400 hover:bg-primary-500/10 transition-all duration-300 rounded-xl text-sm font-medium">
                                        Login
                                    </button>
                                </Link>
                                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                    <button className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-400 text-dark-900 rounded-xl transition-all duration-300 text-sm font-semibold">
                                        Get Started
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.nav>

            {/* Hero Section */}
            <section className="relative pt-20 sm:pt-24 md:pt-28 pb-10 sm:pb-16 overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 mt-10 sm:mt-16">
                    <div className="max-w-6xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="mb-6"
                        >
                            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black mb-4 sm:mb-6 leading-tight">
                                <span className="text-primary-400">Scan</span>
                                <span className="text-white"> Prescriptions</span>
                                <br />
                                <span className="text-white">Never </span>
                                <span className="text-accent-blue">Miss</span>
                                <span className="text-white"> a Dose</span>
                            </h1>

                            <p className="p-3 sm:p-0 text-xs sm:text-sm md:text-lg mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed text-dark-300">
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
                            className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-8 sm:mb-12"
                        >
                            <Link to="/dashboard">
                                <motion.button
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: "0 15px 30px rgba(251, 191, 36, 0.4)",
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group px-4 py-2 sm:px-8 sm:py-3 bg-primary-500 text-dark-900 rounded-xl sm:rounded-2xl hover:bg-primary-400 transition-all duration-300 font-bold text-sm sm:text-base shadow-xl flex items-center justify-center pulse-glow glow-button w-full sm:w-auto mb-3 sm:mb-0"
                                >
                                    Start Scanning Now
                                    <ArrowRightIcon className="ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300 w-4 h-4 sm:w-5 sm:h-5" />
                                </motion.button>
                            </Link>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group px-10 py-2 sm:px-8 sm:py-3 border-2 border-primary-500 text-primary-400 rounded-xl sm:rounded-2xl hover:bg-primary-500 hover:text-dark-900 transition-all duration-300 font-bold text-sm sm:text-base backdrop-blur-sm flex items-center justify-center glass sm:w-auto"
                            >
                                <PlayIcon className="mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-300 w-4 h-4 sm:w-5 sm:h-5" />
                                Watch Demo
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section id="how-it-works" className="py-8 sm:py-12 md:py-20 relative">
                <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-6 sm:mb-10"
                    >
                        <h2 className="text-xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-4 text-primary-400">
                            How It Works
                        </h2>
                        <p className="text-sm sm:text-base text-dark-300 max-w-2xl mx-auto">
                            Three simple steps to never miss your medication again
                        </p>
                    </motion.div>

                    <div className="grid gap-4 sm:gap-6 md:gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                        <ProcessStep
                            number="1"
                            icon={<CameraIcon className="w-8 h-8" />}
                            title="Capture Prescription"
                            description="Simply take a photo of your prescription using your smartphone camera. Our advanced image processing handles any lighting or angle."
                            delay={0.2}
                        />
                        <ProcessStep
                            number="2"
                            icon={<CpuChipIcon className="w-8 h-8" />}
                            title="AI Magic"
                            description="Our cutting-edge AI powered by Amazon Textract and Mixtral AI extracts medication details, dosage, and timing with 99.9% accuracy."
                            delay={0.4}
                        />
                        <ProcessStep
                            number="3"
                            icon={<CalendarIcon className="w-8 h-8" />}
                            title="Smart Reminders"
                            description="Intelligent reminders are automatically created in your Google Calendar, perfectly timed with your meal schedule and lifestyle."
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-8 sm:py-12 md:py-20 relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-6 sm:mb-10"
                    >
                        <h2 className="text-xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-4 text-primary-400">
                            Key Features
                        </h2>
                        <p className="text-sm sm:text-base text-dark-300 max-w-3xl mx-auto">
                            Built with cutting-edge technology for reliable medication management
                        </p>
                    </motion.div>

                    <div className="max-w-7xl mx-auto grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 md:grid-cols-4">
                        <div className="bg-dark-800/60 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border border-primary-500/20 hover:border-primary-400">
                            <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 text-white">
                                Fast OCR
                            </h3>
                            <p className="text-dark-300 leading-relaxed text-xs">
                                Amazon Textract extracts text from prescriptions in milliseconds
                            </p>
                        </div>
                        <div className="bg-dark-800/60 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border border-primary-500/20 hover:border-primary-400">
                            <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 text-white">
                                AI Processing
                            </h3>
                            <p className="text-dark-300 leading-relaxed text-xs">
                                Mixtral AI understands complex medication instructions
                            </p>
                        </div>
                        <div className="bg-dark-800/60 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border border-primary-500/20 hover:border-primary-400">
                            <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 text-white">
                                Calendar Integration
                            </h3>
                            <p className="text-dark-300 leading-relaxed text-xs">
                                Seamlessly syncs with Google Calendar for medication schedules
                            </p>
                        </div>
                        <div className="bg-dark-800/60 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border border-primary-500/20 hover:border-primary-400">
                            <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 text-white">
                                Smart Reminders
                            </h3>
                            <p className="text-dark-300 leading-relaxed text-xs">
                                Intelligent notifications adapt to your routine
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-4 sm:py-6 backdrop-blur-xl">
                <div className="container mx-auto px-4">
                    <div className="border-t border-dark-700/50 pt-4 text-center text-dark-400 text-sm">
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
                    className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 p-2 sm:p-3 bg-primary-500 text-dark-900 rounded-full shadow-xl hover:shadow-primary-500/50 transition-all duration-300 hover:scale-110"
                >
                    <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 transform -rotate-90" />
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
        className="text-dark-300 hover:text-primary-400 transition-colors duration-300 font-medium text-sm sm:text-base"
    >
        {children}
    </motion.button>
);

const ProcessStep = ({ number, icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        whileHover={{ scale: 1.05 }}
        className="text-center group"
    >
        <div className="relative mb-4 sm:mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-500 text-dark-900 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto text-lg sm:text-xl font-black shadow-xl group-hover:shadow-primary-500/50 transition-all duration-300">
                {number}
            </div>
        </div>
        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-primary-400">{title}</h3>
        <p className="text-dark-300 leading-relaxed text-xs sm:text-sm">{description}</p>
    </motion.div>
);

export default LandingPage;
