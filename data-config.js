// 数据配置文件 - 工具和笔记配置
const dataConfig = {
  tools: [
    {
      id: "1",
      title: "OCR英文识别工具",
      icon: "fas fa-file-alt",
      description: "使用OCR技术识别英文文本，支持图片上传和文本提取",
      file: "ORCEnglishTool.html",
      category: "text",
      date: "2025-10-22"
    }
  ],
  notes: [
    {
      id: "1",
      title: "计划表",
      icon: "fas fa-calendar-alt",
      description: "个人学习计划和时间安排",
      file: "notes/计划表.md",
      date: "2025-09-25"
    },
    {
      id: "2",
      title: "研一_2025.9.19",
      icon: "fas fa-graduation-cap",
      description: "研究生一年级学习笔记",
      file: "notes/研一_2025.9.19.md",
      date: "2025-09-19"
    },
    {
      id: "3",
      title: "研一_2025.9.21",
      icon: "fas fa-graduation-cap",
      description: "研究生一年级学习笔记",
      file: "notes/研一_2025.9.21.md",
      date: "2025-09-21"
    },
    {
      id: "4",
      title: "研一_2025.9.23",
      icon: "fas fa-graduation-cap",
      description: "研究生一年级学习笔记",
      file: "notes/研一_2025.9.23.md",
      date: "2025-09-23"
    },
    {
      id: "5",
      title: "MarkdownLateX数学公式和符号表",
      icon: "fas fa-square-root-alt",
      description: "Markdown和LaTeX数学公式语法参考",
      file: "notes/MarkdownLateX数学公式和符号表.md",
      date: "2025-09-23"
    },
    {
      id: "6",
      title: "研一_2025.9.25",
      icon: "fas fa-graduation-cap",
      description: "研究生一年级学习笔记",
      file: "notes/研一_2025.9.25.md",
      date: "2025-09-25"
    },
    {
      id: "7",
      title: "专业名称缩写",
      icon: "fas fa-book",
      description: "专业术语和缩写对照表",
      file: "notes/专业名称缩写.md",
      date: "2025-09-25"
    },
    {
      id: "8",
      title: "研一_2025.9.27",
      icon: "fas fa-graduation-cap",
      description: "研究生一年级学习笔记",
      file: "notes/研一_2025.9.27.md",
      date: "2025-09-27"
    },
    {
      id: "9",
      title: "Informer代码学习层次",
      icon: "fas fa-code",
      description: "Informer模型代码学习笔记",
      file: "notes/Informer代码学习.md",
      date: "2025-09-29"
    },
    {
      id: "10",
      title: "python函数汇总",
      icon: "fab fa-python",
      description: "Python常用函数和语法总结",
      file: "notes/python函数汇总.md",
      date: "2025-10-10"
    },
    {
      id: "11",
      title: "vscode_python快捷输入",
      icon: "fas fa-keyboard",
      description: "VSCode快速输入Python代码片段方法",
      file: "notes/vscode快速输入python main函数和各种代码片段方法.md",
      date: "2025-10-10"
    },
    {
      id: "12",
      title: "研一_2025.10.18",
      icon: "fas fa-graduation-cap",
      description: "研究生一年级学习笔记",
      file: "notes/研一_2025.10.18.md",
      date: "2025-10-18"
    }
  ],
  categories: {
    text: "文本处理",
    code: "代码工具",
    image: "图片处理",
    other: "其他工具"
  },
  version: "1.0.0",
  lastUpdated: "2025-10-22"
};

// 导出配置对象
if (typeof module !== 'undefined' && module.exports) {
  // Node.js 环境
  module.exports = dataConfig;
} else {
  // 浏览器环境
  window.dataConfig = dataConfig;
}
