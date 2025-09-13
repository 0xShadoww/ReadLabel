const CameraPermissions = ({ onRequestPermissions, onBack, error }) => {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Camera icon */}
        <div className="text-6xl mb-6">📷</div>
        
        {/* Main heading */}
        <h2 className="text-2xl font-bold mb-4">Camera Access Needed</h2>
        
        {/* Description */}
        <p className="text-primary-300 mb-6 leading-relaxed">
          To scan ingredient labels, ReadLabel needs access to your camera. 
          Your photos are processed locally and never stored.
        </p>

        {/* Error message if permission denied */}
        {error && (
          <div className="bg-danger/10 border border-danger/20 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 text-danger">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Privacy features */}
        <div className="space-y-3 mb-8 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-primary-200 text-sm">Photos processed locally on your device</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-primary-200 text-sm">No images saved or uploaded</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-primary-200 text-sm">Camera used only for label scanning</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={onRequestPermissions}
            className="btn-primary w-full"
          >
            Allow Camera Access
          </button>
          
          <button
            onClick={onBack}
            className="btn-ghost w-full"
          >
            Go Back
          </button>
        </div>

        {/* Additional help */}
        <p className="text-xs text-primary-400 mt-6">
          If you accidentally denied permission, you can enable it in your browser settings.
        </p>
      </div>
    </div>
  )
}

export default CameraPermissions