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

dataPool.publishStudyMaterial = (material_type, title, status, academic_year, study_program, university, description, c_id) => {
  return new Promise((resolve, reject) => {
    conn.query(`INSERT INTO Study_Material (material_type, title, status, academic_year, study_program, university, description, c_id) 
      VALUES (?,?,?,?,?,?,?,?)`, [material_type, title, status, academic_year, study_program, university, description, c_id],
      (err, res) => {
        if (err) { return reject(err) }
        return resolve(res)
      })
  })
}

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


module.exports = dataPool;