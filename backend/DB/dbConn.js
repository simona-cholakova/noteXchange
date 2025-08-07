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