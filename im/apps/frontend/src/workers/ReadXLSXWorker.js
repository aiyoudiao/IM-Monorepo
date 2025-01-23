import * as XLSX from 'xlsx';

self.onmessage = function (e) {
  try {
    // result为文件，headersToRead为表头信息
    const { result, headersToRead } = e?.data || {};
    const workbook = XLSX.read(result, {
      type: 'binary',
      cellDates: true,
      cellNF: false,
      cellText: false,
    });
    let data = [];
    Object.keys(workbook.Sheets).forEach((sheet) => {
      if (workbook.Sheets.hasOwnProperty(sheet)) {
        // 获取表头数据
        const sheetHeaders = Object.keys(workbook.Sheets[sheet]);
        // 遍历表头获取表头的值组成的数组
        const headerNames = sheetHeaders.map((header) => workbook.Sheets[sheet][header].v);
        // 查询是否所有的表头都存在
        const headersFound = headersToRead.every((header) => headerNames.includes(header));
        // 都存在才进行拼接获取表格数据
        if (headersFound) {
          data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { blankrows: true }));
        }
      }
    });
    self.postMessage({ data });
  } catch {
    self.postMessage({ data: [] });
  }
};
