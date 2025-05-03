import { useState, useContext } from 'react';
import * as promptApi from '../api/promptApi.js';
import * as gameAPI from '../api/gameApi.js';
import { handleApiError } from '../utils/errorHandler.js';
import { useSeason } from '../contexts/seasonContext.jsx'; 

export default function ActionModal({ action, game_id, currentWeek, prompt, stats, setStats, formData, setFormData, isDiscussion, isDiscovery, isProject }) {
  
  const GAME_OVER_PROMPT_ID = '6809feda210f991dba3d9c70';

  const { currentSeason, seasonThemes } = useSeason(); // Access season context
  const theme = seasonThemes[currentSeason] || {};

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const saveActionData = async (field, value) => {
    try {
      await statAPI.saveActionData(game_id, currentWeek, { [field]: value });
      console.log(`Saved ${field}:`, value);
      console.log('Saving action data:', { gameTitle, week, data });
    } catch (err) {
      console.error(`Error saving ${field}:`, err.message);
      handleApiError(err, 'saveActionData');
    }
  };

  



  const renderActionForm = () => {
    //displays individual actions
    return (
      <div className="space-y-4">
        <div>
          <label className="block font-bold">Discover something new</label>
          <textarea
            className={`textarea textarea-bordered w-full ${theme.bodyInputBg} ${theme.bodyInputText}`}
            value={formData.discovery || ''}
            onChange={(e) => updateField('discovery', e.target.value)}
          />
            {/* <button
                className="btn btn-primary mt-4"
                onClick={() =>
                saveActionData(gameTitle, currentWeek, { discovery: formData.discovery })
                }
            >
                Save Discovery
            </button> */}
        </div>
        <div>
          <label className="block font-bold">Hold a discussion</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={formData.discussion || ''}
            onChange={(e) => updateField('discussion', e.target.value)}
          />
            {/* <button
                className="btn btn-primary mt-4"
                onClick={() =>
                saveActionData(gameTitle, currentWeek, { discussion: formData.discussion })
                }
            >
                Save Discussion
            </button> */}
        </div>
        <div>
          <label className="block font-bold">Start a project</label>
          <input
            className="input input-bordered w-full"
            placeholder="Title"
            value={formData.project_title || ''}
            onChange={(e) => updateField('project_title', e.target.value)}
          />
          <textarea
            className="textarea textarea-bordered w-full mt-2"
            placeholder="Description"
            value={formData.project_desc || ''}
            onChange={(e) => updateField('project_desc', e.target.value)}
          />
          <div className="flex items-center space-x-2 mt-2">
            <span className="font-bold">Weeks:</span>
            <button className="btn btn-sm" onClick={() => updateField('project_weeks', Math.max(1, (formData.project_weeks || 1) - 1))}>-</button>
            <span>{formData.project_weeks || 1}</span>
            <button className="btn btn-sm" onClick={() => updateField('project_weeks', Math.min(6, (formData.project_weeks || 1) + 1))}>+</button>
          </div>
          {/* <button
                className="btn btn-primary mt-4"
                onClick={() =>
                saveActionData(gameTitle, currentWeek, {
                    project_title: formData.project_title,
                    project_desc: formData.project_desc,
                    project_weeks: formData.project_weeks,
                })
                }
            >
                Save Project
            </button> */}
        </div>
      </div>
    );
  };

  if (action && action._id.toString() === GAME_OVER_PROMPT_ID) {
    return (
      <div>
        <label className="block font-bold">Enter Epilogue</label>
        <textarea
          className="textarea textarea-bordered w-full"
          value={formData.end || ''}
          onChange={(e) => updateField('end', e.target.value)}
        />
        <button className="btn btn-error mt-2" 
        onClick={() => navigate("/summary")}
        >Game Over</button>
      </div>
    );
  }

  return (
    <div>
      {/* Render always visible action form */}
      {renderActionForm()}

      {/* Conditionally show the modal buttons */}
      {formData.isDiscussion && (
        <button
          className="btn btn-sm mt-4"
          onClick={() => setFormData(prev => ({ ...prev, showDiscussionModal: true }))}
        >
          Open Discussion Modal
        </button>
      )}
      {formData.isDiscovery && (
        <button
          className="btn btn-sm mt-4"
          onClick={() => setFormData(prev => ({ ...prev, showDiscoveryModal: true }))}
        >
          Open Discovery Modal
        </button>
      )}
      {formData.isProject && (
        <button
          className="btn btn-sm mt-4"
          onClick={() => setFormData(prev => ({ ...prev, showProjectModal: true }))}
        >
          Open Project Modal
        </button>
      )}

      {/* Modal rendering logic will go here */}
      {formData.showDiscussionModal && formData.isDiscussion && ( //FIXME: used to be action.isDiscussion
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
                    onClick={() => saveActionData({ p_discussion: formData.p_discussion })
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

      {formData.showDiscoveryModal && formData.isDiscovery && (
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
                onClick={() =>
                //FIXME: props removed
                    saveActionData({ p_discovery: formData.p_discovery })
                }
                >
                Save Prompt Discovery
            </button>
        </div>
        </div>
      )}

      {formData.showProjectModal && formData.isProject && (
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
                    onClick={() =>
                    //FIXME: props removed
                        saveActionData({
                        pp_title: formData.pp_title,
                        pp_desc: formData.pp_desc,
                        pp_weeks: formData.pp_weeks,
                        })
                    }
                    >
                    Save Project
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
