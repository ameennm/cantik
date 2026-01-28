import { WHATSAPP_NUMBER } from '../data/products';
import './AboutPage.css';

const AboutPage = () => {
    const handleWhatsAppClick = () => {
        const message = encodeURIComponent("Hi! I'd like to know more about Cantik.");
        window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
    };

    return (
        <div className="about-page">
            {/* Hero */}
            <section className="about-hero">
                <div className="about-hero-bg">
                    <img
                        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80"
                        alt="Fashion boutique"
                    />
                    <div className="about-hero-overlay"></div>
                </div>
                <div className="about-hero-content container">
                    <h1>Our Story</h1>
                    <p className="about-hero-subtitle">Where Beauty Meets Elegance</p>
                </div>
            </section>

            {/* Brand Story */}
            <section className="section about-story">
                <div className="container">
                    <div className="story-content">
                        <div className="story-text">
                            <h2>The Meaning of Cantik</h2>
                            <p className="lead">
                                <strong>Cantik</strong> means "beautiful" in Indonesian – a word that perfectly
                                captures our mission to make every woman feel confident and elegant.
                            </p>
                            <p>
                                Founded with a passion for fashion and a commitment to quality, Cantik was born
                                from the belief that every woman deserves access to beautiful, well-crafted
                                clothing that doesn't break the bank.
                            </p>
                            <p>
                                Our journey began with a simple idea: to curate a collection of dresses that
                                combine timeless elegance with contemporary style. From casual day dresses to
                                stunning party gowns, from traditional ethnic wear to trendy western outfits –
                                we've got something for every occasion and every mood.
                            </p>
                        </div>
                        <div className="story-image">
                            <img
                                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80"
                                alt="Fashion collection"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section why-choose-section">
                <div className="container">
                    <h2 className="text-center">Why Choose Cantik?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </div>
                            <h3>Premium Quality</h3>
                            <p>
                                We source only the finest fabrics and work with skilled artisans to ensure
                                every piece meets our high standards. Quality you can feel.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                    <line x1="9" y1="9" x2="9.01" y2="9" />
                                    <line x1="15" y1="9" x2="15.01" y2="9" />
                                </svg>
                            </div>
                            <h3>Customer First</h3>
                            <p>
                                Your satisfaction is our priority. From easy ordering via WhatsApp to
                                hassle-free returns, we make shopping a pleasure.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                    <line x1="7" y1="7" x2="7.01" y2="7" />
                                </svg>
                            </div>
                            <h3>Best Prices</h3>
                            <p>
                                By working directly with manufacturers, we cut out middlemen and pass
                                the savings to you. Designer looks at boutique prices.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="1" y="3" width="15" height="13" />
                                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                    <circle cx="5.5" cy="18.5" r="2.5" />
                                    <circle cx="18.5" cy="18.5" r="2.5" />
                                </svg>
                            </div>
                            <h3>Fast Delivery</h3>
                            <p>
                                Order today, wear tomorrow! We offer quick shipping across India with
                                free delivery on orders above ₹999.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </div>
                            <h3>Trendy Collection</h3>
                            <p>
                                Our team constantly scouts the latest fashion trends to bring you fresh
                                styles every season. Stay ahead of the curve.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    <polyline points="9 12 11 14 15 10" />
                                </svg>
                            </div>
                            <h3>Trusted & Secure</h3>
                            <p>
                                Shop with confidence. We've served thousands of happy customers and
                                prioritize the security of every transaction.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="section contact-section">
                <div className="container">
                    <div className="contact-card">
                        <div className="contact-content">
                            <h2>Have Questions?</h2>
                            <p>
                                We'd love to hear from you! Whether you have questions about sizing,
                                orders, or just want to say hello – we're here to help.
                            </p>
                            <button className="btn btn-primary btn-lg" onClick={handleWhatsAppClick}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Chat with Us on WhatsApp
                            </button>
                        </div>
                        <div className="contact-image">
                            <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"
                                alt="Customer service"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
