import prisma from '../../lib/prisma.js';

export const revalidate = 0;

export const metadata = {
  title: 'Registration | NEST Cluster Symposium 2026',
  description: 'Register for the NEST Cluster Symposium 2026.',
};

export default async function RegisterPage() {
  const intro = await prisma.contentBlock.findUnique({ where: { slug: 'registration-intro' } });
  const paymentDetails = await prisma.contentBlock.findUnique({ where: { slug: 'payment-details' } });
  const qrUrl = await prisma.contentBlock.findUnique({ where: { slug: 'payment-qr-url' } });
  const formUrl = await prisma.contentBlock.findUnique({ where: { slug: 'register-url' } });

  return (
    <div>
      {/* Hero */}
      <section className="page-hero" style={{ padding: '4rem 0 3rem' }}>
        <div className="container animate-fade-in">
          <h1>Registration</h1>
          <p style={{ maxWidth: '800px', margin: '0 auto' }}>
            {intro?.content || 'Please follow the steps below to complete your registration.'}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            
            {/* Step 1: Payment */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>1</div>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Make Payment</h2>
              </div>
              
              <p className="text-muted mb-4">
                Please complete your payment using the bank details or the QR code below. Ensure you save a screenshot or note the transaction ID.
              </p>

              <div style={{ backgroundColor: 'var(--bg-main)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                {paymentDetails?.content || 'Bank details will be displayed here.'}
              </div>

              {qrUrl?.content && (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: '600', marginBottom: '1rem' }}>Scan to Pay</p>
                  <img 
                    src={qrUrl.content} 
                    alt="Payment QR Code" 
                    style={{ maxWidth: '250px', margin: '0 auto', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem', backgroundColor: 'white' }} 
                  />
                </div>
              )}
            </div>

            {/* Step 2: Form */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>2</div>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Complete Form</h2>
              </div>
              
              <p className="text-muted mb-6">
                After successfully making the payment, click the button below to fill out the registration form. You will need to upload your payment screenshot and provide your transaction ID.
              </p>

              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
                {formUrl?.content ? (
                  <a 
                    href={formUrl.content} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', maxWidth: '300px' }}
                  >
                    Open Registration Form ↗
                  </a>
                ) : (
                  <p className="text-muted">Registration form is currently unavailable.</p>
                )}
              </div>
              
              <div style={{ marginTop: 'auto', backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <strong>Need help?</strong> Contact us at symposium@nestcluster.edu.in for any payment or registration issues.
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
