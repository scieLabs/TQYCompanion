import { useState, useContext } from 'react';
import * as promptApi from '../api/promptApi.js';
import * as gameAPI from '../api/gameApi.js';
import * as statAPI from '../api/statApi.js';
import * as projectAPI from '../api/projectApi.js';
import { handleApiError } from '../utils/errorHandler.js';
import { useSeason } from '../contexts/seasonContext.jsx'; 

export default function ActionModal({ action, game_id, currentWeek, prompt, stats, setStats, formData, setFormData, isDiscussion, isDiscovery, isProject }) {
  
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
      <div>
        <label className="block font-bold">What is the fate of the community?</label>
        <textarea
          className="textarea textarea-bordered w-full"
          value={formData.end || ''}
          onChange={(e) => updateField('end', e.target.value)}
          placeholder="Describe the fate of the community..."
        />
      </div>
    );
  }

  const renderActionForm = () => {
    //displays individual actions
    return (
      <div>
      <h2 className="text-center my-8 uppercase font-lg font-bold underline">Choose One</h2>
      <div className="flex flex-row justify-between space-x-6 mx-8">

        <div className="w-1/3 flex flex-col items-center">
          <label className="block font-bold mb-2 text-center">Discover something new</label>
          <textarea
            className={`textarea textarea-bordered w-full h-64 ${theme.bodyInputBg} ${theme.bodyInputText}`}
            placeholder="Introduce a new situation. It might be a problem, opportunity, or a bit of both."
            value={formData.discovery || ''}
            onChange={(e) => updateField('discovery', e.target.value)}
          />
        </div>

        <div className="w-1/3 flex flex-col items-center">
          <label className="block font-bold mb-2 text-center">Hold a discussion</label>
          <textarea
            className={`textarea textarea-bordered w-full h-64 ${theme.bodyInputBg} ${theme.bodyInputText}`}
            placeholder="A discussion never results in a decision or summation process. Everyone weighs in, and then it’s over."
            value={formData.discussion || ''}
            onChange={(e) => updateField('discussion', e.target.value)}
          />
        </div>

        <div className="w-1/3 flex flex-col items-center">
          <label className="block font-bold text-center mb-2">Start a project</label>
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
            <span className="font-bold">Weeks:</span>
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

      {/* Conditionally show the modal buttons */}
      {isDiscussion && (
        <button
          className={`btn btn-sm mt-4 ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
          onClick={() => setFormData(prev => ({ ...prev, showDiscussionModal: true }))}
        >
          Hold a Discussion
        </button>
      )}
      {isDiscovery && (
        <button
          className={`btn btn-sm mt-4 shadow-sm ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
          onClick={() => setFormData(prev => ({ ...prev, showDiscoveryModal: true }))}
        >
          Discover Something New
        </button>
      )}
      {isProject && (
        <button
          className={`btn btn-sm mt-4 shadow-sm ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
          onClick={() => setFormData(prev => ({ ...prev, showProjectModal: true }))}
        >
          Start a Project
        </button>
      )}

      {/* Render always visible action form */}
      {renderActionForm()}

      {/* Modal rendering logic will go here */}
      {formData.showDiscussionModal && isDiscussion && ( //FIXME: used to be action.isDiscussion
        <div className="modal modal-open mt-4">
          <label className="block font-bold">Prompt Discussion</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={formData.p_discussion || ''}
            onChange={(e) => updateField('p_discussion', e.target.value)}
          />
            <div>
                <button
                    className="btn btn-primary mt-4"
                    // onClick={() => saveActionData({ p_discussion: formData.p_discussion })
                    onClick={() => saveActionData()
                    //FIXME: old with props
                    // onClick={() =>
                    //     saveActionData(gameTitle, currentWeek, { p_discussion: formData.p_discussion })
                    }
                    >
                    Save Prompt Discussion
                </button>
            </div>
        </div>
      )}

      {formData.showDiscoveryModal && isDiscovery && (
        <div className="modal modal-open mt-4">
          <label className="block font-bold">Prompt Discovery</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={formData.p_discovery || ''}
            onChange={(e) => updateField('p_discovery', e.target.value)}
          />
        <div>
            <button
                className="btn btn-primary mt-4"
                // onClick={() =>
                // //FIXME: props removed
                //     saveActionData({ p_discovery: formData.p_discovery })
                // }
                onClick={() => saveActionData()}
                >
                Save Prompt Discovery
            </button>
        </div>
        </div>
      )}

      {formData.showProjectModal && isProject && (
        <div className="modal modal-open mt-4">
          <label className="block font-bold">Prompt Project</label>
          <input
            className="input input-bordered w-full"
            placeholder="Title"
            value={formData.pp_title || ''}
            onChange={(e) => updateField('pp_title', e.target.value)}
          />
          <textarea
            className="textarea textarea-bordered w-full mt-2"
            placeholder="Description"
            value={formData.pp_desc || ''}
            onChange={(e) => updateField('pp_desc', e.target.value)}
          />
          <div className="flex items-center space-x-2 mt-2">
            <span className="font-bold">Weeks:</span>
            <button className="btn btn-sm" onClick={() => updateField('pp_weeks', Math.max(1, (formData.pp_weeks || 1) - 1))}>-</button>
            <span>{formData.pp_weeks || 1}</span>
            <button className="btn btn-sm" onClick={() => updateField('pp_weeks', Math.min(6, (formData.pp_weeks || 1) + 1))}>+</button>
            </div>
            <div>
                <button
                    className="btn btn-primary mt-4"
                    // onClick={() =>
                    // //FIXME: props removed
                    //     saveActionData({
                    //     pp_title: formData.pp_title,
                    //     pp_desc: formData.pp_desc,
                    //     pp_weeks: formData.pp_weeks,
                    //     })
                    // }
                    onClick={() => saveActionData()}
                    >
                    Save Project
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
