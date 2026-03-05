const Joi = require('joi');
const { createWorkflow } = require('../../services/workflowService');

const schema = Joi.object({
  name: Joi.string().min(3).required(),
  active: Joi.boolean().default(true),
  nodes: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        type: Joi.string().required(),
        config: Joi.object().default({}),
      })
    )
    .min(1)
    .required(),
  connections: Joi.array()
    .items(
      Joi.object({
        source: Joi.string().required(),
        target: Joi.string().required(),
      })
    )
    .required(),
});

async function createWorkflowController(req, res, next) {
  try {
    const value = await schema.validateAsync(req.body, { abortEarly: false });
    const workflow = await createWorkflow(value, req.user.id);
    res.status(201).json(workflow);
  } catch (error) {
    next(error);
  }
}

module.exports = { createWorkflowController };
