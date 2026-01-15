export default function FounderSection() {
  return (
    <section className="mt-20 rounded-2xl bg-white p-10 shadow-md border-l-8 border-orange-500">
      <h2 className="text-center text-2xl font-bold text-orange-600">
        Founder & Vision
      </h2>

      <div className="mt-10 flex flex-col items-center text-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-orange-100 text-4xl font-bold text-orange-600">
          GD
        </div>

        <h3 className="mt-4 text-xl font-semibold">
          Gourav Dhankar
        </h3>

        <p className="text-sm text-gray-600">
          Jila Sanyojak, Bilaspur
        </p>

        <p className="mt-6 max-w-2xl text-gray-700 leading-relaxed">
          Bajrang Parivaar की परिकल्पना एक ऐसे डिजिटल मंच
          के रूप में की गई है जहाँ प्रत्येक बजरंगी अपने क्षेत्र,
          संगठन और सेवा कार्यों से जुड़ा रहे।
          <br /><br />
          यह केवल एक ऐप नहीं, बल्कि
          <strong className="text-orange-600">
            {" "}सेवा, सुरक्षा और संस्कार
          </strong>
          {" "}को सशक्त करने का माध्यम है।
        </p>
      </div>
    </section>
  );
}
