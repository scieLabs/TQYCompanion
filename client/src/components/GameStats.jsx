//display of resources and projects. should we have a component for the gameplay (prompt + action) as well?
import { useState, useEffect, useContext } from 'react';
import gameAPI from '../api/gameApi.js';
import { authContext } from '../contexts/authContext.jsx'; //edit later
import { handleApiError } from '../utils/errorHandler.js';

export default function GameStats({ formData, setFormData, currentWeek, currentSeason, gameTitle }) {
  const { user } = useContext(authContext); //change if needed
  const [resolveModal, setResolveModal] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [gameData, setGameData] = useState({
    abundance: '',
    scarcity: '',
    contempt: 0,
    projects: [],  // Include a field for projects
    pp: []
  });
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Groups the three under tempData to store any edits to them before saving
  const [tempData, setTempData] = useState({
    abundance: '',
    scarcity: '',
    contempt: 0,
  });

  // Fetch the game data including abundance, scarcity, contempt, projects, and pp
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await gameAPI.get(`/game/title/${gameTitle}/week/${currentWeek}`); // Adjust the endpoint - should there be /stats at the end?
         // Fetch for the given week

        const { abundance, scarcity, contempt, prompts } = response.data;
        
        // Separate the projects and pp data from the prompts
        const projects = prompts.filter(prompt => prompt.project_title && prompt.project_weeks > 0).map(prompt => ({
          type: 'project',
          title: prompt.project_title,
          desc: prompt.project_desc,
          weeks: prompt.project_weeks,
          resolve: prompt.project_resolve,
        }));

        const pp = prompts.filter(prompt => prompt.pp_title && prompt.pp_weeks > 0).map(prompt => ({
          type: 'pp',
          title: prompt.pp_title,
          desc: prompt.pp_desc,
          weeks: prompt.pp_weeks,
          resolve: prompt.pp_resolve,
        }));



        setGameData({ abundance, scarcity, contempt, projects, pp });

        // update form data with latest abundance, scarcitry, contempt, fill in required fields
        setFormData(prev => ({
          ...prev,
          // user_id: user._id,
          // title: prev.title || title || 'Untitled Game',
          // description: prev.description || description || 'No description provided.',
            abundance: abundance || '',
            scarcity: scarcity || '',
            contempt: contempt || 0,
        }));
        
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };

    if (gameTitle && currentWeek) {
      fetchGameData();
    }
  }, [gameTitle, user, currentWeek, setFormData]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleEdit = () => {
    setTempData({
      abundance: formData.abundance,
      scarcity: formData.scarcity,
      contempt: formData.contempt,
    });
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    try {
      await saveGameData(gameTitle, currentWeek, {
        abundance: tempData.abundance,
        scarcity: tempData.scarcity,
        contempt: tempData.contempt,
      });
      setFormData(prev => ({
        ...prev,
        abundance: tempData.abundance,
        scarcity: tempData.scarcity,
        contempt: tempData.contempt,
      }));
      setEditModalOpen(false);
    } catch (error) {
      handleApiError(error, 'handleSave');
    }
  };


  // const handleSave = async () => {
  //   try {
  //     await saveGameData(gameTitle, currentWeek, formData);
  //   } catch (error) {
  //     handleApiError(error, 'handleSave');
  //   }
  // };

  const handleResolve = (type) => {
    const resolveKey = `${type}_resolve`;
    setFormData(prev => ({
      ...prev,
      [resolveKey]: prev[resolveKey] || '',
    }));
  };

  // Combine projects and personal projects, filter for ongoing ones, and sort by weeks remaining
  const ongoingProjects = [...gameData.projects, ...gameData.pp]
  .filter(p => p.title && p.weeks > 0)
  .sort((a, b) => a.weeks - b.weeks);

  // Combine projects and personal projects, filter for completed ones
  const completedProjects = [...gameData.projects, ...gameData.pp]
  .filter(p => p.title && p.weeks === 0 && p.resolve);

  const saveGameData = async (gameTitle, week, formData) => {
    try {
      await gameAPI.put(`/game/title/${gameTitle}/week/${week}`, formData);
      // Save the current game data for the given gameTitle and week.
    } catch (error) {
      handleApiError(error, 'saveGameData');
    }
  };


  const getSeasonTheme = (season) => {
    switch (season) {
      case 'spring':
        return 'bg-green-100';
      case 'summer':
        return 'bg-yellow-100';
      case 'autumn':
        return 'bg-orange-100';
      case 'winter':
        return 'bg-blue-100';
      default:
        return '';
    }
  };

  const seasonClass = getSeasonTheme(currentSeason);

  return (
    <div className={`p-4 rounded-lg ${seasonClass}`}>
      {/* Display Abundance and Scarcity */}
      <div className="flex justify-between mb-4">
        <div className="flex-1 text-center">
          <p className="font-semibold text-lg">Abundances</p>
          <p>{gameData.abundance}</p>
        </div>
        <div className="flex-1 text-center">
          <p className="font-semibold text-lg">Scarcities</p>
          <p>{gameData.scarcity}</p>
        </div>
      </div>

      {/* Display Contempt */}
      <div className="text-center mb-4">
        <p className="font-semibold text-lg">Contempt</p>
        <p>{gameData.contempt}</p>
      </div>

            {/* Edit Button */}
      <div className="text-center">
        <button className="btn btn-primary" onClick={handleEdit}>
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
                value={tempData.abundance}
                onChange={(e) => setTempData({ ...tempData, abundance: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-1">Scarcity</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={tempData.scarcity}
                onChange={(e) => setTempData({ ...tempData, scarcity: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-1">Contempt</label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={tempData.contempt}
                onChange={(e) => setTempData({ ...tempData, contempt: parseInt(e.target.value, 10) || 0 })}
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

      {/* Display Ongoing Projects and PP - Sorted by Weeks */}

      <h3 className="text-lg font-semibold mb-2">Ongoing Projects</h3>
      {ongoingProjects.map((proj, idx) => (
        <div key={idx} className="mb-4">
          <p className="font-bold">{proj.title}</p>
          <p className="text-sm italic mb-1">{proj.desc}</p>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-xs"
              onClick={() => {
                handleChange(`${proj.type}_weeks`, Math.max((proj.weeks || 0) - 1, 0));
                saveGameData(); // Save the updated data
              }}
              >
              -
            </button>
            <span>{proj.weeks}</span>
            <button
              className="btn btn-xs"
              onClick={() => {
                handleChange(`${proj.type}_weeks`, Math.min((proj.weeks || 0) + 1, 6));
                saveGameData();
                }}
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
      ))}

      <button className="btn btn-sm mt-2" onClick={() => setShowCompleted(true)}>Completed Projects</button>

      {resolveModal && (
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
      )}

      {showCompleted && (
        <dialog id="completedModal" className="modal modal-open">
          <div className={`modal-box ${seasonClass}`}>
            <h3 className="font-bold text-lg mb-2">Completed Projects</h3>
            {completedProjects.map((proj, idx) => (
              <div key={idx} className="mb-4">
                <p className="font-bold">{proj.title}</p>
                <p className="italic text-sm">{proj.desc}</p>
                <p className="text-sm mt-1">Resolved: {proj.resolve}</p>
              </div>
            ))}
            <div className="modal-action">
              <button className="btn" onClick={() => setShowCompleted(false)}>Close</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}


        // // Combine projects and pp into one array
        // const combined = [...projects, ...pp];


          // const ongoingProjects = [
  //   {
  //     type: 'project',
  //     title: formData.project_title,
  //     desc: formData.project_desc,
  //     weeks: formData.project_weeks,
  //     resolve: formData.project_resolve
  //   },
  //   {
  //     type: 'pp',
  //     title: formData.pp_title,
  //     desc: formData.pp_desc,
  //     weeks: formData.pp_weeks,
  //     resolve: formData.pp_resolve
  //   },
  // ].filter(p => p.title && p.weeks > 0);

  // const completedProjects = [
  //   {
  //     type: 'project',
  //     title: formData.project_title,
  //     desc: formData.project_desc,
  //     resolve: formData.project_resolve,
  //     weeks: formData.project_weeks
  //   },
  //   {
  //     type: 'pp',
  //     title: formData.pp_title,
  //     desc: formData.pp_desc,
  //     resolve: formData.pp_resolve,
  //     weeks: formData.pp_weeks
  //   }
  // ].filter(p => p.title && p.weeks === 0 && p.resolve);

  // const ongoingProjects = gameData.projects.filter(p => p.title && p.weeks > 0);
  // const completedProjects = gameData.projects.filter(p => p.title && p.weeks === 0);

  // const ongoingPPs = gameData.pp.filter(p => p.title && p.weeks > 0);
  // const completedPPs = gameData.pp.filter(p => p.title && p.weeks === 0);

        // // Sort by the number of weeks remaining
        // const sortedCombined = combined.sort((a, b) => a.weeks - b.weeks);
//       {/* <h3 className="text-lg font-semibold mb-2">Ongoing Projects</h3>
//       {gameData.projects.map((item, idx) => (
//         <div key={idx} className="mb-4">
//           <p className="font-bold">{item.title}</p>
//           <p className="text-sm italic mb-1">{item.desc}</p>
//           <div className="flex items-center gap-2">
//             <button
//               className="btn btn-xs"
//               onClick={() => handleChange(`${item.type}_weeks`, Math.max((item.weeks || 0) - 1, 0))}>
//               -
//             </button>
//             <span>{item.weeks}</span>
//             <button
//               className="btn btn-xs"
//               onClick={() => handleChange(`${item.type}_weeks`, Math.min((item.weeks || 0) + 1, 6))}>
//               +
//             </button>
//           </div>
//           {item.weeks === 0 && (
//             <button
//               className="btn btn-outline btn-sm mt-1"
//               onClick={() => {
//                 handleResolve(item.type);
//                 setResolveModal(item);
//               }}>
//               Resolve
//             </button>
//           )}
//         </div>
//       ))}

//       <button className="btn btn-sm mt-2" onClick={() => setShowCompleted(true)}>Completed Projects</button>

//       {showCompleted && (
//         <dialog id="completedModal" className="modal modal-open">
//           <div className={`modal-box ${seasonClass}`}>
//             <h3 className="font-bold text-lg mb-2">Completed Projects</h3>
//             {gameData.projects.filter(item => item.weeks === 0).map((item, idx) => (
//               <div key={idx} className="mb-4">
//                 <p className="font-bold">{item.title}</p>
//                 <p className="italic text-sm">{item.desc}</p>
//                 <p className="text-sm mt-1">Resolved: {item.resolve}</p>
//               </div>
//             ))}
//             <div className="modal-action">
//               <button className="btn" onClick={() => setShowCompleted(false)}>Close</button>
//             </div>
//           </div>
//         </dialog>
//       )}
//     </div>
//   );
// } */}

//   return (
//     <div className={`p-4 rounded-lg ${seasonClass}`}>
//       {/* Display Abundance and Scarcity */}
//       <div className="flex justify-between mb-4">
//         <div className="flex-1 text-center">
//           <p className="font-semibold text-lg">Abundance</p>
//           <p>{gameData.abundance}</p>
//         </div>
//         <div className="flex-1 text-center">
//           <p className="font-semibold text-lg">Scarcity</p>
//           <p>{gameData.scarcity}</p>
//         </div>
//       </div>

//       {/* Display Contempt */}
//       <div className="text-center mb-4">
//         <p className="font-semibold text-lg">Contempt</p>
//         <p>{gameData.contempt}</p>
//       </div>

//       {/* Display Ongoing Projects */}
//       <h3 className="text-lg font-semibold mb-2">Ongoing Projects</h3>
//       {ongoingProjects.map((proj, idx) => (
//         <div key={idx} className="mb-4">
//           <p className="font-bold">{proj.title}</p>
//           <p className="text-sm italic mb-1">{proj.desc}</p>
//           <div className="flex items-center gap-2">
//             <button
//               className="btn btn-xs"
//               onClick={() => handleChange(`project_weeks`, Math.max((proj.weeks || 0) - 1, 0))}>
//               -
//             </button>
//             <span>{proj.weeks}</span>
//             <button
//               className="btn btn-xs"
//               onClick={() => handleChange(`project_weeks`, Math.min((proj.weeks || 0) + 1, 6))}>
//               +
//             </button>
//           </div>
//         </div>
//       ))}

//       {/* Display Ongoing PP */}
//       <h3 className="text-lg font-semibold mb-2">Ongoing PP</h3>
//       {ongoingPPs.map((pp, idx) => (
//         <div key={idx} className="mb-4">
//           <p className="font-bold">{pp.title}</p>
//           <p className="text-sm italic mb-1">{pp.desc}</p>
//           <div className="flex items-center gap-2">
//             <button
//               className="btn btn-xs"
//               onClick={() => handleChange(`pp_weeks`, Math.max((pp.weeks || 0) - 1, 0))}>
//               -
//             </button>
//             <span>{pp.weeks}</span>
//             <button
//               className="btn btn-xs"
//               onClick={() => handleChange(`pp_weeks`, Math.min((pp.weeks || 0) + 1, 6))}>
//               +
//             </button>
//           </div>
//         </div>
//       ))}

//       <button className="btn btn-sm mt-2" onClick={() => setShowCompleted(true)}>Completed Projects</button>

//       {showCompleted && (
//         <dialog id="completedModal" className="modal modal-open">
//           <div className={`modal-box ${seasonClass}`}>
//             <h3 className="font-bold text-lg mb-2">Completed Projects</h3>
//             {completedProjects.map((proj, idx) => (
//               <div key={idx} className="mb-4">
//                 <p className="font-bold">{proj.title}</p>
//                 <p className="italic text-sm">{proj.desc}</p>
//               </div>
//             ))}
//             <h3 className="font-bold text-lg mb-2">Completed PP</h3>
//             {completedPPs.map((pp, idx) => (
//               <div key={idx} className="mb-4">
//                 <p className="font-bold">{pp.title}</p>
//                 <p className="italic text-sm">{pp.desc}</p>
//               </div>
//             ))}
//             <div className="modal-action">
//               <button className="btn" onClick={() => setShowCompleted(false)}>Close</button>
//             </div>
//           </div>
//         </dialog>
//       )}
//     </div>
//   );
// }

//   return (
//     <div className={`p-4 rounded-lg ${seasonClass}`}>
//      {/* Display Abundance and Scarcity */}
//      <div className="flex justify-between mb-4">
//         <div className="flex-1 text-center">
//           <p className="font-semibold text-lg">Abundances</p>
//           <p>{gameData.abundance}</p>
//         </div>
//         <div className="flex-1 text-center">
//           <p className="font-semibold text-lg">Scarcities</p>
//           <p>{gameData.scarcity}</p>
//         </div>
//       </div>

//       {/* Display Contempt */}
//       <div className="text-center mb-4">
//         <p className="font-semibold text-lg">Contempt</p>
//         <p>{gameData.contempt}</p>
//       </div>

//       <h3 className="text-lg font-semibold mb-2">Ongoing Projects</h3>
//       {ongoingProjects.map((proj, idx) => (
//         <div key={idx} className="mb-4">
//           <p className="font-bold">{proj.title}</p>
//           <p className="text-sm italic mb-1">{proj.desc}</p>
//           <div className="flex items-center gap-2">
//             <button
//               className="btn btn-xs"
//               onClick={() => handleChange(`${proj.type}_weeks`, Math.max((proj.weeks || 0) - 1, 0))}>
//               -
//             </button>
//             <span>{proj.weeks}</span>
//             <button
//               className="btn btn-xs"
//               onClick={() => handleChange(`${proj.type}_weeks`, Math.min((proj.weeks || 0) + 1, 6))}>
//               +
//             </button>
//           </div>
//           {proj.weeks === 0 && (
//             <button
//               className="btn btn-outline btn-sm mt-1"
//               onClick={() => {
//                 handleResolve(proj.type);
//                 setResolveModal(proj);
//               }}>
//               Resolve
//             </button>
//           )}
//         </div>
//       ))}

//       <button className="btn btn-sm mt-2" onClick={() => setShowCompleted(true)}>Completed Projects</button>

//       {resolveModal && (
//         <dialog id="resolveModal" className="modal modal-open">
//           <div className={`modal-box ${seasonClass}`}>
//             <h3 className="font-bold text-lg mb-2">Resolve Project</h3>
//             <p className="font-bold">{resolveModal.title}</p>
//             <p className="text-sm italic mb-2">{resolveModal.desc}</p>
//             <textarea
//               className="textarea textarea-bordered w-full mb-2"
//               placeholder="How does the project resolve?"
//               onChange={(e) => handleChange(`${resolveModal.type}_resolve`, e.target.value)}
//               value={formData[`${resolveModal.type}_resolve`] || ''}
//             ></textarea>
//             <div className="modal-action">
//               <button
//                 className="btn btn-primary"
//                 onClick={() => {
//                   handleChange(`${resolveModal.type}_weeks`, 0);
//                   saveGameData();
//                   setResolveModal(null);
//                 }}
//               >Save</button>
//               <button className="btn" onClick={() => setResolveModal(null)}>Cancel</button>
//             </div>
//           </div>
//         </dialog>
//       )}

//       {showCompleted && (
//         <dialog id="completedModal" className="modal modal-open">
//           <div className={`modal-box ${seasonClass}`}>
//             <h3 className="font-bold text-lg mb-2">Completed Projects</h3>
//             {completedProjects.map((proj, idx) => (
//               <div key={idx} className="mb-4">
//                 <p className="font-bold">{proj.title}</p>
//                 <p className="italic text-sm">{proj.desc}</p>
//                 <p className="text-sm mt-1">Resolved: {proj.resolve}</p>
//               </div>
//             ))}
//             <div className="modal-action">
//               <button className="btn" onClick={() => setShowCompleted(false)}>Close</button>
//             </div>
//           </div>
//         </dialog>
//       )}
//     </div>
//   );
// }



// import { useState } from 'react';
// import { Dialog } from '@headlessui/react';

// export default function GameStats({ formData, setFormData }) {
//   const [completedProjectsOpen, setCompletedProjectsOpen] = useState(false);
//   const [resolveModal, setResolveModal] = useState(null);

//   const projects = [
//     { key: 'project', title: formData.project_title, desc: formData.project_desc, weeks: formData.project_weeks, resolve: formData.project_resolve },
//     { key: 'pp', title: formData.pp_title, desc: formData.pp_desc, weeks: formData.pp_weeks, resolve: formData.pp_resolve }
//   ];

//   const updateWeeks = (key, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [`${key}_weeks`]: Math.max(0, Math.min(6, prev[`${key}_weeks`] + value))
//     }));
//   };

//   const handleResolveSave = (key, text) => {
//     setFormData(prev => ({
//       ...prev,
//       [`${key}_resolve`]: text,
//       [`${key}_weeks`]: 0
//     }));
//     setResolveModal(null);
//   };

//   return (
//     <div className="w-64 bg-white p-4 rounded shadow">
//       <h3 className="text-lg font-semibold mb-4">Ongoing Projects</h3>
//       {projects.filter(p => p.title && p.weeks > 0).map(p => (
//         <div key={p.key} className="mb-4">
//           <p className="font-bold">{p.title}</p>
//           <p>Weeks remaining: {p.weeks}</p>
//           <div className="flex space-x-2 mt-2">
//             <button className="btn btn-sm" onClick={() => updateWeeks(p.key, -1)}>-</button>
//             <button className="btn btn-sm" onClick={() => updateWeeks(p.key, 1)}>+</button>
//           </div>
//           {p.weeks === 0 && (
//             <button className="btn btn-success mt-2" onClick={() => setResolveModal(p)}>
//               Resolve
//             </button>
//           )}
//         </div>
//       ))}
//       <button className="btn btn-outline w-full mt-4" onClick={() => setCompletedProjectsOpen(true)}>Completed Projects</button>

//       <Dialog open={!!resolveModal} onClose={() => setResolveModal(null)} className="fixed inset-0 z-50 flex items-center justify-center p-4">
//         <Dialog.Panel className="bg-white p-6 rounded shadow-xl w-full max-w-lg">
//           <Dialog.Title className="font-bold text-lg mb-2">Resolve {resolveModal?.title}</Dialog.Title>
//           <textarea
//             className="textarea textarea-bordered w-full mb-4"
//             placeholder="How does the project resolve?"
//             onChange={(e) => handleResolveSave(resolveModal.key, e.target.value)}
//           />
//           <button className="btn btn-primary w-full" onClick={() => handleResolveSave(resolveModal.key, resolveModal.resolve)}>
//             Save
//           </button>
//         </Dialog.Panel>
//       </Dialog>
//     </div>
//   );
// }


// import { useState } from 'react';

// export default function GameStats({ formData, setFormData }) {
//   const [showCompleted, setShowCompleted] = useState(false);
//   const [resolveModal, setResolveModal] = useState(null); // holds project data to resolve

//   const handleChange = (key, value) => {
//     setFormData({ ...formData, [key]: value });
//   };

//   return (
//     <div>
//       <h3 className="text-lg font-semibold mb-2">Ongoing Projects</h3>

//       {/* Example Project Entry */}
//       {formData.project_title && formData.project_weeks > 0 && (
//         <div className="mb-4">
//           <p><strong>{formData.project_title}</strong></p>
//           <div className="flex items-center gap-2">
//             <button className="btn btn-xs" onClick={() => handleChange('project_weeks', Math.max(formData.project_weeks - 1, 0))}>-</button>
//             <span>{formData.project_weeks}</span>
//             <button className="btn btn-xs" onClick={() => handleChange('project_weeks', Math.min(formData.project_weeks + 1, 6))}>+</button>
//           </div>
//           {formData.project_weeks === 0 && (
//             <button className="btn btn-outline btn-sm mt-1" onClick={() => setResolveModal('project')}>Resolve</button>
//           )}
//         </div>
//       )}

//       <button className="btn btn-sm mt-2" onClick={() => setShowCompleted(true)}>Completed Projects</button>

//       {/* DaisyUI Modal for Completed Projects */}
//       {showCompleted && (
//         <dialog id="completedModal" className="modal modal-open">
//           <div className="modal-box">
//             <h3 className="font-bold text-lg mb-2">Completed Projects</h3>
//             <p className="text-sm mb-4">(Display your completed projects here...)</p>
//             <div className="modal-action">
//               <button className="btn" onClick={() => setShowCompleted(false)}>Close</button>
//             </div>
//           </div>
//         </dialog>
//       )}

//       {/* DaisyUI Modal for Resolving a Project */}
//       {resolveModal && (
//         <dialog id="resolveModal" className="modal modal-open">
//           <div className="modal-box">
//             <h3 className="font-bold text-lg mb-2">Resolve Project</h3>
//             <p className="mb-2">{formData.project_title}</p>
//             <p className="mb-2">{formData.project_desc}</p>
//             <textarea
//               className="textarea textarea-bordered w-full mb-2"
//               placeholder="How does the project resolve?"
//               onChange={(e) => handleChange('project_resolve', e.target.value)}
//               value={formData.project_resolve || ''}
//             ></textarea>
//             <div className="modal-action">
//               <button
//                 className="btn btn-primary"
//                 onClick={() => {
//                   handleChange('project_weeks', 0);
//                   setResolveModal(null);
//                 }}
//               >Save</button>
//               <button className="btn" onClick={() => setResolveModal(null)}>Cancel</button>
//             </div>
//           </div>
//         </dialog>
//       )}
//     </div>
//   );
// }


// import { useState } from 'react';

// export default function GameStats({ formData, setFormData, currentWeek }) {
//   const [resolveModal, setResolveModal] = useState(null);
//   const [showCompleted, setShowCompleted] = useState(false);

//   const handleChange = (key, value) => {
//     setFormData(prev => ({ ...prev, [key]: value }));
//   };

//   const handleResolve = (type) => {
//     const resolveKey = `${type}_resolve`;
//     setFormData(prev => ({
//       ...prev,
//       [resolveKey]: prev[resolveKey] || '',
//     }));
//   };

//   const ongoingProjects = [
//     {
//       type: 'project',
//       title: formData.project_title,
//       desc: formData.project_desc,
//       weeks: formData.project_weeks,
//       resolve: formData.project_resolve
//     },
//     {
//       type: 'pp',
//       title: formData.pp_title,
//       desc: formData.pp_desc,
//       weeks: formData.pp_weeks,
//       resolve: formData.pp_resolve
//     },
//   ].filter(p => p.title && p.weeks > 0);

//   const completedProjects = [
//     {
//       type: 'project',
//       title: formData.project_title,
//       desc: formData.project_desc,
//       resolve: formData.project_resolve,
//       weeks: formData.project_weeks
//     },
//     {
//       type: 'pp',
//       title: formData.pp_title,
//       desc: formData.pp_desc,
//       resolve: formData.pp_resolve,
//       weeks: formData.pp_weeks
//     }
//   ].filter(p => p.title && p.weeks === 0 && p.resolve);

//   return (
//     <div>
//       <h3 className="text-lg font-semibold mb-2">Ongoing Projects</h3>
//       {ongoingProjects.map((proj, idx) => (
//         <div key={idx} className="mb-4">
//           <p className="font-bold">{proj.title}</p>
//           <p className="text-sm italic mb-1">{proj.desc}</p>
//           <div className="flex items-center gap-2">
//             <button
//               className="btn btn-xs"
//               onClick={() => handleChange(`${proj.type}_weeks`, Math.max((proj.weeks || 0) - 1, 0))}>
//               -
//             </button>
//             <span>{proj.weeks}</span>
//             <button
//               className="btn btn-xs"
//               onClick={() => handleChange(`${proj.type}_weeks`, Math.min((proj.weeks || 0) + 1, 6))}>
//               +
//             </button>
//           </div>
//           {proj.weeks === 0 && (
//             <button
//               className="btn btn-outline btn-sm mt-1"
//               onClick={() => {
//                 handleResolve(proj.type);
//                 setResolveModal(proj);
//               }}>
//               Resolve
//             </button>
//           )}
//         </div>
//       ))}

//       <button className="btn btn-sm mt-2" onClick={() => setShowCompleted(true)}>Completed Projects</button>

//       {resolveModal && (
//         <dialog id="resolveModal" className="modal modal-open">
//           <div className="modal-box">
//             <h3 className="font-bold text-lg mb-2">Resolve Project</h3>
//             <p className="font-bold">{resolveModal.title}</p>
//             <p className="text-sm italic mb-2">{resolveModal.desc}</p>
//             <textarea
//               className="textarea textarea-bordered w-full mb-2"
//               placeholder="How does the project resolve?"
//               onChange={(e) => handleChange(`${resolveModal.type}_resolve`, e.target.value)}
//               value={formData[`${resolveModal.type}_resolve`] || ''}
//             ></textarea>
//             <div className="modal-action">
//               <button
//                 className="btn btn-primary"
//                 onClick={() => {
//                   handleChange(`${resolveModal.type}_weeks`, 0);
//                   setResolveModal(null);
//                 }}
//               >Save</button>
//               <button className="btn" onClick={() => setResolveModal(null)}>Cancel</button>
//             </div>
//           </div>
//         </dialog>
//       )}

//       {showCompleted && (
//         <dialog id="completedModal" className="modal modal-open">
//           <div className="modal-box">
//             <h3 className="font-bold text-lg mb-2">Completed Projects</h3>
//             {completedProjects.map((proj, idx) => (
//               <div key={idx} className="mb-4">
//                 <p className="font-bold">{proj.title}</p>
//                 <p className="italic text-sm">{proj.desc}</p>
//                 <p className="text-sm mt-1">Resolved: {proj.resolve}</p>
//               </div>
//             ))}
//             <div className="modal-action">
//               <button className="btn" onClick={() => setShowCompleted(false)}>Close</button>
//             </div>
//           </div>
//         </dialog>
//       )}
//     </div>
//   );
// }