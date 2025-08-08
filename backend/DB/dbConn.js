const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const mysql = require('mysql2');


const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});

let dataPool = {}
dataPool.getUserById = (enrolment_id) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT enrolment_id, name, surname, email, username, role 
       FROM User 
       WHERE TRIM(enrolment_id) = ?`,
      [enrolment_id.toString()],
      (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) {
          return resolve(null); // user not found
        }
        resolve(results[0]);
      }
    );
  });
};

dataPool.updateUserProfilePicture = (userId, imageUrl) => {
  return new Promise((resolve, reject) => {
    conn.query(
      'UPDATE User SET picture_url = ? WHERE enrolment_id = ?',
      [imageUrl, userId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};


dataPool.publishStudyMaterial = (title, description, provider_name, file, type, academic_year, study_program, university, course) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO StudyMaterial (title, description, provider_name, file, type, academic_year, study_program, university, course) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, provider_name, file, type, academic_year, study_program, university, course],
      (err, res) => {
        if (err) return reject(err);
        return resolve(res);
      }
    );
  });
};

dataPool.register = (enrolment_id, name, surname, email, username, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return reject(err);

      conn.query(
        `INSERT INTO User (enrolment_id, name, surname, email, username, password) VALUES (?, ?, ?, ?, ?, ?)`,
        [enrolment_id, name, surname, email, username, hash],
        (err, res) => {
          if (err) return reject(err);
          return resolve(res);
        }
      );
    });
  });
};


dataPool.login = (enrolment_id, password) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT * FROM User WHERE enrolment_id = ?`,
      [enrolment_id],
      (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) {
          return reject(new Error('User not found'));
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) return reject(err);
          if (!isMatch) return reject(new Error('Incorrect password'));
          resolve(user);
        });
      }
    );
  });
};

dataPool.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM User`, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

dataPool.logout = () => {
  return new Promise((resolve, reject) => {
    conn.query()
  })
}

dataPool.getAllStudyMaterials = () => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT material_id, title, description, provider_name, type, academic_year, study_program, university, course FROM StudyMaterial',
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
  });
};

dataPool.getUserData = async function (enrolmentNumber) {
  try {
    const [rows] = await conn.promise().execute(
      `SELECT name, surname, role, university, academic_year, study_program, picture_url FROM User WHERE TRIM(enrolment_id) = ?`,
      [enrolmentNumber.toString()]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (err) {
    console.error('Error fetching user data:', err.message);
    return null;
  }
};

// ----SEARCH FUNCTIONS FOR THE FILTER----

dataPool.searchByCourse = (course) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM StudyMaterial WHERE course LIKE ?`;
    const values = [`%${course}%`];

    conn.query(query, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

dataPool.searchByYear = (academic_year) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM StudyMaterial WHERE academic_year LIKE ?`;
    const values = [`%${academic_year}%`];

    conn.query(query, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

dataPool.searchByStudyProgram = (study_program) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM StudyMaterial WHERE study_program LIKE ?`;
    const values = [`%${study_program}%`];

    conn.query(query, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

dataPool.searchByProvider = (provider_name) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM StudyMaterial WHERE provider_name LIKE ?`;
    const values = [`%${provider_name}%`];

    conn.query(query, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

dataPool.searchByUniversity = (university) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM StudyMaterial WHERE university LIKE ?`;
    const values = [`%${university}%`];

    conn.query(query, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = dataPool;