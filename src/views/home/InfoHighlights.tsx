import { infoHighlights } from "@/data/migration-content";

export const InfoHighlights = () => {
  return (
    <div className="bg-[#d9614e42]">
      <div className="max-w-screen-xl mx-auto px-3 mb-5 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 relative">
          {infoHighlights.map((highlight, index) => (
            <div key={highlight.id} className={`p-4 ${index === 2 ? "mx-5 relative" : "mx-5"}`}>
              <div className="flex flex-row gap-3 items-center">
                <img src={highlight.icon} alt="" className="h-12" />
                <h2 className="text-xl font-bold mb-2">{highlight.title}</h2>
              </div>
              <p>{highlight.description}</p>

              {/* Image like stamp or chop - only for last item */}
              {index === 2 && (
                <div className="absolute bottom-0 right-0 -mb-24 md:-mb-12 mr-0 md:-mr-24">
                  <img src="/images/bestql.png" alt="Stamp" className="w-28 h-auto" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
