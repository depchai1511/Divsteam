const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {AuthenticationError,ForbiddenError} = require('apollo-server-express');
//const pool = require('../modules/database.js'); 
const { Pool } = require('pg');


require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

pool.connect((err) => {
    if (err) throw err;
    console.log('Connected to PostgreSQL server');
});

const resolvers = {
    Query: {
        user: async (_, { id }) => {
            const query = 'SELECT * FROM users WHERE user_id = $1';
            const values = [id];
            const { rows } = await pool.query(query, values);
            return rows[0];
        },
        course: async (_, { id }) => {
            const query = 'SELECT * FROM courses WHERE user_id = $1';
            const values = [id];
            const { rows } = await pool.query(query, values);
            return rows[0];
        },
        users: async () => {
            const query = 'SELECT * FROM users';
            const { rows } = await pool.query(query);
            return rows;
        }

    },
    /* Suggestion: {
         User: async (suggestion) => {
             const query = 'SELECT * FROM users WHERE id = $1';
             const values = [suggestion.user_id];
             const { rows } = await pool.query(query, values);
             return rows[0];
         },
         course: async (suggestion) => {
             const query = 'SELECT * FROM courses WHERE id = $1';
             const values = [suggestion.course_id];
             const { rows } = await pool.query(query, values);
             return rows[0];
         },
     },
     Course: {
         tags: async (course) => {
             const query = 'SELECT * FROM course_tags WHERE course_id = $1';
             const values = [course.id];
             const { rows } = await pool.query(query, values);
             const tagIds = rows.map(row => row.tag_id);
             const tagQuery = 'SELECT * FROM tags WHERE id IN ($1)';
             const tagValues = [tagIds];
             const tagResult = await pool.query(tagQuery, tagValues);
             return tagResult.rows;
         },
     },*/
    Mutation: {
        signUp: async (_, { full_name, email, password, username }) => {
            email = email.trim().toLowerCase();
            const hashed = await bcrypt.hash(password, 10);
            try {

                const checkUsernameQuery = `SELECT * FROM users WHERE username = $1`;
                const usernameExists = await pool.query(checkUsernameQuery, [username]);
                if (usernameExists.rows.length > 0) {
                    throw new Error('Username already exists');
                }
                const checkEmailQuery = `SELECT * FROM users WHERE email = $1`;
                const emailExists = await pool.query(checkEmailQuery, [email]);
                if (emailExists.rows.length > 0) {
                    throw new Error('Email already exists');
                }

                const query = `
                INSERT INTO users (full_name, email, username,password)
                VALUES ($1, $2, $3, $4)
                RETURNING *
                `;
                const values = [full_name, email, username, hashed];
                const { rows } = await pool.query(query, values);
                console.log('User created:', rows[0]);
                return jwt.sign({ id: rows[0].user_id }, process.env.JWT_SECRET);
            } catch (error) {
                console.error('Error creating user', error);
                throw new Error('Could not create user');
            }
        },
        signIn: async (_, { username, password }) => {
            try {
                const query = `SELECT * FROM users WHERE username = $1`;
                const { rows } = await pool.query(query, [username]);
                if (rows.length === 0) {
                    throw new AuthenticationError('Error signing in');
                }
                const user = rows[0];
                const valid = await bcrypt.compare(password, user.password);

                if (!valid) {
                    throw new AuthenticationError('Error signing in');
                }
                return jwt.sign({ id: user.user_id }, process.env.JWT_SECRET);
            } catch (error) {
                console.error('Error logging in', error);
                throw new Error('Could not log in');
            }
        },
        createSuggestion: async (_, { user_id, course_id }) => {

            if(!user_id) {
                throw new AuthenticationError('You must be signed in');
            }

            try {
              const query = `
              INSERT INTO suggestions (user_id, course_id)
              VALUES ($1, $2)
              RETURNING *
              `;
                const values = [user_id, course_id];
                const { rows } = await pool.query(query, values);
                console.log('Suggestion created:', rows[0]);
                return rows[0];
            } catch (error) {
                console.error('Error creating suggestion', error);
                throw new Error('Could not create suggestion');
            }
        },
         createTag: async (_, { user_id , title }) => {
            if (!user_id) {
                throw new AuthenticationError('You must be signed in');
            }

            try {
                const query = `
                INSERT INTO tags (title) 
                VALUES ($1)
                RETURNING *
              `;
                const values = [title];
                const { rows } = await pool.query(query, values);
                console.log('Tag created:', rows[0]);
                return rows[0];
            } catch (error) {
                console.error('Error creating tag', error);
                throw new Error('Could not create tag');
            }
        },
        createCourse: async (_, { user_id, title, description }) => {

            if (!user_id) {
                throw new AuthenticationError('You must be signed in');
            }

            try {
                const query = `
                INSERT INTO courses (user_id, title, description) 
                VALUES ($1, $2, $3)
                RETURNING *
              `;
                const values = [user_id, title, description];
                const { rows } = await pool.query(query, values);
                console.log('Course created:', rows[0]);
                return rows[0];
            } catch (error) {
                console.error('Error creating course', error);
                throw new Error('Could not create course');
            }
        }

    }
}

const getUser = token => {
    if (token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            throw new Error('Session invalid');
        }
    }
};

module.exports = {resolvers,getUser};