const Joi = require('joi');
const { updateWorkflow } = require('../../services/workflowService');

const schema = Joi.object({
  name: Joi.string().min(3),
  active: Joi.boolean(),
  nodes: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      type: Joi.string().required(),
      config: Joi.object().default({}),
    })
  ),
  connections: Joi.array().items(
    Joi.object({
      source: Joi.string().required(),
      target: Joi.string().required(),
    })
  ),
});

async function updateWorkflowController(req, res, next) {
  try {
    const payload = await schema.validateAsync(req.body, { abortEarly: false });
    const workflow = await updateWorkflow(req.params.workflowId, payload);
    res.json(workflow);
  } catch (error) {
    next(error);
  }
}

module.exports = { updateWorkflowController };
