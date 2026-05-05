const OrderOnline = () => (
  <section className="section-padding bg-primary text-primary-foreground text-center">
    <div className="max-w-xl mx-auto">
      <h2 className="section-title text-primary-foreground mb-10">Commandez maintenant</h2>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold bg-[#00CCBC] text-white hover:bg-[#00b8a9] transition-colors duration-200"
        >
          Deliveroo
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold bg-black text-white hover:bg-neutral-800 transition-colors duration-200"
        >
          Uber Eats
        </a>
      </div>
    </div>
  </section>
);

export default OrderOnline;
