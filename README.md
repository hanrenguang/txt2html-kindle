# txt2html
为制作 `kindle` 电子书，将原始 `txt` 格式的文件转换为 `kindlegen` 能转换的 `HTML` 的文件。本项目仅供学习使用，欢迎各位电子书爱好者一起交流，欢迎各位大佬提出建议或直接甩我 `PR`。

## TODO
- [ ] 添加封面图片

## 准备
1. `node` 环境；
2. 亚马逊的 `kindlegen` 工具，安装好后加入环境变量 `PATH` 方便后续转换。

## 使用
1. `clone` 本项目到本地，进入项目目录，执行以下命令：
```bash
npm install
```
2. 查看并修改项目根目录的 `config.json` 文件：
```Json
# 书名
"title": "书名"
# 源文件相对路径
"sourceRequest": "./书名.txt"
# 封面图片相对路径
"coverRequest": "./cover.png"
# 源文件编码
"sourceEncodeType": "gbk"
# 章节标题正则，用于匹配章节标题
"chapterReg": "^第.+章"
# 目标相对路径，用于输出生成的 HTML 文件
"target": "./kindleBook/书名.html"
```
3. 执行脚本进行转换：
```bash
node convert.js
```
4. 转换结束后，进入输出 `HTML` 文件目录，在命令行执行：
```bash
kindlegen 书名.html
```
5. 等待 `kindlegen` 处理结束，会在当前目录生成 `kindle` 支持的 `.mobi` 后缀文件，导入你的 `kindle` 即可。

## License
MIT