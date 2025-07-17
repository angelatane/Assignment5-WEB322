require('dotenv').config();
const { Sequelize, Op } = require('sequelize');

// Setup Sequelize connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// Define Sector model
const Sector = sequelize.define('Sector', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  sector_name: Sequelize.STRING,
}, {
  createdAt: false,
  updatedAt: false,
});

// Define Project model
const Project = sequelize.define('Project', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: Sequelize.STRING,
  feature_img_url: Sequelize.STRING,
  summary_short: Sequelize.TEXT,
  intro_short: Sequelize.TEXT,
  impact: Sequelize.TEXT,
  original_source_url: Sequelize.STRING,
  sector_id: Sequelize.INTEGER,
}, {
  createdAt: false,
  updatedAt: false,
});

// Relationship
Project.belongsTo(Sector, { foreignKey: 'sector_id' });

// Functions
function initialize() {
  return sequelize.sync();
}

function getAllProjects() {
  return Project.findAll({ include: [Sector] });
}

function getProjectById(projectId) {
  return Project.findOne({
    include: [Sector],
    where: { id: projectId },
  });
}

function getProjectsBySector(sector) {
  return Project.findAll({
    include: [Sector],
    where: {
      '$Sector.sector_name$': {
        [Op.iLike]: `%${sector}%`,
      },
    },
  });
}

function getAllSectors() {
  return Sector.findAll();
}

function addProject(data) {
  return Project.create(data);
}

// Export
module.exports = {
  initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector,
  getAllSectors,
  addProject,
  sequelize,
  Sector,
  Project,
};
