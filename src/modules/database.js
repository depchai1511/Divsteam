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

const createTables = async () => {
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS Users (
            user_id SERIAL PRIMARY KEY,
            full_name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS Courses (
            course_id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            CONSTRAINT fk_user_id
                FOREIGN KEY (user_id)
                REFERENCES Users(user_id)
        );
    `);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS Suggestions (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            course_id INT NOT NULL,
            status BOOL DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT NOW(),
            CONSTRAINT fk_user_id
                FOREIGN KEY (user_id)
                REFERENCES Users(user_id),
            CONSTRAINT fk_course_id
                FOREIGN KEY (course_id)
                REFERENCES Courses(course_id)
        );
    `);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS Enrollment (
            enrollment_id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            course_id INT NOT NULL,
            enrollment_date TIMESTAMP DEFAULT NOW(),
            CONSTRAINT fk_user_id
                FOREIGN KEY (user_id)
                REFERENCES Users(user_id),
            CONSTRAINT fk_course_id
                FOREIGN KEY (course_id)
                REFERENCES Courses(course_id)
        );
    `);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS Posts (
            user_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            title text NOT NULL,
            post_id SERIAL PRIMARY KEY, 
            course_id int NOT NULL,
            CONSTRAINT fk_user_id
                FOREIGN KEY (user_id)
                REFERENCES Users(user_id),
            CONSTRAINT fk_course_id
                FOREIGN KEY (course_id)
                REFERENCES courses(course_id)
        );
    `);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS Tags(
            title text not null unique,
            tag_id serial primary key
        );
    `);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS post_tags (
            post_id integer NOT NULL,
            tag_id integer NOT NULL,
            PRIMARY KEY (post_id, tag_id),
            FOREIGN KEY (post_id) REFERENCES posts(post_id),
            FOREIGN KEY (tag_id) REFERENCES tags(tag_id)
        );
    `);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS course_tags (
            course_id integer NOT NULL,
            tag_id integer NOT NULL,
            PRIMARY KEY (course_id, tag_id),
            FOREIGN KEY (course_id) REFERENCES courses(course_id),
            FOREIGN KEY (tag_id) REFERENCES tags(tag_id)
        );
    `);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS vote_post (
            post_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            vote_type bool,
            CONSTRAINT fk_post_id
                FOREIGN KEY (post_id)
                REFERENCES posts(post_id),
            CONSTRAINT fk_user_id
                FOREIGN KEY (user_id)
                REFERENCES Users(user_id)
        );
    `);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS vote_course (
            course_id INT NOT NULL,
            user_id INT NOT NULL,
            vote_type BOOL,
            CONSTRAINT fk_course_id
                FOREIGN KEY (course_id)
                REFERENCES Courses(course_id),
            CONSTRAINT fk_user_id
                FOREIGN KEY (user_id)
                REFERENCES Users(user_id)
        );
    `);
        console.log('Created tables');

    }
    catch (error) {
        console.error('Error creating ', error);
    }
};





const createUser = async (full_name, email, password, username) => {
    try {
        const query = `
        INSERT INTO users (full_name, email, username,password)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `;
        const values = [full_name, email, username, password];
        const { rows } = await pool.query(query, values);
        console.log('User created:', rows[0]);
    } catch (error) {
        console.error('Error creating user', error);
    }
};

const getAllUsers = async () => {
    try {
        const query = `
            SELECT * FROM users
        `;
        const { rows } = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error getting all users', error);
        return [];
    }
};



const createSuggestion = async (user_id, course_id) => {
    try {
        const query = `
        INSERT INTO suggestions (user_id, course_id)
        VALUES ($1, $2)
        RETURNING *
        `;
        const values = [user_id, course_id];
        const { rows } = await pool.query(query, values);
        console.log('Suggestion created:', rows[0]);
    } catch (error) {
        console.error('Error creating suggestion', error);
    }
}

const createTag = async (title) => {
    try {
        const query = `
        INSERT INTO tags (title) 
        VALUES ($1)
        RETURNING *
        `;
        const values = [title];
        const { rows } = await pool.query(query, values);
        console.log('Tag created:', rows[0]);
    } catch (error) {
        console.error('Error creating tag', error);
    }
}

const createCourse = async (user_id, title, description) => {
    try {
        const query = `
        INSERT INTO tags (user_id,title,description) 
        VALUES ($1, $2, $3)
        RETURNING *
        `;
        const values = [user_id, title, description];
        const { rows } = await pool.query(query, values);
        console.log('Course created:', rows[0]);
    } catch (error) {
        console.error('Error creating course', error);
    }
}

module.exports = {
    createUser,
    getAllUsers,
    createSuggestion,
    createTag,
    createCourse,
    createTables,
};
