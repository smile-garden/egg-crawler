const Service = require('egg').Service;
const Excel = require('exceljs');

class exportExcel extends Service {
  /**
   * 数据并生成excel
   * @param {*} headers excel标题栏
   * @param {*} data 数据参数
   * @param {*} name 文件名称
   * @return {buffer} 返回 buffer
   */
  async excelCommon(headers, data, name) {
    const columns = [];// exceljs要求的columns
    const hjRow = {};// 合计行
    const titleRows = headers.length;// 标题栏行数
    // 处理表头
    headers.forEach(row => {
      row.forEach(col => {
        const { f, t, w } = col;
        if (f) {
          if (col.totalRow) hjRow[f] = true;
          if (col.totalRowText) hjRow[f] = col.totalRowText;
          col.style = { alignment: { vertical: 'middle', wrapText: true } };
          col.header = t; // 文字
          col.key = f; // 对应的字段
          col.width = w ? w : 15;// 宽度
          columns.push(col);
        }
      });
    });

    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet('sheet', { views: [{ xSplit: 1, ySplit: 1 }] });
    sheet.columns = columns;
    sheet.addRows(data);

    // 处理复杂表头
    if (titleRows > 1) {
      // 头部插入空行
      for (let i = 1; i < titleRows; i++) sheet.spliceRows(1, 0, []);

      headers.forEach(row => {
        row.forEach(col => {
          if (col.m1) {
            sheet.getCell(col.m1).value = col.t;
            sheet.mergeCells(col.m1 + ':' + col.m2);
          }
        });
      });
    }

    // 处理样式、日期、字典项
    sheet.eachRow(function(row, rowNumber) {
      // 设置行高
      row.height = 30;
      row.eachCell({ includeEmpty: true }, cell => {
        // 设置边框 黑色 细实线
        /* const top = { style: 'thin', color: { argb: '000000' } };
        const left = { style: 'thin', color: { argb: '000000' } };
        const bottom = { style: 'thin', color: { argb: '000000' } };
        const right = { style: 'thin', color: { argb: '000000' } };
        cell.border = { top, left, bottom, right }; */
        // 设置标题部分为粗体
        if (rowNumber <= titleRows) { cell.font = { bold: true }; return; }
      });
    });
    this.ctx.set('Content-Type', 'application/vnd.openxmlformats');
    // 这个地方的空格不要更改
    this.ctx.set('Content-Disposition', "attachment;filename*=UTF-8' '" + encodeURIComponent(name) + '.xlsx');
    return await workbook.xlsx.writeBuffer();
  }
}
module.exports = exportExcel;
