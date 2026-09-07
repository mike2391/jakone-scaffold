export const dynamic = "force-static";

export default function ProductPage() {
  return (
    <main>
      <h1>Tabungan JakOne</h1>
      <p>Simple, flexible savings for your everyday needs.</p>

      <section aria-labelledby="product-details">
        <h2 id="product-details">Product details</h2>
        <dl>
          <div>
            <dt>Interest rate</dt>
            <dd>3.00% per year</dd>
          </div>
          <div>
            <dt>Minimum opening deposit</dt>
            <dd>Rp100,000</dd>
          </div>
          <div>
            <dt>Terms</dt>
            <dd>No fixed term; withdraw your funds whenever you need them.</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
