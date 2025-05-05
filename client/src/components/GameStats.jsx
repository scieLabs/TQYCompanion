//display of resources and projects. should we have a component for the gameplay (prompt + action) as well?
import { useState, useEffect, useContext } from 'react';
import gameAPI from '../api/gameApi.js';
import { useAuthContext } from '../contexts/authContext.jsx';
import { handleApiError } from '../utils/errorHandler.js';
import { useSeason } from '../contexts/seasonContext.jsx'; 
import * as statAPI from '../api/statApi.js';
import * as projectAPI from '../api/projectApi.js'; 


export default function GameStats({ game_id, currentWeek, ongoingProjects, completedProjects }) { //FIXME: was { formData, setFormData, currentWeek, gameTitle }
  const { user } = useAuthContext(); //change if needed
  const { currentSeason, seasonThemes } = useSeason(); // Access season context
  const theme = seasonThemes[currentSeason] || {}; // Get the theme for the current season
  // const [gameData, setGameData] = useState({
  //   abundance: '',
  //   scarcity: '',
  //   contempt: 0,
  //   projects: [],  // Include a field for projects
  //   pp: []
  // });
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ abundance: '', scarcity: '', contempt: 0 });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [resolveModal, setResolveModal] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);
  // const [ongoingProjects, setOngoingProjects] = useState([]);
  // const [completedProjects, setCompletedProjects] = useState([]);

  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     try {
  //       // Fetch ongoing projects
  //       console.log(`Fetching projects for game_id: ${game_id}`);
  //       const projectsResponse = await projectAPI.getOngoingProjects(game_id);
  //       console.log('Ongoing projects:', projectsResponse.data);
  //       setProjects(projectsResponse.data);

  //       // Fetch completed projects
  //       const completedResponse = await projectAPI.getCompletedProjects(game_id);
  //       console.log('Completed projects:', completedResponse.data);
  //       setCompletedProjects(completedResponse.data);

  //     } catch (error) {
  //       if (error.response?.status === 404) {
  //         console.warn('No ongoing projects found.');
  //         setProjects([]); // Set an empty array if no ongoing projects are found
  //       } else {
  //         console.error('Error fetching projects:', error);
  //       }
  //     }
  //   };

  //   if (game_id) {
  //     fetchProjects();
  //   }
  // }, [game_id]);

  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     try {
  //       console.log(`Fetching all projects for game_id: ${game_id}`);
  //       const response = await projectAPI.getProjectsByGame(game_id);
  //       console.log('Response from backend:', response);
  //       const allProjects = response.data;

  //       console.log('All projects:', allProjects);

  //       // Sort projects into ongoing and completed
  //       const ongoing = allProjects.filter(
  //         (proj) => (proj.project_weeks > 0 || proj.pp_weeks > 0)
  //       );
  //       const completed = allProjects.filter(
  //         (proj) => (proj.project_weeks === 0 || proj.pp_weeks === 0)
  //       );

  //       setProjects(allProjects);
  //       setOngoingProjects(ongoing);
  //       setCompletedProjects(completed);
  //     } catch (error) {
  //       console.error('Error fetching projects:', error);
  //       if (error.response?.status === 404) {
  //         console.warn('No projects found for this game.');
  //         setProjects([]);
  //         setOngoingProjects([]);
  //         setCompletedProjects([]);
  //     } else {
  //       console.error('Error fetching projects:', error);
  //     }
  //   }
  // };

  //   if (game_id) {
  //     console.log('Game ID:', game_id);
  //     fetchProjects();
  //   }
  // }, [game_id]);

  const [tempStats, setTempStats] = useState(stats);
  useEffect(() => {
    setTempStats(stats); // Sync tempStats with stats when stats change
  }, [stats]);



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

  //   const updateProjectWeeks = async (projectId, weeks) => {
  //     try {
  //       await projectAPI.updateProjectWeeks(projectId, weeks);
  //       setProjects((prev) =>
  //         prev.map((proj) => (proj._id === projectId ? { ...proj, weeks } : proj))
  //       );
  //     } catch (error) {
  //       console.error('Error updating project weeks:', error);
  //       handleApiError(error, 'updateProjectWeeks');
  //     }
  //   };


  // const handleResolve = async (projectId, resolution) => {
  //   try {
  //     await projectAPI.resolveProject(projectId, resolution);
  //     setProjects((prev) => prev.filter((proj) => proj._id !== projectId));
  //     const completedResponse = await projectAPI.getCompletedProjects(game_id);
  //     setCompletedProjects(completedResponse.data);
  //   } catch (error) {
  //     console.error('Error resolving project:', error);
  //     handleApiError(error, 'handleResolve');
  //   }
  // };

  const updateProjectWeeks = async (project_id, weeks) => {
    try {
      console.log(`Updating project weeks for project_id: ${project_id}, weeks: ${weeks}`);
      // Call API to update project weeks (not implemented here)
      setOngoingProjects((prev) =>
        prev.map((proj) =>
          proj._id === project_id ? { ...proj, project_weeks: weeks } : proj
        )
      );
    } catch (error) {
      console.error('Error updating project weeks:', error);
    }
  };

  // const handleResolve = (title, type, resolution) => {
  //   console.log(`Resolving project: ${title}, type: ${type}, resolution: ${resolution}`);
  //   setResolveModal(null);
  // };

  const handleResolve = async () => {
    try {
      const updatedProject = {
        ...resolveModal,
        project_resolve: resolveModal.project_weeks === 0 ? resolveModal.project_resolve : undefined,
        pp_resolve: resolveModal.pp_weeks === 0 ? resolveModal.pp_resolve : undefined,
      };
  
      // Save the resolution to the backend
      await projectAPI.updateProject(resolveModal._id, updatedProject);
  
      // Update the lists
      setOngoingProjects((prev) => prev.filter((proj) => proj._id !== resolveModal._id));
      setCompletedProjects((prev) => [...prev, updatedProject]);
  
      setResolveModal(null); // Close the modal
    } catch (error) {
      console.error('Error resolving project:', error);
    }
  };

  // const handleResolve = (title, type, resolution) => {
  //   console.log(`Resolving project: ${title}, type: ${type}, resolution: ${resolution}`);
  //   setResolveModal(null);
  // };


  // Combine projects and personal projects, filter for ongoing ones, and sort by weeks remaining
  // const ongoingProjects = [...gameData.projects, ...gameData.pp]
  // .filter(p => p.title && p.weeks > 0)
  // .sort((a, b) => a.weeks - b.weeks);

  // // Combine projects and personal projects, filter for completed ones
  // const completedProjects = [...gameData.projects, ...gameData.pp]
  // .filter(p => p.title && p.weeks === 0 && p.resolve);

  // const saveGameData = async (gameTitle, week, formData) => {
  //   try {
  //     await gameAPI.put(`/game/title/${gameTitle}/week/${week}`, formData);
  //     // Save the current game data for the given gameTitle and week.
  //   } catch (error) {
  //     handleApiError(error, 'saveGameData');
  //   }
  // };


  return (
    <div className={`p-4 rounded-lg ${theme.statsBg} ${theme.statsText}`}>
      {/* Display Abundance and Scarcity */}
      <div className="flex justify-between mb-4">
        <div className="flex-1 text-center">
          <p className="font-semibold text-lg">Abundances</p>
          <p>{stats.abundance || 'No data available'}</p>
        </div>
        <div className="flex-1 text-center">
          <p className="font-semibold text-lg">Scarcities</p>
          <p>{stats.scarcity || 'No data available'}</p>
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
          className={`btn btn-primary ${theme.statsBtnBg} ${theme.statsBtnText} ${theme.statsBtnBgHover}`}>
          Edit Resources
        </button>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <dialog id="editModal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit Resources</h3>
            <div className="mb-4">
              <label className="block font-bold mb-1">Abundance</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={tempStats.abundance}
                onChange={(e) => setTempStats({ ...tempStats, abundance: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-1">Scarcity</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={tempStats.scarcity}
                onChange={(e) => setTempStats({ ...tempStats, scarcity: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-1">Contempt</label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={tempStats.contempt}
                onChange={(e) => setTempStats({ ...tempStats, contempt: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
              <button className="btn" onClick={() => setEditModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* Ongoing projects */}
        <h3 className="text-lg font-semibold mb-2">Ongoing Projects</h3>
        <div className="max-h-64 overflow-y-auto border border-gray-300 rounded p-2">
        {ongoingProjects.length > 0 ? (
          ongoingProjects.map((proj) => (
            <div key={proj._id} className="mb-4">
              <p className="font-bold">{proj.project_title || proj.pp_title}</p>
              <p className="text-sm italic mb-1">{proj.project_desc || proj.pp_desc}</p>
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-xs"
                  onClick={() => updateProjectWeeks(proj._id, Math.max((proj.project_weeks || proj.pp_weeks) - 1, 0))}
                >
                  -
                </button>
                <span>{proj.project_weeks || proj.pp_weeks}</span>
                <button
                  className="btn btn-xs"
                  onClick={() => updateProjectWeeks(proj._id, (proj.project_weeks || proj.pp_weeks) + 1)}
                >
                  +
                </button>
                {proj.project_weeks === 0 && (
                  <button
                    className="btn btn-xs btn-secondary"
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
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Resolve Project</h3>
            <p className="font-bold">{resolveModal.project_title || resolveModal.pp_title}</p>
            <p className="italic mb-4">{resolveModal.project_desc || resolveModal.pp_desc}</p>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Enter resolution"
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
                className="btn btn-primary"
                onClick={handleResolve}
              >
                Save
              </button>
              <button className="btn" onClick={() => setResolveModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}


      <button className="btn btn-sm mt-2" onClick={() => setShowCompleted(true)}>Completed Projects</button>

      {showCompleted && (
        <dialog id="completedProjectsModal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Completed Projects</h3>
            {completedProjects.length > 0 ? (
              completedProjects.map((proj) => (
                <div key={proj._id} className="mb-4">
                  <p className="font-bold">{proj.project_title || proj.pp_title}</p>
                  <p className="italic">{proj.project_desc || proj.pp_desc}</p>
                  <p className="text-sm">{proj.project_resolve || proj.pp_resolve}</p>
                </div>
              ))
            ) : (
              <p>No completed projects.</p>
            )}
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setShowCompleted(false)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
