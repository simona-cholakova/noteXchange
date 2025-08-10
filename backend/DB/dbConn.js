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
      `SELECT enrolment_id, name, surname, email, username, role, picture_url 
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

dataPool.updateUserPicture = (userId, pictureUrl) => {
  return new Promise((resolve, reject) => {
    conn.query(
      'UPDATE User SET picture_url = ? WHERE TRIM(enrolment_id) = ?',
      [pictureUrl, userId.toString()],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};

dataPool.publishStudyMaterial = (title, description, provider_enrolment_id, provider_name, provider_surname, file, type, academic_year, study_program, university, course) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO StudyMaterial 
      (title, description, provider_enrolment_id, provider_name, provider_surname, file, type, academic_year, study_program, university, course) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, provider_enrolment_id, provider_name, provider_surname, file, type, academic_year, study_program, university, course],
      (err, res) => {
        if (err) return reject(err);
        return resolve(res);
      }
    );
  });
};

dataPool.getProviderByEnrolmentId = (provider_enrolment_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        enrolment_id AS provider_enrolment_id,
        name AS provider_name,
        surname AS provider_surname,
        role AS provider_role,
        picture_url,
        email AS provider_email
      FROM User
      WHERE TRIM(enrolment_id) = ?
    `;
    conn.query(query, [provider_enrolment_id.toString()], (err, results) => {
      if (err) {
        console.error('MySQL error in getProviderByEnrolmentId:', err);
        return reject(err);
      }
      if (results.length === 0) return resolve(null);
      resolve(results[0]);
    });
  });
};


dataPool.getStudyMaterialById = (material_id) => {
  return new Promise((resolve, reject) => {
    const query = `
  SELECT 
    sm.material_id, 
    sm.title, 
    sm.description, 
    sm.file, 
    sm.type, 
    sm.academic_year, 
    sm.study_program, 
    sm.university, 
    sm.course, 
    sm.created_at,
    u.enrolment_id AS provider_enrolment_id,
    u.name AS provider_name,
    u.surname AS provider_surname,
    u.role AS provider_role
  FROM StudyMaterial sm
  LEFT JOIN User u ON sm.provider_enrolment_id = u.enrolment_id
  WHERE sm.material_id = ?
`;

    conn.query(query, [material_id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);
      resolve(results[0]);
    });
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

dataPool.getAllProviders = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * 
      FROM User
      WHERE TRIM(role) = 'provider'
    `;
    conn.query(query, (err, results) => {
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
    const query = `SELECT material_id, title, description, provider_name, type, academic_year, study_program, university, created_at, course, provider_surname, provider_enrolment_id FROM StudyMaterial`;
    conn.query(query, (err, results) => {
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