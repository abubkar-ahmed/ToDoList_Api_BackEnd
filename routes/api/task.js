const express = require('express');
const router = express.Router();
const tasksController = require('../../controllers/tasksController');

router.route('/')
    .get(tasksController.handleAllTasks)
    .post(tasksController.createNewTask)
    .put(tasksController.updateTask)

router.route('/clear')
    .get(tasksController.clearTasks)
    
router.route('/:id')
    .delete(tasksController.deleteTask)


module.exports = router
