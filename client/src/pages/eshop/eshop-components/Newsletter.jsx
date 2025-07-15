import { useState } from 'react';
import ArrowIcon from '../../../assets/e-shop/eshop-components/newsletter-arrow.svg';
import { newsletterSchema } from '../../../../../shared/NewsletterValidationSchema';

const API_URL = import.meta.env.VITE_API_URL;

export default function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null);
    const [validationError, setValidationError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);
        setValidationError('');

        const result = newsletterSchema.safeParse({ email });
        if (!result.success) {
            setStatus('validationError');
            setValidationError(result.error.errors[0].message);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setStatus('success');
                setEmail('');
            } else if (response.status === 409) {
                setStatus('exists');
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <section className="newsletter-section">
            <div className="newsletter-content">
                <h2>Stay in the picture. Sign up for the newsletter.</h2>
                <form onSubmit={handleSubmit} noValidate>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-describedby="email-error"
                    />
                    <button type="submit">
                        <img src={ArrowIcon} alt="Arrow Icon" className="w-8 h-8" />
                    </button>
                </form>

                {status === 'validationError' && (
                    <p id="email-error" className="newsletter-error">{validationError}</p>
                )}
                {status === 'success' && (
                    <p className="newsletter-success">Thank you for subscribing!</p>
                )}
                {status === 'exists' && (
                    <p className="newsletter-error">You are already subscribed.</p>
                )}
                {status === 'error' && (
                    <p className="newsletter-error">Something went wrong. Please try again.</p>
                )}

                <p className="newsletter-content-text">
                    By entering your email, you agree to the privacy policy.
                </p>
            </div>
        </section>
    );
}
