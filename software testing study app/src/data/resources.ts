export type Resource = {
  id: string;
  cat: string;
  title: string;
  url: string;
  desc: string;
  level: "مبتدئ" | "متوسط" | "متقدم";
  lang: "ar" | "en";
  ch?: number[];
  top?: boolean;
};

export const RES_CATS = [
  "رسمي",
  "تعلّم",
  "فيديو",
  "أتمتة",
  "API وقواعد بيانات",
  "أداء وأمان",
  "تدريب عملي",
  "أساسيات تقنية",
  "مجتمع ووظائف",
] as const;

const yt = (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

export const RESOURCES: Resource[] = [
  // رسمي
  { id: "istqb-ctfl", cat: "رسمي", title: "ISTQB — CTFL v4.0 (المنهج والعينات A–D)", url: "https://www.istqb.org/certifications/certified-tester-foundation-level", desc: "الصفحة الرسمية للشهادة: المنهج v4.0.1 ونماذج الامتحان الرسمية A وB وC وD بالإجابات. ابدأ بتحميل المنهج وقراءته.", level: "مبتدئ", lang: "en", ch: [1, 2, 3, 4, 5, 6], top: true },
  { id: "istqb-glossary", cat: "رسمي", title: "ISTQB Glossary", url: "https://glossary.istqb.org", desc: "القاموس الرسمي لكل مصطلحات الامتحان.", level: "مبتدئ", lang: "en", top: true },
  { id: "istqb-home", cat: "رسمي", title: "ISTQB.org — الموقع الرئيسي", url: "https://www.istqb.org", desc: "دليل الهيئات الوطنية ومزودي الامتحان وبقية الشهادات.", level: "مبتدئ", lang: "en" },
  { id: "astqb", cat: "رسمي", title: "ASTQB", url: "https://astqb.org", desc: "الهيئة الأمريكية: توفر موارد وعينات أسئلة إضافية متوافقة مع v4.0.", level: "مبتدئ", lang: "en" },
  { id: "estb-egypt", cat: "رسمي", title: "ESTB — الهيئة المصرية لاختبار البرمجيات", url: "https://estb.org.eg", desc: "البوابة الرسمية للهيئة المصرية: تقويم الامتحانات والرسوم (CTFL v4.0: 1800 ج.م للمصريين / 3000 ج.م لغير المصريين، وتخفيضات التدريب المعتمد).", level: "مبتدئ", lang: "ar", top: true },
  { id: "secc-egypt", cat: "رسمي", title: "SECC — مركز تقييم واعتماد هندسة البرمجيات", url: "https://secc.org.eg", desc: "الجهة الوحيدة المعتمدة من ESTB لإدارة امتحانات ISTQB وإصدار شهاداتها في مصر.", level: "مبتدئ", lang: "ar" },
  { id: "ukstqb", cat: "رسمي", title: "شرح عينات ISTQB الرسمية (فيديو)", url: yt("ISTQB sample exam CTFL v4.0 explained"), desc: "شروحات فيديو لحل نماذج Sample Exams A, B, C, D الرسمية.", level: "متوسط", lang: "en", ch: [1, 2, 3, 4, 5, 6] },

  // تعلّم
  { id: "maharatech-istqb", cat: "تعلّم", title: "مهارة-تك (ITI): كورس ISTQB v4.0", url: "https://maharatech.gov.eg", desc: "منصة معهد تكنولوجيا المعلومات المجانية — ابحث فيها عن كورس «ISTQB Foundation Level V4.0 – From Basics to Certification» ومسار Software Tester.", level: "مبتدئ", lang: "ar", ch: [1, 2, 3, 4, 5, 6], top: true },
  { id: "testing-arabic", cat: "تعلّم", title: "Testing بالعربي — دورة CTFL v4.0", url: "https://testing-arabic.com", desc: "منصة عربية مجانية بدون تسجيل: دورة ISTQB CTFL v4.0 (7 دروس، 5 ساعات) مع شهادة PDF، ودورات Jira وScrum وPostman.", level: "مبتدئ", lang: "ar", ch: [1, 2, 3, 4, 5, 6], top: true },
  { id: "utest-academy", cat: "تعلّم", title: "uTest Academy", url: "https://www.utest.com/academy", desc: "منهج تفاعلي مجاني في اصطياد الـ defects وكتابة التقارير واستخدام أدوات التصوير والسجلات.", level: "مبتدئ", lang: "en", top: true },
  { id: "guru99", cat: "تعلّم", title: "Guru99 — Software Testing", url: "https://www.guru99.com/software-testing.html", desc: "دروس مبسطة من الصفر مع أمثلة.", level: "مبتدئ", lang: "en", ch: [1, 2, 4], top: true },
  { id: "sth", cat: "تعلّم", title: "Software Testing Help", url: "https://www.softwaretestinghelp.com", desc: "شروحات كاملة وأسئلة مقابلات وأدوات.", level: "مبتدئ", lang: "en", ch: [1, 2, 4, 5] },
  { id: "stm", cat: "تعلّم", title: "Software Testing Material", url: "https://www.softwaretestingmaterial.com", desc: "ملخصات وأسئلة ISTQB ومقابلات.", level: "مبتدئ", lang: "en", ch: [1, 2, 4, 5] },
  { id: "tp", cat: "تعلّم", title: "Tutorialspoint — Software Testing", url: "https://www.tutorialspoint.com/software_testing/index.htm", desc: "مرجع سريع مرتب.", level: "مبتدئ", lang: "en", ch: [1, 2] },
  { id: "bs-guide", cat: "تعلّم", title: "BrowserStack Guide", url: "https://www.browserstack.com/guide", desc: "أدلة عملية في الاختبار والأتمتة وTest types.", level: "متوسط", lang: "en", ch: [2, 6] },
  { id: "lt-hub", cat: "تعلّم", title: "LambdaTest Learning Hub", url: "https://www.lambdatest.com/learning-hub", desc: "دروس مجانية في الاختبار والأتمتة.", level: "متوسط", lang: "en", ch: [2, 6] },
  { id: "testrail-blog", cat: "تعلّم", title: "TestRail Blog", url: "https://www.testrail.com/blog/", desc: "مقالات في إدارة الاختبار والـ QA.", level: "متوسط", lang: "en", ch: [5] },
  { id: "fowler-test", cat: "تعلّم", title: "Martin Fowler — Testing", url: "https://martinfowler.com/testing/", desc: "مفاهيم هندسية عميقة مثل Test Pyramid.", level: "متقدم", lang: "en", ch: [2, 5, 6] },
  { id: "fowler-pyramid", cat: "تعلّم", title: "The Practical Test Pyramid", url: "https://martinfowler.com/articles/practical-test-pyramid.html", desc: "أفضل شرح لـ Test pyramid عملياً.", level: "متوسط", lang: "en", ch: [5, 6] },
  { id: "google-blog", cat: "تعلّم", title: "Google Testing Blog", url: "https://testing.googleblog.com", desc: "كيف تختبر الشركات الكبرى.", level: "متقدم", lang: "en" },
  { id: "bbst", cat: "تعلّم", title: "BBST® Open Course Materials (Cem Kaner)", url: "https://bbst.courses", desc: "شرائح وفيديوهات BBST المفتوحة بترخيص Creative Commons للتعلّم الذاتي العميق.", level: "متقدم", lang: "en", ch: [4] },
  { id: "satisfice", cat: "تعلّم", title: "Satisfice (James Bach) — RST", url: "https://www.satisfice.com", desc: "Rapid Software Testing وHeuristic Test Strategy Model لـ Exploratory testing.", level: "متقدم", lang: "en", ch: [4] },
  { id: "eviltester", cat: "تعلّم", title: "EvilTester (Alan Richardson)", url: "https://www.eviltester.com", desc: "مقالات ودورات مجانية وكتب وأدوات في الاختبار اليدوي والأتمتة.", level: "متوسط", lang: "en" },
  { id: "roadmap-qa", cat: "تعلّم", title: "roadmap.sh — QA Roadmap", url: "https://roadmap.sh/qa", desc: "خريطة طريق بصرية كاملة لمهندس الجودة.", level: "مبتدئ", lang: "en", top: true },
  { id: "devto-testing", cat: "تعلّم", title: "DEV — وسم Testing", url: "https://dev.to/t/testing", desc: "مقالات عملية من مطورين ومختبرين.", level: "متوسط", lang: "en" },

  // فيديو
  { id: "yt-ar", cat: "فيديو", title: "YouTube: شرح ISTQB بالعربي", url: yt("ISTQB Foundation Level بالعربي شرح كامل"), desc: "شروحات عربية للمنهج.", level: "مبتدئ", lang: "ar", top: true },
  { id: "yt-ar-qa", cat: "فيديو", title: "YouTube: كورس Software Testing بالعربي", url: yt("كورس software testing بالعربي من الصفر"), desc: "كورسات عربية كاملة من الصفر.", level: "مبتدئ", lang: "ar" },
  { id: "yt-v4", cat: "فيديو", title: "YouTube: ISTQB CTFL v4.0 Full Course", url: yt("ISTQB CTFL v4.0 full course"), desc: "كورسات إنجليزية للمنهج الجديد.", level: "مبتدئ", lang: "en", ch: [1, 2, 3, 4, 5, 6] },
  { id: "yt-fcc", cat: "فيديو", title: "freeCodeCamp — Software Testing", url: yt("freecodecamp software testing course"), desc: "كورسات طويلة بالفيديو.", level: "مبتدئ", lang: "en" },
  { id: "yt-bva", cat: "فيديو", title: "YouTube: BVA and Equivalence Partitioning", url: yt("equivalence partitioning boundary value analysis ISTQB examples"), desc: "حلول أمثلة تقنيات التصميم خطوة بخطوة.", level: "متوسط", lang: "en", ch: [4] },
  { id: "yt-dt", cat: "فيديو", title: "YouTube: Decision Table & State Transition", url: yt("decision table state transition testing ISTQB example"), desc: "تدريب على أسئلة K3.", level: "متوسط", lang: "en", ch: [4] },

  // أتمتة
  { id: "tau", cat: "أتمتة", title: "Test Automation University", url: "https://testautomationuniversity.applitools.com", desc: "كورسات أتمتة مجانية بالكامل بمشاركة خبراء.", level: "مبتدئ", lang: "en", ch: [6], top: true },
  { id: "playwright", cat: "أتمتة", title: "Playwright", url: "https://playwright.dev", desc: "أتمتة الويب الحديثة، سريعة ومستقرة. موصى بها للبداية.", level: "متوسط", lang: "en", ch: [6], top: true },
  { id: "selenium", cat: "أتمتة", title: "Selenium", url: "https://www.selenium.dev/documentation/", desc: "الأشهر في إعلانات الوظائف.", level: "متوسط", lang: "en", ch: [6] },
  { id: "cypress", cat: "أتمتة", title: "Cypress", url: "https://docs.cypress.io", desc: "اختبار الويب لمطوري JavaScript.", level: "متوسط", lang: "en", ch: [6] },
  { id: "appium", cat: "أتمتة", title: "Appium", url: "https://appium.io", desc: "أتمتة تطبيقات الجوال.", level: "متقدم", lang: "en", ch: [6] },
  { id: "cucumber", cat: "أتمتة", title: "Cucumber / Gherkin", url: "https://cucumber.io/docs/", desc: "BDD وصيغة Given-When-Then (مرتبط بالفصل 4).", level: "متوسط", lang: "en", ch: [4, 6] },
  { id: "gh-actions", cat: "أتمتة", title: "GitHub Actions", url: "https://docs.github.com/actions", desc: "شغّل اختباراتك تلقائياً مع كل push (CI).", level: "متوسط", lang: "en", ch: [6] },
  { id: "katalon", cat: "أتمتة", title: "Katalon Academy", url: "https://academy.katalon.com", desc: "دروس مجانية في الأتمتة بأدوات low-code.", level: "مبتدئ", lang: "en", ch: [6] },
  { id: "selectorshub", cat: "أتمتة", title: "SelectorsHub", url: "https://selectorshub.com", desc: "إضافة متصفح لاستخراج واختبار محددات Playwright وXPath وCSS (بما فيها Shadow DOM وiframes).", level: "متوسط", lang: "en", ch: [6] },

  // API وقواعد بيانات
  { id: "postman", cat: "API وقواعد بيانات", title: "Postman Learning Center", url: "https://learning.postman.com", desc: "اختبار الـ API: Collections، Tests، Environments.", level: "مبتدئ", lang: "en", top: true },
  { id: "api-challenges", cat: "API وقواعد بيانات", title: "API Challenges (EvilTester)", url: "https://apichallenges.eviltester.com", desc: "تحديات تفاعلية لتعلّم اختبار REST API خطوة بخطوة.", level: "متوسط", lang: "en" },
  { id: "jsonph", cat: "API وقواعد بيانات", title: "JSONPlaceholder", url: "https://jsonplaceholder.typicode.com", desc: "API وهمي مجاني للتجربة.", level: "مبتدئ", lang: "en" },
  { id: "reqres", cat: "API وقواعد بيانات", title: "ReqRes", url: "https://reqres.in", desc: "API جاهز للتجربة (ديمو عام بدون مفتاح + حساب مجاني لـ 250 طلباً يومياً).", level: "مبتدئ", lang: "en" },
  { id: "booker", cat: "API وقواعد بيانات", title: "Restful-booker", url: "https://restful-booker.herokuapp.com", desc: "API للحجوزات فيه defects مقصودة للتدريب.", level: "متوسط", lang: "en" },
  { id: "petstore", cat: "API وقواعد بيانات", title: "Swagger Petstore", url: "https://petstore.swagger.io", desc: "تعلّم قراءة OpenAPI وتجربة endpoints.", level: "مبتدئ", lang: "en" },
  { id: "sqlbolt", cat: "API وقواعد بيانات", title: "SQLBolt", url: "https://sqlbolt.com", desc: "دروس SQL تفاعلية قصيرة. المختبر يحتاجها يومياً.", level: "مبتدئ", lang: "en", top: true },
  { id: "mdn-http", cat: "API وقواعد بيانات", title: "MDN — HTTP", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP", desc: "افهم الطلبات والاستجابات وأكواد الحالة والـ headers.", level: "مبتدئ", lang: "en" },

  // أداء وأمان
  { id: "jmeter", cat: "أداء وأمان", title: "Apache JMeter", url: "https://jmeter.apache.org", desc: "Performance testing وLoad testing.", level: "متوسط", lang: "en", ch: [2] },
  { id: "k6", cat: "أداء وأمان", title: "Grafana k6", url: "https://grafana.com/docs/k6/latest/", desc: "اختبار أداء حديث مكتوب بـ JavaScript.", level: "متقدم", lang: "en", ch: [2] },
  { id: "lighthouse", cat: "أداء وأمان", title: "Lighthouse", url: "https://developer.chrome.com/docs/lighthouse/overview", desc: "قياس الأداء وإمكانية الوصول وSEO.", level: "مبتدئ", lang: "en", ch: [2] },
  { id: "owasp-wstg", cat: "أداء وأمان", title: "OWASP Web Security Testing Guide", url: "https://owasp.org/www-project-web-security-testing-guide/", desc: "المرجع الأشهر لاختبار أمان الويب.", level: "متقدم", lang: "en", ch: [2] },
  { id: "juice", cat: "أداء وأمان", title: "OWASP Juice Shop", url: "https://owasp.org/www-project-juice-shop/", desc: "متجر ضعيف متعمداً للتدرب على الأمان.", level: "متقدم", lang: "en" },
  { id: "wave", cat: "أداء وأمان", title: "WAVE — Web Accessibility Evaluation", url: "https://wave.webaim.org", desc: "فحص إمكانية الوصول (Accessibility).", level: "مبتدئ", lang: "en", ch: [2] },
  { id: "devtools", cat: "أداء وأمان", title: "Chrome DevTools", url: "https://developer.chrome.com/docs/devtools", desc: "الأداة الأولى للمختبر: Network وConsole وElements.", level: "مبتدئ", lang: "en", top: true },

  // تدريب عملي
  { id: "sqadojo", cat: "تدريب عملي", title: "SQA Dojo — محاكاة وأسئلة CTFL v4.0", url: "https://sqadojo.com", desc: "امتحان محاكاة بـ 40 سؤالاً موزوناً وموقّتاً + تدريبات K1/K2/K3 وقاموس 580+ مصطلح مجاناً.", level: "مبتدئ", lang: "en", ch: [1, 2, 3, 4, 5, 6], top: true },
  { id: "istqb-expand", cat: "تدريب عملي", title: "ISTQB ExpandTesting — اختبارات مجانية", url: "https://istqb.expandtesting.com", desc: "بنك اختبارات مجاني لـ Foundation وAgile بدون تسجيل.", level: "مبتدئ", lang: "en", ch: [1, 2, 3, 4, 5, 6] },
  { id: "academybugs", cat: "تدريب عملي", title: "AcademyBugs", url: "https://academybugs.com/find-bugs/", desc: "موقع فيه 25 defects مزروعة: ابحث عنها ووثّقها بتقرير defect مكتمل.", level: "مبتدئ", lang: "en", top: true },
  { id: "saucedemo", cat: "تدريب عملي", title: "Sauce Demo", url: "https://www.saucedemo.com", desc: "موقع تجارة تجريبي بمستخدمين مختلفين (منهم مستخدم به مشاكل).", level: "مبتدئ", lang: "en", top: true },
  { id: "the-internet", cat: "تدريب عملي", title: "The Internet (Herokuapp)", url: "https://the-internet.herokuapp.com", desc: "حالات جاهزة: alerts وiframes وuploads.", level: "مبتدئ", lang: "en" },
  { id: "pst", cat: "تدريب عملي", title: "Practice Software Testing", url: "https://practicesoftwaretesting.com", desc: "متجر كامل لتدريب الاختبار والأتمتة وAPI.", level: "متوسط", lang: "en", top: true },
  { id: "qa-practice", cat: "تدريب عملي", title: "QA Practice", url: "https://qa-practice.netlify.app/", desc: "نماذج وصفحات للتدرب على الاختبار اليدوي والأتمتة.", level: "مبتدئ", lang: "en" },
  { id: "expand-practice", cat: "تدريب عملي", title: "Practice ExpandTesting", url: "https://practice.expandtesting.com", desc: "موقع تدريب غني على واجهة المستخدم وREST API.", level: "مبتدئ", lang: "en" },
  { id: "testpages", cat: "تدريب عملي", title: "TestPages (EvilTester)", url: "https://testpages.eviltester.com", desc: "صفحات تجريبية متنوعة لتجربة سيناريوهات الاختبار والأتمتة.", level: "متوسط", lang: "en" },
  { id: "autoex", cat: "تدريب عملي", title: "Automation Exercise", url: "https://automationexercise.com", desc: "موقع تجارة إلكترونية للتدريب.", level: "مبتدئ", lang: "en" },
  { id: "demoqa", cat: "تدريب عملي", title: "DEMOQA", url: "https://demoqa.com", desc: "عناصر واجهة متنوعة للتدرب على المحددات (Locators).", level: "مبتدئ", lang: "en" },
  { id: "uitp", cat: "تدريب عملي", title: "UI Testing Playground", url: "https://uitestingplayground.com", desc: "حالات صعبة في الأتمتة: عناصر ديناميكية وتأخير.", level: "متوسط", lang: "en" },
  { id: "pta", cat: "تدريب عملي", title: "Practice Test Automation", url: "https://practicetestautomation.com", desc: "صفحات تدريب وشروحات بسيطة.", level: "مبتدئ", lang: "en" },
  { id: "bugmagnet", cat: "تدريب عملي", title: "Bug Magnet (إضافة متصفح)", url: "https://bugmagnet.org", desc: "إضافة مفتوحة المصدر لـ Chrome/Firefox تحقن قيم حدودية وحالات خاصة في الحقول بالزر الأيمن.", level: "مبتدئ", lang: "en", ch: [4] },

  // أساسيات تقنية
  { id: "git-branching", cat: "أساسيات تقنية", title: "Learn Git Branching", url: "https://learngitbranching.js.org", desc: "تعلم Git بصرياً وتفاعلياً.", level: "مبتدئ", lang: "en" },
  { id: "javascript-info", cat: "أساسيات تقنية", title: "javascript.info", url: "https://javascript.info", desc: "أفضل مرجع مجاني لتعلم JavaScript (لأتمتة Playwright/Cypress).", level: "متوسط", lang: "en" },
  { id: "python-tut", cat: "أساسيات تقنية", title: "Python Tutorial (الرسمي)", url: "https://docs.python.org/3/tutorial/", desc: "للأتمتة بـ Python/Selenium/pytest.", level: "متوسط", lang: "en" },

  // مجتمع ووظائف
  { id: "mot", cat: "مجتمع ووظائف", title: "Ministry of Testing", url: "https://www.ministryoftesting.com", desc: "أكبر مجتمع للمختبرين: مقالات ومحاضرات ونقاش.", level: "مبتدئ", lang: "en", top: true },
  { id: "testtribe", cat: "مجتمع ووظائف", title: "The Test Tribe", url: "https://thetesttribe.com", desc: "مجتمع كبير للمختبرين: فعاليات مجانية ومجتمع Discord.", level: "مبتدئ", lang: "en" },
  { id: "stw", cat: "مجتمع ووظائف", title: "Software Testing Weekly", url: "https://softwaretestingweekly.com", desc: "نشرة أسبوعية مجانية بخلاصة مقالات وأدوات المجال.", level: "مبتدئ", lang: "en" },
  { id: "reddit", cat: "مجتمع ووظائف", title: "r/softwaretesting", url: "https://www.reddit.com/r/softwaretesting/", desc: "نقاشات ونصائح وظيفية.", level: "مبتدئ", lang: "en" },
  { id: "linkedin-jobs", cat: "مجتمع ووظائف", title: "وظائف QA على LinkedIn", url: "https://www.linkedin.com/jobs/search/?keywords=QA%20engineer", desc: "اقرأ متطلبات الوظائف الحقيقية وابنِ خطتك عليها.", level: "مبتدئ", lang: "en" },
  { id: "linkedin-ar", cat: "مجتمع ووظائف", title: "وظائف Software Tester (المنطقة العربية)", url: "https://www.linkedin.com/jobs/search/?keywords=software%20tester&location=Middle%20East", desc: "فرص في الشرق الأوسط وشمال أفريقيا.", level: "مبتدئ", lang: "ar" },
];
