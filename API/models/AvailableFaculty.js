const { Op, literal } = require('sequelize');
const { Batch, FacultyBatchMapping, FacultySchedule, Faculty, User } = require('./models'); // Adjust the path to your models

const AvailableFaculties = async () => {
  const availableFaculty = await Faculty.findAll({
    attributes: [],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['fullName'], 
      },
      {
        model: FacultyBatchMapping,
        as: 'batchMapping',
        attributes: [],
        include: [
          {
            model: Batch,
            as: 'batch',
            attributes: [
              'branchId', 'courseId', 'name', 
              'startDate', 'endDate', 'startTime', 'endTime'
            ],
            where: {
              startDate: {
                [Op.gte]: literal('CURDATE()'), 
              },
            },
          },
        ],
      },
      {
        model: FacultySchedule,
        as: 'availability',
        attributes: [
          'weekday', 
          ['startTime', 'availableStartTime'], 
          ['endTime', 'availableEndTime']
        ],
        where: {
          isActive: 1,
        },
        required: false, 
      },
    ],
    where: literal(
      '(batch.startTime >= FacultySchedule.startTime AND batch.endTime <= FacultySchedule.endTime)'
    ),
    order: [
      ['batchMapping', 'batch', 'startDate', 'ASC'],
      ['availability', 'weekday', 'ASC'],
    ],
    raw: true,
  });

  return availableFaculty;
};

module.exports = {
  AvailableFaculties,
};
