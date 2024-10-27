




const { Op } = require('sequelize');
const StudentRegistration = require('../models/StudentRegistration');

const registerStudent = async (req, res) => {
  try {
    const { name, email, mobileno, branch} = req.body;

    // Validate required fields
    if (!name || !email || !mobileno || !branch ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, email, mobileno, branch, createdBy',
      });
    }

    // Check if a student with the same name, email, or mobileno already exists
    const existingStudent = await StudentRegistration.findOne({
      where: {
        [Op.or]: [
          { name: name },
          { email: email },
          { mobileno: mobileno }
        ]
      }
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: 'A student with the same name, email, or mobile number already exists',
      });
    }

   
    const newStudent = await StudentRegistration.create({
      name,
      email,
      mobileno,
      branch,
      
    });

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: newStudent,
    });
  } catch (error) {
    console.error('Error registering student:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while registering the student',
      error: error.message,
    });
  }
};




const getRegisterStudent = async(req,res) =>
    {
        try {
            const { branch } = req.query;
    
            // Fetching students based on branchName and active status
            const students = await StudentRegistration.findAll({
                where: {
                    ...(branch && { branch: { [Op.like]: `%${branch}%` } }),
                    isActive: true // Filter by active status
                },
                attributes: ['id','name', 'email', 'mobileno', 'branch'],
            });
    
            // Return the fetched students
            return res.status(200).json(students);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "An unexpected error occurred.",
                error: error.message,
            });
        }
    };

    const updateRegister = async(req,res) => {
      try{

        const { id, name, email, mobileno, branch } = req.body; // Destructure the request body

        // Ensure the ID is provided
        console.log(id);
        if (!id) {
          return res.status(400).json({ message: "Student ID is required." });
        }
    
        // Find the student by ID
        const student = await StudentRegistration.findByPk(id);
    
        // If student not found
        if (!student) {
          return res.status(404).json({ message: "Student not found." });
        }
    
        // Update the student details
        await student.update({
          name: name ,
          email: email ,
          mobileno: mobileno ,
          branch: branch 
        
        });
    
        return res.status(200).json({
          message: "Student registration updated successfully.",
          data: student, // Return the updated student data
        });
    

      }
      catch(error) {
        return res.status(500).json({
          message: "An unexpected error occurred.",
          error: error.message,
      });
      }
    }

module.exports ={
    registerStudent, getRegisterStudent, updateRegister
}