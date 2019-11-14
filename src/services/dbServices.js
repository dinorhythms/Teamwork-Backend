import { query } from '../db';

const getById = async (table, id) => {
  try {
    const getQuery = `SELECT * FROM ${table} WHERE id = ${id}`;
    const { rows, rowCount } = await query(getQuery);
    if (rowCount > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    return error;
  }
};

const getAllByOption = async (table, option) => {
  try {
    const getOptionQuery = `SELECT * FROM ${table} WHERE ${option}`;
    const { rows, rowCount } = await query(getOptionQuery);
    if (rowCount > 0) {
      return rows;
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
};

const getSelectedByOption = async (table, columns) => {
  try {
    const getOptionQuery = `SELECT ${columns} FROM ${table}`;
    const { rows, rowCount } = await query(getOptionQuery);
    if (rowCount > 0) {
      return rows;
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
};

const insertRecord = async (table, columns, values) => {
  try {
    const insertQuery = `INSERT INTO ${table} ( ${columns} ) VALUES (${values}) RETURNING *`;
    const { rows } = await query(insertQuery);
    return rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

const updateRecord = async (table, valueOption, whereOptions) => {
  try {
    const updateQuery = `UPDATE ${table} SET ${valueOption} WHERE ${whereOptions} RETURNING *`;
    const { rows } = await query(updateQuery);
    return rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

const deleteRecord = async (table, id) => {
  try {
    const deleteQuery = `DELETE FROM ${table} WHERE id = ${id} RETURNING *`;
    const { rows } = await query(deleteQuery);
    return rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

export {
  getById, getAllByOption, getSelectedByOption,
  updateRecord, insertRecord, deleteRecord
};
