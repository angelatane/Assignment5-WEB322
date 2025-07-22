require('dotenv').config();
const { Sequelize, Op, DataTypes } = require('sequelize');

let sequelize;
let Sector;
let Project;

// 🔐 Safely connect to DB
try {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
    logging: false,
  });

  // ✅ Define models only after sequelize is created
  Sector = sequelize.define('Sector', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sector_name: DataTypes.STRING,
  }, { createdAt: false, updatedAt: false });

  Project = sequelize.define('Project', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: DataTypes.STRING,
    feature_img_url: DataTypes.STRING,
    summary_short: DataTypes.TEXT,
    intro_short: DataTypes.TEXT,
    impact: DataTypes.TEXT,
    original_source_url: DataTypes.STRING,
    sector_id: DataTypes.INTEGER,
  }, { createdAt: false, updatedAt: false });

  Project.belongsTo(Sector, { foreignKey: 'sector_id' });

} catch (err) {
  console.error('❌ Sequelize init error:', err.message);
}

// Functions
function initialize() {
  return sequelize.sync();
}

async function getAllProjects() {
  try {
    return await Project.findAll({ include: [Sector] });
  } catch (err) {
    console.error('❌ getAllProjects error:', err.message);
    throw err;
  }
}

async function getProjectById(projectId) {
  try {
    return await Project.findOne({
      include: [Sector],
      where: { id: projectId },
    });
  } catch (err) {
    console.error('❌ getProjectById error:', err.message);
    throw err;
  }
}

async function getProjectsBySector(sector) {
  try {
    return await Project.findAll({
      include: [Sector],
      where: {
        '$Sector.sector_name$': {
          [Op.iLike]: `%${sector}%`,
        },
      },
    });
  } catch (err) {
    console.error('❌ getProjectsBySector error:', err.message);
    throw err;
  }
}

async function getAllSectors() {
  try {
    return await Sector.findAll();
  } catch (err) {
    console.error('❌ getAllSectors error:', err.message);
    throw err;
  }
}

async function addProject(data) {
  try {
    return await Project.create(data);
  } catch (err) {
    console.error('❌ addProject error:', err.message);
    throw err;
  }
}

// Export
module.exports = {
  initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector,
  getAllSectors,
  addProject,
};
