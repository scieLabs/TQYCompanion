//display of resources and projects. should we have a component for the gameplay (prompt + action) as well?
import { useState, useEffect, useContext } from 'react';
import gameAPI from '../api/gameApi.js';
import { useAuthContext } from '../contexts/authContext.jsx';
import { handleApiError } from '../utils/errorHandler.js';
import { useSeason } from '../contexts/seasonContext.jsx'; 
import * as statAPI from '../api/statApi.js';
import * as projectAPI from '../api/projectApi.js'; 


export default function GameStats({ game_id, currentWeek, ongoingProjects, completedProjects, setOngoingProjects, setCompletedProjects }) { //FIXME: was { formData, setFormData, currentWeek, gameTitle }
  const { user } = useAuthContext(); //change if needed
  const { currentSeason, seasonThemes } = useSeason(); // Access season context
  const theme = seasonThemes[currentSeason] || {}; // Get the theme for the current season

  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ abundance: '', scarcity: '', contempt: 0 });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [resolveModal, setResolveModal] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const [tempStats, setTempStats] = useState(stats);
  useEffect(() => {
    setTempStats(stats); // Sync tempStats with stats when stats change
  }, [stats]);

  useEffect(() => {
    console.log('Updated ongoingProjects:', ongoingProjects);
  }, [ongoingProjects]);

  // Fetch the game data including abundance, scarcity, contempt, projects, and pp
  useEffect(() => {
    const fetchStats = async () => {
      try {
        
        // Fetch stats for the current game and week
        const statsResponse = await statAPI.getStatsByGameAndWeek(game_id, currentWeek);
        setStats(statsResponse.data);
        
      } catch (error) {
        console.error('Error fetching game data:', error);
        handleApiError(error, 'fetchGameData');
      }
    };
    console.log('GameStats Props:', { game_id, currentWeek });
    if (game_id && currentWeek) { //FIXME: changed gameTitle to game here and below
      fetchStats();
    }
  }, [game_id, currentWeek]); //FIXME: took out "user" and "setFormData" with the formData commented out above

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleEdit = () => {
    setTempStats(stats);
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    try {
      await statAPI.updateStatsByGameAndWeek(game_id, currentWeek, tempStats);
      setStats(tempStats);
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error saving stats:', error);
      handleApiError(error, 'handleSave');
    }
  };


  const updateProjectWeeks = async (project_id, weeks) => {
    try {
      console.log(`Updating project weeks for project_id: ${project_id}, weeks: ${weeks}`);

      // Call the API to update the project weeks
      await projectAPI.updateProjectWeeks(project_id, weeks);

      // Update the ongoing projects list
      setOngoingProjects((prev) =>
        prev.map((proj) =>
          proj._id === project_id ? { ...proj, project_weeks: weeks } : proj
        )
      );

    } catch (error) {
      console.error('Error updating project weeks:', error);
    }
  };


  const handleResolve = async () => {
    try {
      const resolution = {
        ...resolveModal,
        project_resolve: resolveModal.project_weeks === 0 ? resolveModal.project_resolve : undefined,
        pp_resolve: resolveModal.pp_weeks === 0 ? resolveModal.pp_resolve : undefined,
      };
  
      // Save the resolution to the backend
      await projectAPI.resolveProject(resolveModal._id, resolution);

      //     // Calculate the week the project finished and how many weeks it took
      // const finishedWeek = currentWeek;
      // const startedWeek = resolveModal.stats_week || 0; // Default to 0 if stats_week is not available
      // const weeksTaken = finishedWeek - startedWeek;
  
      // Update the lists
      setOngoingProjects((prev) => prev.filter((proj) => proj._id !== resolveModal._id));
      setCompletedProjects((prev) => [
        ...prev,
        { ...resolveModal,
          project_resolve: resolveModal.project_resolve,
          pp_resolve: resolveModal.pp_resolve,
          // finished_week: finishedWeek, // Add finished week
          // weeks_taken: weeksTaken, // Add weeks taken
         },
      ]);
  
      setResolveModal(null); // Close the modal
    } catch (error) {
      console.error('Error resolving project:', error);
    }
  };

  return (
    <div className={`p-4 rounded-lg min-h-screen flex flex-col justify-between ${theme.statsBg} ${theme.statsText}`}>

      <div>
        {/* Display Abundance and Scarcity */}
        <div className="flex justify-between mb-4">
          <div className="flex-1 text-center p-2 max-h-32 overflow-y-auto">
            <p className="font-semibold text-lg">Abundances</p>
            <p className='text-sm'>{stats.abundance || 'No data available'}</p>

          </div>
          <div className="flex-1 text-center">
            <div className="flex-1 text-center p-2 max-h-32 overflow-y-auto">
              <p className="font-semibold text-lg">Scarcities</p>
              <p className='text-sm'>{stats.scarcity || 'No data available'}</p>
            </div>
          </div>
        </div>

        {/* Display Contempt */}
        <div className="text-center mb-4">
          <p className="font-semibold text-lg">Contempt</p>
          <p>{stats.contempt}</p>
        </div>

              {/* Edit Button */}
        <div className="text-center">
          <button
            onClick={handleEdit}
            className={`btn border-hidden shadow-sm ${theme.statsBtnBg} ${theme.statsBtnText} ${theme.statsBtnBgHover}`}>
            Edit Resources
          </button>
        </div>

      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <dialog id="editModal" className="modal modal-open">
          <div className="modal-box p-0">
            <header className={`p-4 text-center ${theme.headerBg} ${theme.headerText}`}>
              <h3 className="font-bold text-lg mb-">Edit Resources</h3>
            </header>

            <div className={`p-6 ${theme.bodyBg} ${theme.bodyText}`}>
              <div className="mb-4">
                <label className="block font-bold mb-1">Abundance</label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${theme.bodyInputBg} ${theme.bodyInputText}`}
                  value={tempStats.abundance}
                  onChange={(e) => setTempStats({ ...tempStats, abundance: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-1">Scarcity</label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${theme.bodyInputBg} ${theme.bodyInputText}`}
                  value={tempStats.scarcity}
                  onChange={(e) => setTempStats({ ...tempStats, scarcity: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-1">Contempt</label>
                <input
                  type="number"
                  className={`input input-bordered w-full ${theme.bodyInputBg} ${theme.bodyInputText}`}
                  value={tempStats.contempt}
                  onChange={(e) => setTempStats({ ...tempStats, contempt: parseInt(e.target.value, 10) || 0 })}
                />
              </div>
              <div className="modal-action">
                <button
                  className={`btn btn-primary border-none shadow-md ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
                  onClick={handleSave}>
                  Save
                </button>
                <button
                  className="btn border-none shadow-md"
                  onClick={() => setEditModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </dialog>
      )}

      <div>
      {/* Ongoing projects */}
        <h3 className="text-lg font-semibold mb-3 text-center">Ongoing Projects</h3>
        <div className="max-h-120 overflow-y-auto p-2">
        {ongoingProjects.length > 0 ? (
          ongoingProjects.map((proj) => (
            <div key={proj._id} className="flex items-center justify-between mb-4">

              <div className="w-3/4 break-words">
                <p className="font-bold">{proj.project_title || proj.pp_title}</p>
                <p className="text-sm italic mb-1">{proj.project_desc || proj.pp_desc}</p>
              </div>

              <div className="flex items-center gap-2">
                {proj.project_weeks > 0 || proj.pp_weeks > 0 ? (
                  <>
                    <button
                      className="btn btn-xs"
                      onClick={() =>
                        updateProjectWeeks(proj._id, Math.max((proj.project_weeks || proj.pp_weeks) - 1, 0))
                      }
                    >
                      -
                    </button>
                    <span>{proj.project_weeks || proj.pp_weeks}</span>
                    <button
                      className="btn btn-xs"
                      onClick={() =>
                        updateProjectWeeks(proj._id, (proj.project_weeks || proj.pp_weeks) + 1)
                      }
                    >
                      +
                    </button>
                  </>
                ) : (
                  <button
                    className={`btn btn-xs btn-secondary border-none shadow-sm ${theme.nextWeekBtnBg} ${theme.statsBtnBgHover}`}
                    onClick={() => setResolveModal(proj)}
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No ongoing projects.</p>
        )}
        </div>

            {/* Resolve Modal */}
        {resolveModal && (
        <dialog id="resolveModal" className="modal modal-open">
          <div className="modal-box p-0">

            <header className={`p-4 text-center ${theme.headerBg} ${theme.headerText}`}>
              <h3 className="font-bold text-lg mb-4">Resolve Project</h3>
            </header>

            <div className={`p-6 ${theme.bodyBg} ${theme.bodyText}`}>
              <div className="mb-4 max-h-80 break-words overflow-y-auto">
                <p className="font-bold mb-2">{resolveModal.project_title || resolveModal.pp_title}</p>
                <p className="italic mb-4">{resolveModal.project_desc || resolveModal.pp_desc}</p>
              </div>

              <textarea
                className={`textarea textarea-bordered w-full h-full ${theme.bodyInputBg} ${theme.bodyInputText}`}
                placeholder="How does the project resolve?"
                value={resolveModal.project_resolve || resolveModal.pp_resolve || ''}
                // onChange={(e) => setResolveModal({ ...resolveModal, resolution: e.target.value })}
                onChange={(e) =>
                  setResolveModal({
                    ...resolveModal,
                    project_resolve: resolveModal.project_weeks === 0 ? e.target.value : undefined,
                    pp_resolve: resolveModal.pp_weeks === 0 ? e.target.value : undefined,
                  })
                }
              />
              <div className="modal-action">
                <button
                  className={`btn btn-primary border-none shadow-md ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
                  onClick={handleResolve}
                >
                  Save
                </button>
                <button className="btn border-none shadow-md" onClick={() => setResolveModal(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </dialog>
      )}
      </div>


      <div className="flex justify-center items-center mt-4">
        <button 
          className={`btn border-hidden shadow-sm ${theme.statsBtnBg} ${theme.statsBtnText} ${theme.statsBtnBgHover}`}
          onClick={() => setShowCompleted(true)}
        >
          Completed Projects
        </button>
      </div>

      {showCompleted && (
        <dialog id="completedProjectsModal" className="modal modal-open">
          <div className="modal-box p-0">

            <header className={`p-4 text-center ${theme.headerBg} ${theme.headerText}`}>
              <h3 className="font-bold text-lg mb-4">Completed Projects</h3>  
            </header>

            <div className={`p-6 ${theme.bodyBg} ${theme.bodyText} `}>
              <div className="max-h-120 break-words overflow-y-auto pr-4">
                {completedProjects.length > 0 ? (
                  completedProjects.map((proj, index) => (
                    <div key={proj._id} className="mb-4">
                      <p className="font-bold text-sm mb-2">Project #{index + 1}</p>
                      <p className="text-sm mb-2 italic">Started in week: {proj.stats_week || 'Unknown'}</p>
                      <div className={`p-3 mb-3 rounded border textarea textarea-bordered w-full h-full ${theme.bodyInputBg} ${theme.bodyInputText}`}>
                        <p className="text-sm mb-2 font-bold">Title:</p>
                        <p className="font-bold mb-2 uppercase">{proj.project_title || proj.pp_title}</p>
                      </div>
                      <div className={`p-3 mb-3 rounded border textarea textarea-bordered w-full h-full ${theme.bodyInputBg} ${theme.bodyInputText}`}>
                        <p className="text-sm mb-2 font-bold">Description:</p>
                        <p className="italic text-sm mb-2">{proj.project_desc || proj.pp_desc}</p>
                      </div>
                      <div className={`p-3 mb-3 rounded border textarea textarea-bordered w-full h-full ${theme.bodyInputBg} ${theme.bodyInputText}`}>
                        <p className="text-sm font-bold">Resolution:</p>
                        <p className="text-sm mb-4">{proj.project_resolve || proj.pp_resolve}</p>
                      </div>

                      {index < completedProjects.length - 1 && (
                        <hr className="border-t border-gray-300 my-4" />
                      )}
                    </div>
                  ))
                ) : (
                  <p>No completed projects.</p>
                )}
                </div>
              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setShowCompleted(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
