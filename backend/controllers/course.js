const Course = require('../models/course');
const User = require('../models/user');
const Category = require('../models/category');
const Section = require('../models/section')
const SubSection = require('../models/subSection')
const CourseProgress = require('../models/courseProgress')

const { uploadImageToCloudinary, deleteResourceFromCloudinary } = require('../utils/imageUploader');
const { convertSecondsToDuration } = require("../utils/secToDuration")



// ================ create new course ================
exports.createCourse = async (req, res) => {
    try {
        console.log('\n\n========================================');
        console.log('🚀 CREATE COURSE FUNCTION STARTED');
        console.log('========================================');
        
        // extract data
        let { courseName, courseDescription, whatYouWillLearn, price, category, instructions: _instructions, status, tag: _tag } = req.body;
        
        console.log('\n📦 RECEIVED DATA:');
        console.log('Course Name:', courseName);
        console.log('Course Description:', courseDescription?.substring(0, 50) + '...');
        console.log('Price:', price);
        console.log('Category ID:', category);
        console.log('Status:', status);
        console.log('Raw tag:', _tag);
        console.log('Raw instructions:', _instructions);
        console.log('Files received:', req.files ? 'Yes' : 'No');
        console.log('Thumbnail in files:', req.files?.thumbnailImage ? 'Yes' : 'No');

        // Convert the tag and instructions from stringified Array to Array
        console.log('\n🔄 PARSING TAG AND INSTRUCTIONS...');
        const tag = JSON.parse(_tag)
        const instructions = JSON.parse(_instructions)
        
        console.log('Parsed tag:', tag);
        console.log('Parsed instructions:', instructions);

        // get thumbnail of course
        const thumbnail = req.files?.thumbnailImage;
        console.log('Thumbnail file:', thumbnail ? thumbnail.name : 'Not found');
        console.log('Thumbnail file:', thumbnail ? thumbnail.name : 'Not found');

        // validation
        console.log('\n✅ VALIDATING REQUIRED FIELDS...');
        console.log('courseName present:', !!courseName);
        console.log('courseDescription present:', !!courseDescription);
        console.log('whatYouWillLearn present:', !!whatYouWillLearn);
        console.log('price present:', !!price);
        console.log('category present:', !!category);
        console.log('thumbnail present:', !!thumbnail);
        console.log('instructions length:', instructions.length);
        console.log('tag length:', tag.length);
        
        if (!courseName || !courseDescription || !whatYouWillLearn || !price
            || !category || !thumbnail || !instructions.length || !tag.length) {
            console.log('❌ VALIDATION FAILED: Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'All Fileds are required'
            });
        }
        
        console.log('✅ All required fields are present');

        if (!status || status === undefined) {
            status = "Draft";
            console.log('Status not provided, setting to Draft');
        }

        // check current user is instructor or not , bcoz only instructor can create 
        // we have insert user id in req.user , (payload , while auth ) 
        const instructorId = req.user.id;
        console.log('\n👤 INSTRUCTOR INFO:');
        console.log('Instructor ID from req.user:', instructorId);
        console.log('Instructor email:', req.user.email);


        // check given category is valid or not
        console.log('\n🔍 VALIDATING CATEGORY...');
        console.log('Category ID to find:', category);
        const categoryDetails = await Category.findById(category);
        
        if (!categoryDetails) {
            console.log('❌ CATEGORY NOT FOUND in database');
            return res.status(401).json({
                success: false,
                message: 'Category Details not found'
            })
        }
        
        console.log('✅ Category found:', categoryDetails.name);
        console.log('Category ID:', categoryDetails._id);


        // upload thumbnail to cloudinary
        console.log('\n☁️  UPLOADING THUMBNAIL TO CLOUDINARY...');
        console.log('Folder name:', process.env.FOLDER_NAME);
        const thumbnailDetails = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
        console.log('✅ Thumbnail uploaded successfully');
        console.log('Thumbnail URL:', thumbnailDetails.secure_url);

        // create new course - entry in DB
        const newCourse = await Course.create({
            courseName, courseDescription, instructor: instructorId, whatYouWillLearn, price, category: categoryDetails._id,
            tag, status, instructions, thumbnail: thumbnailDetails.secure_url, createdAt: Date.now(),
        });

        // add course id to instructor courses list, this is bcoz - it will show all created courses by instructor 
        console.log('\n👤 UPDATING INSTRUCTOR PROFILE...');
        console.log('Adding course', newCourse._id, 'to instructor', instructorId);
        
        const updatedUser = await User.findByIdAndUpdate(instructorId,
            {
                $push: {
                    courses: newCourse._id
                }
            },
            { new: true }
        );
        
        console.log('✅ Instructor updated successfully');
        console.log('Instructor now has', updatedUser.courses.length, 'courses');


        // Add the new course to the Categories
        console.log('\n📚 UPDATING CATEGORY...');
        console.log('Adding course', newCourse._id, 'to category', category);
        
        const updatedCategory = await Category.findByIdAndUpdate(
            { _id: category },
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        );
        
        console.log('✅ Category updated successfully');
        console.log('Category now has', updatedCategory.courses.length, 'courses');

        // return response
        console.log('\n✅✅✅ COURSE CREATION SUCCESSFUL! ✅✅✅');
        console.log('Final Course ID:', newCourse._id);
        console.log('========================================\n\n');
        
        res.status(200).json({
            success: true,
            data: newCourse,
            message: 'New Course created successfully'
        })
    }

    catch (error) {
        console.log('\n\n❌❌❌ ERROR WHILE CREATING NEW COURSE ❌❌❌');
        console.log('Error name:', error.name);
        console.log('Error message:', error.message);
        console.log('Full error stack:', error.stack);
        console.log('========================================\n\n');
        
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while creating new course'
        })
    }
}


// ================ show all courses ================
exports.getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({ status: "Published" },
            {
                courseName: true, courseDescription: true, price: true, thumbnail: true, instructor: true,
                ratingAndReviews: true, studentsEnrolled: true, status: true
            })
            .populate({
                path: 'instructor',
                select: 'firstName lastName email image'
            })
            .exec();

        return res.status(200).json({
            success: true,
            data: allCourses,
            message: 'Data for all courses fetched successfully'
        });
    }

    catch (error) {
        console.log('Error while fetching data of all courses');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while fetching data of all courses'
        })
    }
}



// ================ Get Course Details ================
exports.getCourseDetails = async (req, res) => {
    try {
        // get course ID
        const { courseId } = req.body;

        // find course details
        const courseDetails = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")

            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                    select: "-videoUrl",
                },
            })
            .exec()


        //validation
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find the course with ${courseId}`,
            });
        }

        // if (courseDetails.status === "Draft") {
        //   return res.status(403).json({
        //     success: false,
        //     message: `Accessing a draft course is forbidden`,
        //   });
        // }

        // console.log('courseDetails -> ', courseDetails)
        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration)
                totalDurationInSeconds += timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        //return response
        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
            },
            message: 'Fetched course data successfully'
        })
    }

    catch (error) {
        console.log('Error while fetching course details');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while fetching course details',
        });
    }
}


// ================ Get Full Course Details ================
exports.getFullCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body
        const userId = req.user.id
        // console.log('courseId userId  = ', courseId, " == ", userId)

        const courseDetails = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec()

        let courseProgressCount = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        })

        //   console.log("courseProgressCount : ", courseProgressCount)

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            })
        }

        // if (courseDetails.status === "Draft") {
        //   return res.status(403).json({
        //     success: false,
        //     message: `Accessing a draft course is forbidden`,
        //   });
        // }

        //   count total time duration of course
        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration)
                totalDurationInSeconds += timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
                completedVideos: courseProgressCount?.completedVideos ? courseProgressCount?.completedVideos : [],
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}



// ================ Edit Course Details ================
exports.editCourse = async (req, res) => {
    try {
        console.log('\n\n========================================');
        console.log('✏️  EDIT COURSE FUNCTION STARTED');
        console.log('========================================');
        
        const { courseId } = req.body
        const updates = req.body
        
        console.log('\n📦 RECEIVED UPDATE DATA:');
        console.log('Course ID:', courseId);
        console.log('User ID:', req.user.id);
        console.log('Update fields:', Object.keys(updates));
        console.log('Files received:', req.files ? 'Yes' : 'No');
        
        console.log('\n🔍 FINDING COURSE IN DATABASE...');
        const course = await Course.findById(courseId)

        if (!course) {
            console.log('❌ COURSE NOT FOUND with ID:', courseId);
            return res.status(404).json({ error: "Course not found" })
        }
        
        console.log('✅ Course found:', course.courseName);
        console.log('Current course instructor:', course.instructor);
        console.log('Request from user:', req.user.id);

        // If Thumbnail Image is found, update it
        if (req.files) {
            console.log('\n☁️  UPDATING THUMBNAIL IN CLOUDINARY...');
            const thumbnail = req.files.thumbnailImage
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            )
            course.thumbnail = thumbnailImage.secure_url
            console.log('✅ Thumbnail updated:', thumbnailImage.secure_url);
        }

        // Update only the fields that are present in the request body
        console.log('\n🔄 UPDATING COURSE FIELDS...');
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                if (key === "tag" || key === "instructions") {
                    course[key] = JSON.parse(updates[key])
                    console.log(`Updated ${key}:`, course[key]);
                } else {
                    course[key] = updates[key]
                    console.log(`Updated ${key}:`, updates[key]);
                }
            }
        }

        // updatedAt
        course.updatedAt = Date.now();
        console.log('Updated timestamp:', new Date(course.updatedAt));

        //   save data
        console.log('\n💾 SAVING COURSE TO DATABASE...');
        await course.save()
        console.log('✅ Course saved successfully');

        const updatedCourse = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec()

        // success response
        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Error while updating course",
            error: error.message,
        })
    }
}



// ================ Get a list of Course for a given Instructor ================
exports.getInstructorCourses = async (req, res) => {
    try {
        console.log('\n\n========================================');
        console.log('📚 GET INSTRUCTOR COURSES FUNCTION STARTED');
        console.log('========================================');
        
        // Get the instructor ID from the authenticated user or request body
        const instructorId = req.user.id
        console.log('\n👤 Instructor ID:', instructorId);
        console.log('User email:', req.user.email);

        // Find all courses belonging to the instructor
        console.log('\n🔍 SEARCHING FOR COURSES IN DATABASE...');
        const instructorCourses = await Course.find({ instructor: instructorId, }).sort({ createdAt: -1 })
        
        console.log('✅ Courses found:', instructorCourses.length);
        if (instructorCourses.length > 0) {
            console.log('Course IDs:', instructorCourses.map(c => c._id));
            console.log('Course Names:', instructorCourses.map(c => c.courseName));
        } else {
            console.log('⚠️  NO COURSES FOUND for this instructor');
        }


        // Return the instructor's courses
        console.log('\n✅ RETURNING INSTRUCTOR COURSES');
        console.log('========================================\n\n');
        
        res.status(200).json({
            success: true,
            data: instructorCourses,
            // totalDurationInSeconds:totalDurationInSeconds,
            message: 'Courses made by Instructor fetched successfully'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message,
        })
    }
}



// ================ Delete the Course ================
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body

        // Find the course
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }

        // Unenroll students from the course
        const studentsEnrolled = course.studentsEnrolled
        for (const studentId of studentsEnrolled) {
            await User.findByIdAndUpdate(studentId, {
                $pull: { courses: courseId },
            })
        }

        // delete course thumbnail From Cloudinary
        await deleteResourceFromCloudinary(course?.thumbnail);

        // Delete sections and sub-sections
        const courseSections = course.courseContent
        for (const sectionId of courseSections) {
            // Delete sub-sections of the section
            const section = await Section.findById(sectionId)
            if (section) {
                const subSections = section.subSection
                for (const subSectionId of subSections) {
                    const subSection = await SubSection.findById(subSectionId)
                    if (subSection) {
                        await deleteResourceFromCloudinary(subSection.videoUrl) // delete course videos From Cloudinary
                    }
                    await SubSection.findByIdAndDelete(subSectionId)
                }
            }

            // Delete the section
            await Section.findByIdAndDelete(sectionId)
        }

        // Delete the course
        await Course.findByIdAndDelete(courseId)

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Error while Deleting course",
            error: error.message,
        })
    }
}




