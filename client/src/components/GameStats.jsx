//display of resources and projects. should we have a component for the gameplay (prompt + action) as well?
import { useState, useEffect, useContext } from 'react';
import gameAPI from '../api/gameApi.js';
import { useAuthContext } from '../contexts/authContext.jsx';
import { handleApiError } from '../utils/errorHandler.js';
import { useSeason } from '../contexts/seasonContext.jsx'; 
import * as projectAPI from '../api/projectApi.js';
import * as statAPI from '../api/statApi.js';


export default function GameStats({ game_id, currentWeek }) { //FIXME: was { formData, setFormData, currentWeek, gameTitle }
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
  const [completedProjects, setCompletedProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch ongoing projects
        const projectsResponse = await projectAPI.getOngoingProjects(game_id);
        setProjects(projectsResponse.data);

        // Fetch completed projects
        const completedResponse = await projectAPI.getCompletedProjects(game_id);
        setCompletedProjects(completedResponse.data);


      } catch (error) {
        console.error('Error fetching ongoing projects:', error);
      }
    };
  
    fetchProjects();
  }, [game_id]);

  // Groups the three under tempData to store any edits to them before saving
  // const [tempData, setTempData] = useState({
  //   abundance: '',
  //   scarcity: '',
  //   contempt: 0,
  // });
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

        // // Fetch ongoing projects
        // const projectsResponse = await projectAPI.getOngoingProjects(game_id);
        // setProjects(projectsResponse.data);

        // // Fetch completed projects
        // const completedResponse = await projectAPI.getCompletedProjects(game_id);
        // setCompletedProjects(completedResponse.data);
        
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
    // setTempData({
    //   abundance: gameData.abundance,
    //   scarcity: gameData.scarcity,
    //   contempt: gameData.contempt,
    // });
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

  // const handleSave = async () => {
  //   try {
  //     // await saveGameData(gameTitle, currentWeek, {
  //     console.log('Saving updated resources:', tempData);
  //     await gameAPI.updateGameByWeek(gameTitle, currentWeek, {
  //       abundance: tempData.abundance,
  //       scarcity: tempData.scarcity,
  //       contempt: tempData.contempt,
  //     });
  //     setGameData(prev => ({ //FIXME: changed from setFormData
  //       ...prev,
  //       abundance: tempData.abundance,
  //       scarcity: tempData.scarcity,
  //       contempt: tempData.contempt,
  //     }));
  //     setEditModalOpen(false);
  //   } catch (error) {
  //     console.error('Error saving updated resources:', error);
  //     handleApiError(error, 'handleSave');
  //   }
  // };

    // // Handle updating project weeks
    // const updateProjectWeeks = (projectId, weeks) => {
    //   console.log(`Updating weeks for project: ${projectId}, weeks: ${weeks}`);
    //   setGameData((prev) => ({
    //     ...prev,
    //     [type]: prev[type].map((proj) =>
    //       proj.title === projectTitle ? { ...proj, weeks } : proj
    //     ),
    //   }));
    // };

    const updateProjectWeeks = async (projectId, weeks) => {
      try {
        await projectAPI.updateProjectWeeks(projectId, weeks);
        setProjects((prev) =>
          prev.map((proj) => (proj._id === projectId ? { ...proj, weeks } : proj))
        );
      } catch (error) {
        console.error('Error updating project weeks:', error);
        handleApiError(error, 'updateProjectWeeks');
      }
    };

  // Handle resolving a project
  // const handleResolve = async (projectTitle, type, resolution) => {
  //   try {
  //     console.log(`Resolving project: ${projectTitle}, type: ${type}, resolution: ${resolution}`);
  //     await gameAPI.resolveProject(gameTitle, projectTitle, type, resolution);
  //     setResolveModal(null);
  //     // Refresh game data after resolving
  //     const projectsResponse = await gameAPI.getProjectsByTitle(gameTitle);
  //     const { projects, pp } = projectsResponse.data;
  //     console.log('Updated projects after resolving:', projectsResponse.data);

  //     setGameData((prev) => ({
  //       ...prev,
  //       projects,
  //       pp,
  //     }));
  //   } catch (error) {
  //     console.error('Error resolving project:', error);
  //     handleApiError(error, 'handleResolve');
  //   }
  // };

  const handleResolve = async (projectId, resolution) => {
    try {
      await projectAPI.resolveProject(projectId, resolution);
      setProjects((prev) => prev.filter((proj) => proj._id !== projectId));
      const completedResponse = await projectAPI.getCompletedProjects(game_id);
      setCompletedProjects(completedResponse.data);
    } catch (error) {
      console.error('Error resolving project:', error);
      handleApiError(error, 'handleResolve');
    }
  };


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
                onChange={(e) => setTempData({ ...tempStats, abundance: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-1">Scarcity</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={tempStats.scarcity}
                onChange={(e) => setTempData({ ...tempStats, scarcity: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-1">Contempt</label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={tempStats.contempt}
                onChange={(e) => setTempData({ ...tempStats, contempt: parseInt(e.target.value, 10) || 0 })}
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

      {/* Display Ongoing Projects */}
      <h3 className="text-lg font-semibold mb-2">Ongoing Projects</h3>
      {projects.map((proj) => (
          <div key={proj._id} className="mb-4">
            <p className="font-bold">{proj.title}</p>
            <p className="text-sm italic mb-1">{proj.desc}</p>
            <div className="flex items-center gap-2">
              <button
                className="btn btn-xs"
                onClick={() => updateProjectWeeks(proj._id, Math.max(proj.project_weeks - 1, 0))}
              >
                -
              </button>
              <span>{proj.weeks}</span>
              <button
                className="btn btn-xs"
                onClick={() => updateProjectWeeks(proj._id, proj.project_weeks + 1)}
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
        ))}

      {/* <h3 className="text-lg font-semibold mb-2">Ongoing Projects</h3>
      {ongoingProjects.map((proj, idx) => (
        <div key={idx} className="mb-4">
          <p className="font-bold">{proj.title}</p>
          <p className="text-sm italic mb-1">{proj.desc}</p>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-xs"
              onClick={() => updateProjectWeeks(proj._id, proj.type, Math.max(proj.weeks - 1, 0))}

              //FIXME: old
              // onClick={() => {
              //   handleChange(`${proj.type}_weeks`, Math.max((proj.weeks || 0) - 1, 0));
              //   saveGameData(); // Save the updated data
              // }}
              >
              -
            </button>
            <span>{proj.weeks}</span>
            <button
              className="btn btn-xs"
              onClick={() => updateProjectWeeks(proj._id, proj.type, proj.weeks + 1)}

              //FIXME: old
              // onClick={() => {
              //   handleChange(`${proj.type}_weeks`, Math.min((proj.weeks || 0) + 1, 6));
              //   saveGameData();
              //   }}
                >
              +
            </button>
          </div>
          {proj.weeks === 0 && (
            <button
              className="btn btn-outline btn-sm mt-1"
              onClick={() => {
                handleResolve(proj.type);
                setResolveModal(proj);
              }}>
              Resolve
            </button>
          )}
        </div>
      ))} */}

            {/* Resolve Modal */}
        {resolveModal && (
        <dialog id="resolveModal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Resolve Project</h3>
            <p className="font-bold">{resolveModal.title}</p>
            <p className="italic mb-4">{resolveModal.desc}</p>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Enter resolution"
              onChange={(e) => setResolveModal({ ...resolveModal, resolution: e.target.value })}
            />
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={() =>
                  handleResolve(resolveModal.title, resolveModal.type, resolveModal.resolution)
                }
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

      {/* <button className="btn btn-sm mt-2" onClick={() => setShowCompleted(true)}>Completed Projects</button> */}

      {/* {resolveModal && (
        <dialog id="resolveModal" className="modal modal-open">
          <div className={`modal-box ${seasonClass}`}>
            <h3 className="font-bold text-lg mb-2">Resolve Project</h3>
            <p className="font-bold">{resolveModal.title}</p>
            <p className="text-sm italic mb-2">{resolveModal.desc}</p>
            <textarea
              className="textarea textarea-bordered w-full mb-2"
              placeholder="How does the project resolve?"
              onChange={(e) => handleChange(`${resolveModal.type}_resolve`, e.target.value)}
              value={formData[`${resolveModal.type}_resolve`] || ''}
            ></textarea>
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleChange(`${resolveModal.type}_weeks`, 0);
                  saveGameData(); // Save the updated data
                  setResolveModal(null);
                }}
              >Save</button>
              <button className="btn" onClick={() => setResolveModal(null)}>Cancel</button>
            </div>
          </div>
        </dialog>
      )} */}

      <button className="btn btn-sm mt-2" onClick={() => setShowCompleted(true)}>Completed Projects</button>

      {showCompleted && (
        <dialog id="completedProjectsModal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Completed Projects</h3>
            {completedProjects.map((proj) => (
              <div key={proj._id} className="mb-4">
                <p className="font-bold">{proj.title}</p>
                <p className="italic">{proj.desc}</p>
                <p className="text-sm">{proj.resolution}</p>
              </div>
            ))}
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
