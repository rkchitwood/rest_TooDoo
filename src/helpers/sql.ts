import { BadRequestError } from "../expressError";
import { TsToSqlInterface, DataToUpdateInterface } from "../interfaces/SqlInterface";

/**
 * Helper function for making selective update sql queries.
 * 
 * Return value can be used to create SET clause of an UPDATE statement.
 * 
 *  dataToUpdate: {field1: newVal1, field2: newVal2, ...}
 *  tsToSql: { columnName: "column_name", another_field: "another_field" }
 * 
 * example:
 *      const dataToUpdate = { name: "eat cheese", categoryId: 1, completeDate: null };
 *      const tsToSql = { categoryId: "category_id", completeDate: "complete_date"};
 *      sqlForPartialUpdate(dataToUpdate, tsToSql) => 
 *      { 
 *          sqlSetCols: '"categoryId"=$1, "completeDate"=$2',
 *          values: [2, "current timestamp"] 
 *      }
 */

function sqlForPartialUpdate(dataToUpdate: DataToUpdateInterface, tsToSql: TsToSqlInterface) {
    const keys = Object.keys(dataToUpdate);
    if (keys.length === 0) throw new BadRequestError("no data");
    const columns = keys.map((columnName, idx) =>
        `"${tsToSql[columnName] || columnName}"=$${idx + 1}`,
    );
    return {
        sqlSetCols: columns.join(", "),
        values: Object.values(dataToUpdate)
    };
}

export default sqlForPartialUpdate;