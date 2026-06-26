export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8 space-y-8 animate-pulse pointer-events-none">
      {/* Header Info Skeleton */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="space-y-3 flex-1">
            <div className="h-10 w-1/2 bg-gray-200 rounded-2xl" />
            <div className="h-4 w-1/3 bg-gray-200 rounded-full" />
          </div>
          <div className="w-10 h-4 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Image Grid Skeleton (Airbnb Style) */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 h-[200px] sm:h-[350px] md:h-[350px] gap-1 md:gap-1.25 rounded-3xl overflow-hidden shadow-sm -mt-3">
        <div className="md:col-span-2 md:row-span-2 bg-gray-200 h-full w-full" />
        <div className="hidden md:block bg-gray-200 h-full w-full" />
        <div className="hidden md:block bg-gray-200 h-full w-full" />
        <div className="hidden md:block bg-gray-200 h-full w-full" />
        <div className="hidden md:block bg-gray-200 h-full w-full" />
      </div>

      {/* Content Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 mt-4">
        {/* Left Column: Details & Map Pulses */}
        <div className="lg:col-span-2 space-y-12">
          {/* Summary Skeleton */}
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="space-y-3 flex-1">
                <div className="h-6 w-1/4 bg-gray-200 rounded-full" />
                <div className="h-4 w-1/2 bg-gray-200 rounded-full" />
              </div>
            </div>

            {/* Description Paragraphs */}
            <div className="space-y-4 pt-4">
              <div className="h-4 w-full bg-gray-100 rounded-full" />
              <div className="h-4 w-full bg-gray-100 rounded-full" />
              <div className="h-4 w-5/6 bg-gray-100 rounded-full" />
              <div className="h-4 w-2/3 bg-gray-100 rounded-full" />
            </div>
          </div>

          {/* Map Placeholder Skeleton */}
          <div className="space-y-6">
            <div className="h-8 w-60 bg-gray-200 rounded-full" />
            <div className="h-[450px] rounded-[40px] bg-gray-50 border border-gray-100 shadow-inner flex items-center justify-center">
              <div className="text-gray-300 font-bold text-xl uppercase tracking-widest">Map Loading...</div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Card Placeholder */}
        <div className="relative">
          <div className="sticky top-24 pt-4">
            <div className="h-[320px] w-full bg-white border border-gray-100 shadow-xl shadow-gray-100/50 rounded-[40px] p-8 space-y-8 flex flex-col items-center justify-center">
              <div className="space-y-3 text-center w-full px-4">
                <div className="mx-auto h-4 w-1/3 bg-gray-100 rounded-full" />
                <div className="mx-auto h-10 w-full bg-gray-200 rounded-2xl animate-pulse" />
              </div>
              <div className="w-full bg-gray-50 rounded-3xl p-5 space-y-3 border border-gray-100/50">
                <div className="h-6 w-1/2 bg-gray-200 rounded-full" />
                <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
              </div>
              <div className="h-10 w-full bg-gray-100 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
