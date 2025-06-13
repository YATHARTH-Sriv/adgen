export function SuccessMessage() {
  return (
    <div className="p-8">
      <div className="bg-green-900/20 border border-green-800 rounded-xl p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-green-400">Success!</h3>
            <p className="text-green-300 mt-1">
              Product analyzed successfully! AI content generated and ready for video creation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}