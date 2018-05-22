/**
 * @fileoverview Implements Pretty Table Extension
 * @author jbpark <pjb0811@gmail.com>
 */
import Editor from './editorProxy';
import $ from 'jquery';

/**
 * prettyTable plugin
 * @param {Editor} editor - editor instance
 * @ignore
 */
function prettyTableExtension(editor) {
  editor.prettyTable = function() {
    this.state = {
      rows: '',
      tables: {
        originals: [],
        prettys: [],
        sizes: {}
      }
    };

    /**
     * set State data
     * @param {object} nextState next state
     */
    this.setState = function(nextState) {
      this.state = $.extend(true, this.state, nextState);
    };

    /**
     * table state init
     */
    this.initTable = function() {
      this.setState({
        rows: editor.getMarkdown(),
        tables: {
          originals: [],
          prettys: [],
          sizes: {}
        }
      });
    };

    /**
     * table data check
     * @param {string} type table type
     */
    this.checkTables = function(type) {
      let table = [];
      const { rows } = this.state;

      rows.split('\n').map(row => {
        if (row.includes('|')) {
          if (type === 'prettys') {
            row = this.getRowWithAddVarOnSide(row);
          }
          table.push(row);
        } else {
          if (table.length && table[1] && table[1].includes('-')) {
            this.setTable({
              table,
              type
            });
          }
          table = [];
        }
      });
    };

    /**
     * set table state
     * @param {object} params parameter
     * @param {string[]} params.table table data
     * @param {string} params.table table type
     */
    this.setTable = function(params) {
      const { table, type } = params;
      const tables = this.state.tables[type].concat();
      const tableStr = table.join('\n');
      tables.push(tableStr);
      this.setState({
        tables: {
          [type]: tables
        }
      });
    };

    /**
     * Get row values with vertical bars on both sides.
     * @param {string} row row data
     * @returns {string} changed row data
     */
    this.getRowWithAddVarOnSide = function(row) {
      const trimRow = row.trim();
      const startChar = trimRow[0];
      const endChar = trimRow[trimRow.length - 1];
      const fromEndSecond = trimRow.substr(trimRow.length - 2, trimRow.length - 1);
      if (startChar !== '|') {
        row = `|${row}`;
      }
      if (endChar !== '|' || fromEndSecond === '\\|') {
        row = `${row}|`;
      }

      return row;
    };

    /**
     * Vertical bar string substitution in data.
     */
    this.replaceVarInData = function() {
      let prettys = this.state.tables.prettys.concat();
      prettys = prettys.map(table => {
        return table
          .split('\n')
          .map(row => {
            if (row.includes('`')) {
              row = this.getEncodeRow({
                row,
                type: 'literal'
              });
            }
            if (row.includes('\\|')) {
              row = this.getEncodeRow({
                row,
                type: 'backslash'
              });
            }

            return row;
          })
          .join('\n');
      });
      this.setState({
        tables: {
          prettys
        }
      });
    };

    /**
     * Change the vertical bar to a specific string.
     * @param {object} params parameter
     * @param {string} params.row row data
     * @param {string} params.type type to replace
     * @returns {string} changed row data
     */
    this.getEncodeRow = function(params) {
      const { row, type } = params;
      if (type === 'literal') {
        return row.replace(/(`.+`)/g, (all, word) => {
          return word.replace(/\|/g, '[$]');
        });
      }

      return row.replace(/\\\|/g, '[#]');
    };

    /**
     * Changed specific string to vertical bar.
     * @param {object} params parameter
     * @param {string} params.row row data
     * @param {string} params.type type to replace
     * @returns {string} changed row data
     */
    this.getDecodeRow = function(params) {
      const { row, type } = params;
      if (type === 'literal') {
        return row.replace(/(`.+`)/g, (all, word) => {
          return word.replace(/\[\$\]/g, '|');
        });
      }

      return row.replace(/\[#\]/g, '\\|');
    };

    /**
     * init table count state
     * @param {number} table table index
     */
    this.initTableSize = function(table) {
      this.setState({
        tables: {
          sizes: {
            [table]: {}
          }
        }
      });
    };

    /**
     * init column count in table state
     * @param {object} params parameter
     * @param {number} params.table table index
     * @param {number} params.column column in table index
     */
    this.initColumnSize = function(params) {
      const { table, column } = params;
      this.setState({
        tables: {
          sizes: {
            [table]: {
              [column]: 0
            }
          }
        }
      });
    };

    /**
     * Set the state value for the maximum width value of the column
     * @param {object} params parameter
     * @param {string} params.row row data
     * @param {number} params.table table index
     * @param {column} params.column column in table index
     */
    this.setColumnSize = function(params) {
      const { row, table, column } = params;
      const { sizes } = this.state.tables;
      this.setState({
        tables: {
          sizes: {
            [table]: {
              [column]: Math.max(sizes[table][column], row.trim().length)
            }
          }
        }
      });
    };

    /**
     * Set state values for column
     */
    this.setColumnInfo = function() {
      let prettys = this.state.tables.prettys.concat();
      const { sizes } = this.state.tables;
      prettys = prettys.map((table, i) => {
        this.initTableSize(i);

        return table
          .split('\n')
          .map((row, j) => {
            if (!row.includes('@cols') && j !== 1) {
              row = row
                .split('|')
                .map((data, k) => {
                  if (data) {
                    let temp;
                    if (!sizes[i][k]) {
                      this.initColumnSize({
                        table: i,
                        column: k
                      });
                    }
                    temp = this.getDecodeRow({
                      row: data,
                      type: 'backslash'
                    });
                    temp = this.getDecodeRow({
                      row: temp,
                      type: 'literal'
                    });

                    this.setColumnSize({
                      row: temp,
                      table: i,
                      column: k
                    });
                  }

                  return data;
                })
                .join('|');
            }

            return row;
          })
          .join('\n');
      });
    };

    /**
     * Get data for changed rows.
     * @param {object} params parameter
     * @param {string} params.data row data
     * @param {number} params.max maximum length of the row
     * @returns {string} changed row data
     */
    this.getChangedData = function(params) {
      let { data, max } = params;
      const type = /(^:?)(-+)(:?$)/.test(data) ? '-' : ' ';

      if (data.length < max) {
        data = this.getAddedData({
          data,
          type,
          max
        });
      } else {
        data = this.getRemovedData({
          data,
          type,
          max
        });
      }

      return data;
    };

    /**
     * Get data with a string added.
     * @param {object} params parameter
     * @param {string} params.data row data
     * @param {string} params.type Characters to add
     * @param {number} params.max maximum length of the row
     * @returns {string} changed row data
     */
    this.getAddedData = function(params) {
      let { data, type, max } = params;
      if (type === '-' && data[data.length - 1] === ':') {
        data = data.substr(0, data.length - 1) + type.repeat(max - data.length) + data.substr(data.length - 1);
      } else {
        data = data + type.repeat(max - data.length);
      }

      return data;
    };

    /**
     * Get data with a string removed.
     * @param {object} params parameter
     * @param {string} params.data row data
     * @param {string} params.type Characters to remove
     * @param {number} params.max maximum length of the row
     * @returns {string} changed row data
     */
    this.getRemovedData = function(params) {
      let { data, type, max } = params;
      if (type === '-' && data[data.length - 1] === ':') {
        data = data.substr(0, max - 1) + ':';
      } else {
        data = data.substr(0, max);
      }

      return data;
    };

    /**
     * Sets the maximum width state value of a row.
     * @param {object} params parameter
     * @param {number} params.table table index
     * @param {string} params.row row data in table
     */
    this.setRowFullSize = function(params) {
      const { table, row } = params;
      const { sizes } = this.state.tables;
      let tempRow = row.substr(1, row.length - 2).trim();
      if (!sizes[table].full) {
        this.setState({
          tables: {
            sizes: {
              [table]: {
                full: 0
              }
            }
          }
        });
      }

      this.setState({
        tables: {
          sizes: {
            [table]: {
              full: Math.max(sizes[table].full, tempRow.length)
            }
          }
        }
      });
    };

    /**
     * Set the state value of the row.
     */
    this.setDataRows = function() {
      let prettys = this.state.tables.prettys.concat();
      const { sizes } = this.state.tables;
      prettys = prettys.map((table, i) => {
        return table
          .split('\n')
          .map(row => {
            if (!row.includes('@cols')) {
              row = row
                .split('|')
                .map((data, k) => {
                  if (data) {
                    const max = sizes[i][k];
                    let tempData = data.trim();
                    tempData = this.getDecodeRow({
                      row: tempData,
                      type: 'backslash'
                    });
                    tempData = this.getDecodeRow({
                      row: tempData,
                      type: 'literal'
                    });

                    tempData = this.getChangedData({
                      data: tempData,
                      max
                    });

                    data = ` ${tempData} `;
                  }

                  return data;
                })
                .join('|');

              this.setRowFullSize({
                table: i,
                row
              });
            }

            return row;
          })
          .join('\n');
      });

      this.setState({
        tables: {
          prettys
        }
      });
    };

    /**
     * Set the status value of the merged header row.
     */
    this.setMergedHeader = function() {
      let prettys = this.state.tables.prettys.concat();
      const { sizes } = this.state.tables;
      prettys = prettys.map((table, i) => {
        return table
          .split('\n')
          .map(row => {
            if (row.includes('@cols')) {
              row = row
                .split('|')
                .map(data => {
                  let tempData = data.trim();
                  if (tempData) {
                    let max = sizes[i].full;
                    tempData = this.getChangedData({
                      data: tempData,
                      max
                    });
                    data = ` ${tempData} `;
                  }

                  return data;
                })
                .join('|');
            }

            return row;
          })
          .join('\n');
      });

      this.setState({
        tables: {
          prettys
        }
      });
    };

    /**
     * Render the editor.
     */
    this.render = function() {
      const { rows, tables } = this.state;
      const { originals, prettys } = tables;
      this.replaceVarInData();
      this.setColumnInfo();
      this.setDataRows();
      this.setMergedHeader();

      originals.map((original, i) => {
        const pretty = prettys[i];
        if (original !== pretty) {
          editor.setMarkdown(rows.replace(original, pretty), false);
        }
      });
    };

    /**
     * Initialize function.
     */
    this.init = function() {
      const { originals } = this.state.tables;
      this.initTable();
      this.checkTables('originals');
      this.checkTables('prettys');

      if (originals.length) {
        this.render();
      }
    };

    this.init();
  };

  editor.on('previewRenderAfter', () => {
    setTimeout(editor.prettyTable.bind(editor.prettyTable), 3000);
  });
}

Editor.defineExtension('prettyTable', prettyTableExtension);
