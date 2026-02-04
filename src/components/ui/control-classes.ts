export const controlRadiusClass = "rounded-md"
export const controlSurfaceClass =
  `${controlRadiusClass} border border-gray-200 bg-transparent shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]`
export const controlInputClass =
  `${controlSurfaceClass} h-auto px-4 py-4 text-sm font-medium text-gray-600 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-gray-200`
export const controlInputButtonClass =
  `${controlSurfaceClass} w-full px-4 py-4 text-sm font-medium text-gray-600 flex items-center justify-center gap-3 transition-colors hover:bg-gray-50 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed`
export const controlDisabledSurfaceClass =
  `${controlRadiusClass} border border-gray-200 bg-gray-100 text-gray-300 shadow-none`
