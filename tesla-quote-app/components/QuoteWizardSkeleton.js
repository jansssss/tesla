/**
 * QuoteWizardSkeleton Component
 * Loading skeleton for quote wizard
 */
export default function QuoteWizardSkeleton() {
  return (
    <div className="mx-auto grid max-w-[1400px] gap-5 px-4 py-5 md:gap-6 md:px-8 md:py-12 animate-pulse">
      {/* Header */}
      <header className="space-y-4 md:space-y-6">
        <div className="h-10 md:h-14 bg-gray-200 rounded-lg mx-auto max-w-md"></div>

        {/* Mode Toggle Skeleton */}
        <div className="flex gap-2">
          <div className="h-10 bg-gray-200 rounded-full w-32"></div>
          <div className="h-10 bg-gray-200 rounded-full w-32"></div>
        </div>
      </header>

      <div className="grid items-start gap-5 md:gap-6 lg:grid-cols-[1.8fr_1fr]">
        {/* Main Content Skeleton */}
        <div className="space-y-5 md:space-y-8">
          {/* Model Section */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg md:rounded-3xl">
            <div className="flex gap-2 border-b border-gray-200 p-4 md:gap-4 md:p-6">
              <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="bg-gradient-to-b from-gray-50 to-white p-5 md:p-12">
              <div className="h-[200px] md:h-[480px] bg-gray-200 rounded-lg"></div>
              <div className="h-8 bg-gray-200 rounded-lg mt-6 mx-auto max-w-xs"></div>
              <div className="grid grid-cols-3 gap-4 mt-6 max-w-3xl mx-auto">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
                <div className="h-16 bg-gray-200 rounded-lg"></div>
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Trim Section */}
          <div className="overflow-hidden rounded-2xl bg-white p-5 shadow-lg md:rounded-3xl md:p-6">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              <div className="h-16 bg-gray-200 rounded-xl"></div>
              <div className="h-16 bg-gray-200 rounded-xl"></div>
              <div className="h-16 bg-gray-200 rounded-xl"></div>
            </div>
          </div>

          {/* Region Section */}
          <div className="overflow-hidden rounded-2xl bg-white p-5 shadow-lg md:rounded-3xl md:p-6">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <aside className="sticky top-4 self-start overflow-hidden rounded-2xl bg-gray-900 shadow-2xl md:rounded-3xl">
          <div className="p-5 md:p-6 space-y-4">
            <div className="h-8 bg-gray-700 rounded w-32"></div>
            <div className="space-y-3">
              <div className="h-12 bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-700 rounded"></div>
              <div className="h-16 bg-gray-700 rounded-xl"></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
