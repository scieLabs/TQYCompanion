const LeaveSessionModal = ({ actionType, onConfirm, onCancel }) => {
    return (
      <div className="popup-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg text-center">
          <p className="mb-4">
            {actionType === 'home'
              ? 'Are you sure you want to leave your ongoing game without saving?'
              : 'Are you sure you want to log out without saving?'}
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onConfirm}
              className="btn btn-primary"
            >
              {actionType === 'home' ? 'Leave without saving' : 'Log out without saving'}
            </button>
            <button
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default LeaveSessionModal;