/* Small, editable content model for the design stage of the personal site. */
window.PERSONAL_SITE_CONFIG = {
  identity: { name: "Leo Liu Junyi。" },
  site: {
    zh: {
      htmlLang: "zh-CN", title: "Leo Liu Junyi — 个人主页", skip: "跳到正文",
      city: "HND · 羽田机场", terminal: "T1 · 出发信息导览", greeting: "你好，我是",
      lede: "个人主页设计稿，以羽田机场的出发导视为灵感。",
      meta: ["PERSONAL PROFILE", "个人档案"], flightTitle: "出发信息屏",
      flightIntro: "用航班信息屏展示主页的几个设计模块。内容目前保持简洁，重点放在导视系统与翻页体验。",
      suiteTitle: "航站楼导览", suiteIntro: "个人档案、信息屏与页面组件，沿着同一条导览路线继续浏览。",
      route: "出发  /  导览  /  下一站", footer: "下一站，设计中。",
      footerSmall: "HND · TERMINAL 1", prev: "上一页", next: "下一页"
    },
    en: {
      htmlLang: "en", title: "Leo Liu Junyi — Personal Site", skip: "Skip to main content",
      city: "HND · HANEDA AIRPORT", terminal: "T1 · DEPARTURES", greeting: "Hi, I’m",
      lede: "A personal site design study inspired by Haneda Airport wayfinding.",
      meta: ["PERSONAL PROFILE", "DESIGN STUDY"], flightTitle: "Departures",
      flightIntro: "A compact departure board for the site's design modules. The focus is the wayfinding system and the page transition.",
      suiteTitle: "Terminal guide", suiteIntro: "Profile, information board, and page components along one continuous route.",
      route: "DEPARTURES  /  DIRECTORY  /  NEXT STOP", footer: "Next stop: in design.",
      footerSmall: "HND · TERMINAL 1", prev: "Previous page", next: "Next page"
    },
    ja: {
      htmlLang: "ja", title: "Leo Liu Junyi — 個人サイト", skip: "本文へ移動",
      city: "HND · 羽田空港", terminal: "T1 · 出発案内", greeting: "こんにちは、",
      lede: "羽田空港の案内表示から着想した、個人サイトのデザイン案です。",
      meta: ["PERSONAL PROFILE", "DESIGN STUDY"], flightTitle: "出発案内",
      flightIntro: "サイトのデザイン要素を、簡潔な出発案内板の形で紹介します。案内システムと画面遷移を中心に設計しています。",
      suiteTitle: "ターミナル案内", suiteIntro: "プロフィール、情報表示、ページ部品をひと続きのルートで紹介します。",
      route: "出発  /  ご案内  /  次の目的地", footer: "次の目的地は、デザイン中。",
      footerSmall: "HND · TERMINAL 1", prev: "前のページ", next: "次のページ"
    }
  },
  board: {
    languages: [
      { code: "中文", message: "第 %p 页 · %n" },
      { code: "EN", message: "PAGE %p · %n" },
      { code: "日本語", message: "%p ページ · %n" }
    ],
    pages: [
      {
        name: ["基本信息", "BASIC INFO", "基本情報"],
        rows: [
          { time: "09:10", revised: "", destination: "PROFILE", labels: ["个人档案", "PROFILE", "プロフィール"], airline: "KT", number: "KT 0101", note: "T1 · GATE 01" },
          { time: "09:25", revised: "09:30", destination: "WAYFINDING", labels: ["导视设计", "WAYFINDING", "案内表示"], airline: "AR", number: "AR 0102", note: "T1 · GATE 02" },
          { time: "09:40", revised: "", destination: "INFORMATION", labels: ["信息模块", "INFORMATION", "情報表示"], airline: "KT", number: "KT 0103", note: "T2 · GATE 03" },
          { time: "09:55", revised: "", destination: "NEXT STOP", labels: ["下一站", "NEXT STOP", "次の目的地"], airline: "AR", number: "AR 0104", note: "IN DESIGN" }
        ]
      },
      {
        name: ["设计模块", "DESIGN", "デザイン"],
        rows: [
          { time: "10:10", revised: "", destination: "TYPOGRAPHY", labels: ["文字系统", "TYPOGRAPHY", "文字設計"], airline: "AR", number: "AR 0201", note: "T1 · GATE 04" },
          { time: "10:25", revised: "", destination: "COLOR", labels: ["色彩系统", "COLOR SYSTEM", "カラー"], airline: "KT", number: "KT 0202", note: "T1 · GATE 05" },
          { time: "10:40", revised: "10:45", destination: "MOTION", labels: ["切换动画", "MOTION", "画面遷移"], airline: "AR", number: "AR 0203", note: "T2 · GATE 06" },
          { time: "10:55", revised: "", destination: "LAYOUT", labels: ["页面布局", "LAYOUT", "レイアウト"], airline: "KT", number: "KT 0204", note: "IN DESIGN" }
        ]
      },
      {
        name: ["当前进度", "IN PROGRESS", "進行中"],
        rows: [
          { time: "11:10", revised: "", destination: "DEPARTURES", labels: ["出发信息屏", "DEPARTURES", "出発案内"], airline: "KT", number: "KT 0301", note: "BOARD STUDY" },
          { time: "11:25", revised: "", destination: "NAVIGATION", labels: ["页面导航", "NAVIGATION", "ページ案内"], airline: "AR", number: "AR 0302", note: "T1 · GATE 07" },
          { time: "11:40", revised: "", destination: "PROFILE", labels: ["个人档案", "PROFILE", "プロフィール"], airline: "KT", number: "KT 0303", note: "T2 · GATE 08" },
          { time: "11:55", revised: "", destination: "NEXT ITERATION", labels: ["后续调整", "NEXT ITERATION", "次の調整"], airline: "AR", number: "AR 0304", note: "IN DESIGN" }
        ]
      }
    ]
  },
  templates: [
    {
      type: "profile", id: "template-profile", index: "01",
      nav: { zh: "个人档案", en: "Profile", ja: "プロフィール" },
      copy: {
        zh: { title: "个人档案", intro: "保持简洁，先确定导览与版式。", statement: "Leo Liu Junyi · 个人主页设计中", status: "DESIGN STUDY", facts: [{ label: "主题", value: "羽田机场导视" }, { label: "阶段", value: "视觉与交互打磨" }, { label: "下一步", value: "逐步补充内容" }] },
        en: { title: "Profile", intro: "Keep the content light while the wayfinding and layout take shape.", statement: "Leo Liu Junyi · Personal site in design", status: "DESIGN STUDY", facts: [{ label: "THEME", value: "Haneda wayfinding" }, { label: "STAGE", value: "Visual and interaction refinement" }, { label: "NEXT", value: "Content to follow" }] },
        ja: { title: "プロフィール", intro: "案内表示とレイアウトを整えながら、内容は簡潔に保ちます。", statement: "Leo Liu Junyi · 個人サイトをデザイン中", status: "DESIGN STUDY", facts: [{ label: "テーマ", value: "羽田空港の案内表示" }, { label: "段階", value: "視覚表現と操作性を調整中" }, { label: "次", value: "内容を順次追加" }] }
      }
    },
    {
      type: "projects", id: "template-projects", index: "02",
      nav: { zh: "信息屏", en: "Board", ja: "情報表示" },
      copy: {
        zh: { title: "信息屏", intro: "以羽田出发显示屏为参考的个人信息组件。", boardTitle: "页面模块", items: [{ code: "P01", title: "个人档案", text: "姓名与简短介绍。", status: "IN DESIGN" }, { code: "P02", title: "出发信息", text: "翻页、滚字与状态栏。", status: "IN DESIGN" }, { code: "P03", title: "站内导航", text: "通往主页各个区域。", status: "IN DESIGN" }] },
        en: { title: "Information board", intro: "A personal information component inspired by Haneda's departures display.", boardTitle: "Page modules", items: [{ code: "P01", title: "Profile", text: "Name and a short introduction.", status: "IN DESIGN" }, { code: "P02", title: "Departures", text: "Pages, rolling text, and status bar.", status: "IN DESIGN" }, { code: "P03", title: "Directory", text: "Routes through the page.", status: "IN DESIGN" }] },
        ja: { title: "情報表示", intro: "羽田空港の出発案内を参考にした個人情報コンポーネント。", boardTitle: "ページモジュール", items: [{ code: "P01", title: "プロフィール", text: "名前と短い紹介。", status: "IN DESIGN" }, { code: "P02", title: "出発案内", text: "ページ送り、文字送り、ステータス表示。", status: "IN DESIGN" }, { code: "P03", title: "ページ案内", text: "ページ内の各セクションへのルート。", status: "IN DESIGN" }] }
      }
    },
    {
      type: "timeline", id: "template-timeline", index: "03",
      nav: { zh: "导览路线", en: "Route", ja: "ルート" },
      copy: {
        zh: { title: "导览路线", intro: "从到达入口，一路经过信息屏与个人页面。", items: [{ title: "到达", text: "欢迎来到个人主页。" }, { title: "转乘", text: "前往出发信息屏。" }, { title: "登机口", text: "查看正在设计的模块。" }, { title: "下一站", text: "更多内容后续开放。" }] },
        en: { title: "Wayfinding route", intro: "From the entrance, through the board and into the personal site.", items: [{ title: "Arrival", text: "Welcome to the personal site." }, { title: "Transfer", text: "Continue to the departures display." }, { title: "Gate", text: "Explore the modules in design." }, { title: "Next stop", text: "More content will follow." }] },
        ja: { title: "案内ルート", intro: "入口から情報表示を通り、個人サイトへ進みます。", items: [{ title: "到着", text: "個人サイトへようこそ。" }, { title: "乗り換え", text: "出発案内へ進みます。" }, { title: "搭乗口", text: "デザイン中のモジュールを確認。" }, { title: "次の目的地", text: "内容は順次追加します。" }] }
      }
    }
  ]
};
