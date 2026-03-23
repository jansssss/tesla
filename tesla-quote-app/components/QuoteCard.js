"use client";

import { formatWon } from "@/lib/quoteCalculations";

/**
 * QuoteCard Component
 * Reusable card for model and trim selection
 * Used in both single mode and comparison mode
 */
export default function QuoteCard({
  label,
  modelCatalog,
  selectedModelId,
  onModelChange,
  selectedTrimId,
  onTrimChange,
  className = ""
}) {
  const model = modelCatalog.find((item) => item.id === selectedModelId) || modelCatalog[0];
  const trim = model.trims.find((item) => item.id === selectedTrimId) || model.trims[0];

  const handleModelChange = (id) => {
    const nextModel = modelCatalog.find((item) => item.id === id);
    onModelChange(id);
    // Auto-select first trim of new model
    if (nextModel) {
      onTrimChange(nextModel.trims[0].id);
    }
  };

  return (
    <section className={`overflow-hidden rounded-2xl bg-white shadow-lg md:rounded-3xl ${className}`}>
      {/* Label for comparison mode */}
      {label && (
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 md:px-6 md:py-4">
          <h3 className="text-center text-base font-black md:text-lg">{label}</h3>
        </div>
      )}

      {/* Model Selection */}
      <div className="flex gap-2 border-b border-gray-200 p-4 md:gap-4 md:p-6">
        {modelCatalog.map((item) => (
          <button
            key={item.id}
            className={`flex-1 rounded-lg px-4 py-3 text-sm font-bold transition-all md:px-6 md:py-3 md:text-base ${
              selectedModelId === item.id
                ? "bg-black text-white shadow-md"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => handleModelChange(item.id)}
            aria-label={`${item.name} 모델 선택`}
            aria-pressed={selectedModelId === item.id}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Model Image and Stats */}
      <div className="bg-gradient-to-b from-gray-50 to-white p-5 md:p-6">
        <img
          className="h-[200px] w-full object-contain md:h-[280px]"
          src={model.image}
          alt={model.name}
        />

        <h2 className="mt-6 text-center text-xl font-medium leading-none tracking-normal md:mt-6 md:text-2xl">
          {model.name}
        </h2>

        <div className="mx-auto mb-5 mt-6 flex items-stretch justify-center divide-x divide-gray-200 text-center md:mb-6 md:mt-6 md:max-w-3xl">
          {trim.stats.map((item) => (
            <div key={item.label} className="flex-1 px-2 md:px-6">
              <strong className="block text-lg font-medium leading-none tracking-tight md:text-xl">
                {item.value}
                <span className="ml-0.5 text-xs font-normal md:text-sm">{item.unit}</span>
              </strong>
              <span className="mt-1 block text-[10px] font-normal leading-tight text-gray-500 md:mt-1.5 md:text-sm">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Trim Selection */}
        <div className="grid gap-2.5 md:gap-3">
          {model.trims.map((item) => (
            <button
              key={item.id}
              className={`flex items-start justify-between gap-3 rounded-xl px-4 py-4 text-left transition-all md:items-center md:rounded-2xl md:px-6 md:py-5 ${
                selectedTrimId === item.id
                  ? "bg-black text-white shadow-lg"
                  : "bg-white text-gray-900 hover:bg-gray-100 hover:shadow-md"
              }`}
              onClick={() => onTrimChange(item.id)}
              aria-label={`${item.label} 트림 선택, 가격 ${formatWon(item.price)}`}
              aria-pressed={selectedTrimId === item.id}
            >
              <span className="flex-1 pr-2 text-sm font-normal leading-snug md:text-base md:font-medium">
                {item.label}
              </span>
              <strong className="shrink-0 text-base font-extrabold md:text-lg">
                {formatWon(item.price)}
              </strong>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
