export default function Hero() {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 px-6 py-16 text-center text-white shadow-lg">
      <h1 className="text-4xl font-extrabold tracking-wide">
        Bajrang Parivaar 🚩
      </h1>

      <p className="mt-4 text-lg font-medium">
        एकजुट बजरंगी • संगठित समाज • सशक्त राष्ट्र
      </p>

      <p className="mx-auto mt-6 max-w-2xl text-orange-50 leading-relaxed">
        Bajrang Parivaar एक डिजिटल मंच है जो बजरंग दल के
        कार्यकर्ताओं को जोड़ने, संवाद बढ़ाने और सेवा कार्यों
        को सशक्त बनाने के लिए बनाया गया है।
      </p>

      <div className="mt-8">
        <button className="rounded-lg bg-white px-8 py-3 font-semibold text-orange-600 shadow hover:bg-orange-50">
          App Coming Soon
        </button>
      </div>
    </section>
  );
}
