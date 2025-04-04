import { Router } from 'express';
import {
    getCourse,
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse
} from '../controllers/courses.controller.js';

const router = Router();

router.get('/course', getCourses);
router.get('/course/:id', getCourse);
router.post('/course', createCourse);
router.put('/course/:id', updateCourse);
router.delete('/course/:id', deleteCourse);

export default router;
