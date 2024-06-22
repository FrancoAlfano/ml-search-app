import express from 'express';
import validateQuery from '../middleware/validateQuery.js';
import validateParam from '../middleware/validateParam.js';
import { searchItems, getItemDetails } from '../controllers/itemsController.js';

const router = express.Router();

router.get('/', validateQuery, searchItems);
router.get('/:id', validateParam, getItemDetails);

export default router;
