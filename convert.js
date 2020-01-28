const fs = require("fs");
const readline = require('readline');
const path = require('path');
const iconvLite = require('iconv-lite');

/**
 * 获取配置项
 */
function readConfig() {
  const configReq = path.join(__dirname, 'config.json');
  let configs = fs.readFileSync(configReq);
  configs = JSON.parse(configs);
  return configs;
}

/**
 * 转换编码为 utf-8
 * @param {Object} configs 配置项
 */
function decodeFile(configs) {
  const { sourceRequest, sourceEncodeType, title } = configs;
  const filePath = path.join(__dirname, sourceRequest);

  let tempData = fs.readFileSync(filePath);
  tempData = iconvLite.decode(tempData, sourceEncodeType);

  fs.writeFileSync(`${title}temp.txt`, tempData);
}

/**
 * 读取源文件并进行处理
 * @param {Object} configs 配置项
 * @param {Function} callback 文件读取结束回调
 */
function txtParse(configs, callback) {
  const { title, chapterReg } = configs;
  const chapterRegObj = new RegExp(chapterReg);
  const tempFilePath = path.join(__dirname, `${title}temp.txt`);
  const input = fs.createReadStream(tempFilePath);

  const chapterList = [];
  const contentList = [];

  const rl = readline.createInterface({
    input: input
  });

  console.log('=================== 开始文件读取 ==================');

  let chapterContent = [];
  rl.on('line', (line) => {
    if (chapterRegObj.test(line)) {
      chapterList.push(line);
      if (chapterList.length > 1 && chapterContent.length) {
        contentList.push(chapterContent);
      }
      chapterContent = [];
    } else if (!line.trim()) {
      // pass
    } else {
      chapterContent.push(line);
    }
  });

  rl.on('close', () => {
    chapterContent.length && contentList.push(chapterContent);
    console.log('=================== 文件读取结束 ==================');
    callback(configs, chapterList, contentList);
  });
}

/**
 * 转换为 HTML 并输出
 * @param {Object} configs 配置项
 * @param {Array} chapterList 章节列表
 * @param {Array} contentList 内容列表
 */
function txt2html(configs, chapterList, contentList) {
  console.log('=================== 开始生成 HTML 文件 ==================');
  const { title, target } = configs;
  // 获取样式文件
  const styleFilePath = path.join(__dirname, './style.css');
  const style = fs.readFileSync(styleFilePath);
  let html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="zh" xml:lang="zh">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>${title}</title>
    <style type="text/css">
      ${style}
    </style>
  </head>
  <body>
  `;
  for (let i = 0; i < chapterList.length; i++) {
    html += `<h2>${chapterList[i].trim()}</h2>`
    contentList[i].forEach(item => {
      html += `<p>${item}</p>`;
    });
    html += '<div class="pagebreak"></div>';
  }
  html += `
  </body>
</html>
  `;

  const outputFilePath = path.join(__dirname, './kindleBooks', target);
  fs.writeFileSync(outputFilePath, html);
  console.log('=================== HTML 文件生成结束 ==================');
}


/**
 * 清理临时文件
 * @param {Object} configs 配置项
 */
function clearTemp(configs) {
  const file = `${configs.title}temp.txt`;
  // 检查当前目录中是否存在该文件
  fs.access(file, fs.constants.F_OK, (err) => {
    if (!err) { // 存在
      // 删除该文件
      fs.unlinkSync(file);
    }
  });
}

/**
 * 主函数
 */
function run() {
  console.log('=================== 开始转换 ==================');
  if (!fs.existsSync('kindleBooks')) {
    fs.mkdirSync('kindleBooks');
  }
  // 获取配置项
  const configs = readConfig();
  // 输出临时文件，编码为 utf-8
  decodeFile(configs);
  // 转换
  txtParse(configs, txt2html);
  // 清理不必要的临时资源
  clearTemp(configs);
  console.log('=================== 转换结束 ==================');
}

// 开始执行
run();