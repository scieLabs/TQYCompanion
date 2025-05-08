import { useState, useContext } from 'react';
import * as promptApi from '../api/promptApi.js';
import * as gameAPI from '../api/gameApi.js';
import * as statAPI from '../api/statApi.js';
import * as projectAPI from '../api/projectApi.js';
import { handleApiError } from '../utils/errorHandler.js';
import { useSeason } from '../contexts/seasonContext.jsx'; 

export default function ActionModal({ action, game_id, currentWeek, fetchProjects, setOngoingProjects, prompt, stats, setStats, formData, setFormData, isDiscussion, isDiscovery, isProject }) {
  
  const GAME_OVER_PROMPT_ID = '6809feda210f991dba3d9c70';

  const { currentSeason, seasonThemes } = useSeason(); // Access season context
  const theme = seasonThemes[currentSeason] || {};

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const saveActionData = async () => {
    try {
      const data = {
        game_id,
        stats_week: currentWeek,
        p_discussion: formData.p_discussion,
        p_discovery: formData.p_discovery,
        pp_title: formData.pp_title,
        pp_desc: formData.pp_desc,
        pp_weeks: formData.pp_weeks,
      };
  
      await statAPI.saveActionData(game_id, currentWeek, data);
      // console.log('Conditional action data saved:', data);

      // Save project to the backend if it's a "Start a Project" action
      if (formData.pp_title && formData.pp_desc && formData.pp_weeks) {
        const projectData = {
          game_id,
          stats_week: currentWeek,
          project_title: formData.pp_title,
          project_desc: formData.pp_desc,
          project_weeks: formData.pp_weeks,
        };

        console.log('Creating project with data:', projectData);
        console.log('Current week:', currentWeek);

        try {
          const projectResponse = await projectAPI.createProject(projectData);
          console.log('Project created successfully:', projectResponse.data);
  
          // Immediately add the project to ongoingProjects
          setOngoingProjects((prev) => [...prev, projectResponse.data]);
  
          // Fetch updated projects to ensure the list is refreshed
          await fetchProjects();
        } catch (projectError) {
          console.error('Error creating project:', projectError.response?.data || projectError.message);
          // Optionally, notify the user that the project was saved but encountered an issue
        }
      }

          // Close the modal
      setFormData((prev) => ({
        ...prev,
        showDiscussionModal: false,
        showDiscoveryModal: false,
        showProjectModal: false,
      }));
    } catch (err) {
      console.error('Error saving action data:', err.message);
      handleApiError(err, 'saveActionData');
    }
  };

  if (prompt && prompt._id === GAME_OVER_PROMPT_ID) {
    // Render the textarea for "fate of the community" when Game Over is triggered
    return (
      <div className="flex flex-col items-center justify-center">
        <label className={`block font-bold ${theme.bodyText} mb-2`}>
          What is the fate of the community?</label>
        <textarea
          className={`textarea textarea-bordered w-full h-64 ${theme.bodyInputBg} ${theme.bodyInputText}`}
          value={formData.end || ''}
          onChange={(e) => updateField('end', e.target.value)}
          placeholder="Describe the fate of the community..."
        />
      </div>
    );
  }

  const [isOpen, setIsOpen] = useState(true); // State to toggle the box

  const renderActionForm = () => {
    //displays individual actions
    return (
      <div>
        {/* <div className={`flex flex-col items-center justify-center text-center my-8 ${theme.bodyText} `}>
          <h2 className="uppercase font-lg font-bold">Game Order</h2>
          <div className="p-4 bg-white border border-gray-300 rounded-b-lg shadow-md">
            <ol className={`list-decimal list-inside text-sm ${theme.bodyText}`}>
              <li className={``}>Resolve the weekly prompt. Follow all bold text.</li>
              <li className={``}>Reduce project dice by one. Resolve any completed projects.</li>
              <li className={``}>Take an action. Choose one.</li>
            </ol>
          </div>
        </div> */}

        <div className={`flex flex-col items-center justify-center text-center my-8`}>
          {/* Header with toggle functionality */}
          <div
            className={`cursor-pointer p-4 uppercase font-lg font-bold ${theme.bodyText} ${theme.bodyTextHover}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            ❯❯ Game Order ❮❮
          </div>

            {/* Collapsible content */}
            {isOpen && (
              <div className={`p-4 ${theme.statsBg} border border-gray-300 rounded-b-lg shadow-md`}>
                <ol className={`list-decimal list-inside text-sm ${theme.statsText}`}>
                  <li>Resolve the weekly prompt. Follow all bold text.</li>
                  <li>Reduce project dice by one. Resolve any completed projects.</li>
                  <li>Take an action. Choose one.</li>
                </ol>
              </div>
            )}
        </div>

      <div className="flex flex-row justify-between space-x-6 mx-8">

        <div className="w-1/3 flex flex-col items-center">
          <label className={`block font-bold mb-2 text-center ${theme.bodyText}`}>Discover something new</label>
          <textarea
            className={`textarea textarea-bordered w-full h-64 ${theme.bodyInputBg} ${theme.bodyInputText}`}
            placeholder="Introduce a new situation. It might be a problem, opportunity, or a bit of both."
            value={formData.discovery || ''}
            onChange={(e) => updateField('discovery', e.target.value)}
          />
        </div>

        <div className="w-1/3 flex flex-col items-center">
          <label className={`block font-bold mb-2 text-center ${theme.bodyText}`}>Hold a discussion</label>
          <textarea
            className={`textarea textarea-bordered w-full h-64 ${theme.bodyInputBg} ${theme.bodyInputText}`}
            placeholder="A discussion never results in a decision or summation process. Everyone weighs in, and then it’s over."
            value={formData.discussion || ''}
            onChange={(e) => updateField('discussion', e.target.value)}
          />
        </div>

        <div className="w-1/3 flex flex-col items-center">
          <label className={`block font-bold mb-2 text-center ${theme.bodyText}`}>Start a project</label>
          <div className="w-full flex flex-col justify-between h-64">
            <input
              type="text"
              maxLength="30"
              className={`input input-bordered w-full mb-2 ${theme.bodyInputBg} ${theme.bodyInputText}`}
              placeholder="A catchy title."
              value={formData.project_title || ''}
              onChange={(e) => updateField('project_title', e.target.value)}
            />
            <textarea
              className={`textarea textarea-bordered w-full h-full ${theme.bodyInputBg} ${theme.bodyInputText}`}
              placeholder="Choose a situation and declare what the community will do to resolve it. Do you have the necessary tools and expertise to do this? As a group, decide how many weeks the project would reasonably take to complete (1-6)."
              value={formData.project_desc || ''}
              onChange={(e) => updateField('project_desc', e.target.value)}
            />
          </div>
          <div className="flex items-center justify-end space-x-2 mt-2 w-full">
            <span className={`font-bold ${theme.bodyText}`}>Weeks:</span>
            <button 
              className={`btn btn-sm text-lg ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
              onClick={() => updateField('project_weeks', Math.max(1, (formData.project_weeks || 1) - 1))}>-</button>
            <span
              // className={`${theme.bodyInputBg} ${theme.bodyInputText}`}
              >{formData.project_weeks || 1}</span>
            <button 
              className={`btn btn-sm text-lg ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
              onClick={() => updateField('project_weeks', Math.min(6, (formData.project_weeks || 1) + 1))}>+</button>
          </div>
        </div>
      </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col items-center">
        {/* Conditionally show the modal buttons */}
        {isDiscussion && (
          <button
            className={`btn btn-sm mt-4 shadow-sm border-none ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
            onClick={() => setFormData(prev => ({ ...prev, showDiscussionModal: true }))}
          >
            Hold a Discussion
          </button>
        )}
        {isDiscovery && (
          <button
            className={`btn btn-sm mt-4 shadow-sm border-none ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
            onClick={() => setFormData(prev => ({ ...prev, showDiscoveryModal: true }))}
          >
            Discover Something New
          </button>
        )}
        {isProject && (
          <button
            className={`btn btn-sm mt-4 shadow-sm border-none ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
            onClick={() => setFormData(prev => ({ ...prev, showProjectModal: true }))}
          >
            Start a Project
          </button>
        )}
      </div>

      {/* Render always visible action form */}
      {renderActionForm()}

      {/* Modal rendering logic will go here */}
      {formData.showDiscussionModal && isDiscussion && (
      <div className="modal modal-open mt-4">
        <div className="modal-box p-0">
          <header className={`p-4 text-center ${theme.headerBg} ${theme.headerText}`}>
            <h3 className="font-bold text-lg">Hold a Discussion</h3>
          </header>

          <div className={`p-6 ${theme.bodyBg} ${theme.bodyText}`}>
            <textarea
              className={`textarea textarea-bordered w-full h-64 ${theme.bodyInputBg} ${theme.bodyInputText}`}
              placeholder="A discussion never results in a decision or summation process. Everyone weighs in, and then it’s over."
              value={formData.p_discussion || ''}
              onChange={(e) => updateField('p_discussion', e.target.value)}
            />
            <div className="modal-action">
              <button
                className={`btn btn-primary border-none shadow-md ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
                onClick={() => saveActionData()}
              >
                Save
              </button>
              <button
                className="btn border-none shadow-md bg-white text-grey-600 hover:bg-gray-200"
                onClick={() => setFormData((prev) => ({ ...prev, showDiscussionModal: false }))}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {formData.showDiscoveryModal && isDiscovery && (
      <div className="modal modal-open mt-4">
        <div className="modal-box">
          <header className={`p-4 text-center ${theme.headerBg} ${theme.headerText}`}>
            <h3 className="font-bold text-lg">Discover Something New</h3>
          </header>

          <div className={`p-6 ${theme.bodyBg} ${theme.bodyText}`}>
            <textarea
              className={`textarea textarea-bordered w-full h-64 ${theme.bodyInputBg} ${theme.bodyInputText}`}
              placeholder="Introduce a new situation. It might be a problem, opportunity, or a bit of both."
              value={formData.p_discovery || ''}
              onChange={(e) => updateField('p_discovery', e.target.value)}
            />
            <div className="modal-action">
              <button
                className={`btn btn-primary border-none shadow-md ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
                onClick={() => saveActionData()}
              >
                Save
              </button>
              <button
                className="btn border-none shadow-md bg-white text-grey-600 hover:bg-gray-200"
                onClick={() => setFormData((prev) => ({ ...prev, showDiscoveryModal: false }))}
              >
                Cancel
            </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {formData.showProjectModal && isProject && (
      <div className="modal modal-open mt-4">
        <div className="modal-box p-0">
          <header className={`p-4 text-center ${theme.headerBg} ${theme.headerText}`}>
            <h3 className="font-bold text-lg">Start a Project</h3>
          </header>
        
        <div className={`p-6 ${theme.bodyBg} ${theme.bodyText}`}>
            <input
              type="text"
              maxLength="30"
              className={`input input-bordered w-full mb-2 ${theme.bodyInputBg} ${theme.bodyInputText}`}
              placeholder="A catchy title."
              value={formData.pp_title || ''}
              onChange={(e) => updateField('pp_title', e.target.value)}
            />
            <textarea
              className={`textarea textarea-bordered w-full h-64 ${theme.bodyInputBg} ${theme.bodyInputText}`}
              placeholder="Choose a situation and declare what the community will do to resolve it. Do you have the necessary tools and expertise to do this? As a group, decide how many weeks the project would reasonably take to complete (1-6)."
              value={formData.pp_desc || ''}
              onChange={(e) => updateField('pp_desc', e.target.value)}
            />
            <div className="flex items-center space-x-2 mt-4">
              <span className="font-bold">Weeks:</span>
              <button
                className={`btn btn-xs ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
                onClick={() => updateField('pp_weeks', Math.max(1, (formData.pp_weeks || 1) - 1))}
              >
                -
              </button>
              <span>{formData.pp_weeks || 1}</span>
              <button
                className={`btn btn-xs ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
                onClick={() => updateField('pp_weeks', Math.min(6, (formData.pp_weeks || 1) + 1))}
              >
                +
              </button>
            </div>
            <div className="modal-action">
              <button
                className={`btn btn-primary border-none shadow-md ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
                onClick={() => saveActionData()}
              >
                Save
              </button>
              <button
                className="btn border-none shadow-md bg-white text-grey-600 hover:bg-gray-200"
                onClick={() => setFormData((prev) => ({ ...prev, showProjectModal: false }))}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
}