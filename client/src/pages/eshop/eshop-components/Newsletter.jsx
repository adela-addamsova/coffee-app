import ArrowIcon from '../../../assets/e-shop/eshop-components/newsletter-arrow.svg';

export default function NewsletterSection() {
    return (
        <section className="newsletter-section">
            <div className='newsletter-content'>
                <h2>Stay in the picture. Sign up for the newsletter.</h2>
                <form>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        required
                    />
                    <button type="submit">
                        <img src={ArrowIcon} alt="Arrow Icon" className="w-8 h-8" />
                    </button>
                </form>
                <p className="newsletter-content-text">By entering your email, you agree to the privacy policy.</p>
            </div>
        </section>
    );
}
