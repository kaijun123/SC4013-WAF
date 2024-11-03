
import Sequelize, { DataTypes, ModelAttributeColumnOptions } from "sequelize";

export const genericString = (required = false, unique = false, length?: number): ModelAttributeColumnOptions => ({
  type: Sequelize.STRING,
  allowNull: !required,
  unique: unique,
  validate: {
    ...length && {
      len: [0, length],
    },

    ...required && {
      notEmpty: required
    },
  },
});
export const number = (required = false, defaultValue?: number): ModelAttributeColumnOptions => ({
  type: Sequelize.INTEGER,
  allowNull: !required,
  defaultValue,
});
export const timestamp = (required = false, defaultValue?: Sequelize.AbstractDataTypeConstructor): ModelAttributeColumnOptions => ({
  type: Sequelize.DATE,
  allowNull: !required,
  defaultValue,
});
export const date = (required = false): ModelAttributeColumnOptions => ({
  type: Sequelize.DATEONLY,
  allowNull: !required,
});
export const boolean = (required = false, defaultValue?: boolean): ModelAttributeColumnOptions => ({
  type: Sequelize.BOOLEAN,
  allowNull: !required,
  defaultValue,
});
export const ipAddress = (required = false): ModelAttributeColumnOptions => ({
  type: Sequelize.STRING,
  allowNull: !required,
  validate: { isIP: true, notEmpty: required },
});
export const foreignKey = (refTable: string, refCol: string = "id", required = false, type: Sequelize.DataType = Sequelize.STRING, onDelete: string | undefined = undefined): ModelAttributeColumnOptions => ({
  type,
  allowNull: !required,
  onDelete,
  references: { model: refTable, key: refCol },
});
export const primaryKey = (): ModelAttributeColumnOptions => ({
  type: Sequelize.STRING,
  primaryKey: true,
  allowNull: false,
});
export const text = (required = false): ModelAttributeColumnOptions => ({
  type: Sequelize.TEXT,
  allowNull: !required,
});
export const decimal = (m = 36, d = 0, required = false): ModelAttributeColumnOptions => ({
  type: Sequelize.DECIMAL(m, d),
  allowNull: !required,
});
export const enumType = (values: string[] = [], required = false): ModelAttributeColumnOptions => ({
  type: Sequelize.DataTypes.ENUM(...values),
  allowNull: !required,
});
export const jsonType = (required = false): ModelAttributeColumnOptions => ({
  type: Sequelize.DataTypes.JSONB,
  allowNull: !required,
});

export const standardColumns = {
  // id: primaryKey(),
  createdAt: timestamp(true, DataTypes.NOW),
  updatedAt: timestamp(),
  // deletedAt: timestamp(),
};
