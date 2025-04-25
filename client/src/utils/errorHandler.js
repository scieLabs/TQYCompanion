export const handleApiError = (error, functionName) => {
    if (error.response) {
      console.error(`Error in ${functionName}:`, error.response.data);
      alert(`Error in ${functionName}: ${error.response.data}`);
    } else if (error.request) {
      console.error(`Error in ${functionName}: No response received from server.`);
      alert(`Error in ${functionName}: No response received from server.`);
    } else {
      console.error(`Error in ${functionName}:`, error.message);
      alert(`Error in ${functionName}: ${error.message}`);
    }
  };