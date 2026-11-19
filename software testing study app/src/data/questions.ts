export type Question = {
  id: string;
  ch: number;
  q: string;
  options: string[]; // الإجابة الصحيحة دائماً الأولى قبل الخلط
  exp: string;
};

type Raw = [number, string, string, [string, string, string], string];

const RAW: Raw[] = [
  // ---------- Chapter 1 ----------
  [1, "أي مبدأ يقول إن الاختبار الشامل لكل المدخلات والتركيبات مستحيل؟", "Exhaustive testing is impossible", ["Defects cluster together", "Absence-of-defects fallacy", "Pesticide paradox"], "المبدأ الثاني: لا يمكن اختبار كل التركيبات، لذلك نستخدم المخاطر والأولويات والتقنيات."],
  [1, "ما العلاقة الصحيحة بين Error وDefect وFailure؟", "Error بشري يسبب Defect في work product قد يسبب Failure عند التنفيذ", ["Failure يسبب Error ثم Defect", "Defect يسبب Error عند المستخدم", "الثلاثة مترادفات لنفس المعنى"], "Error بشري ← Defect في المنتج ← Failure أثناء التشغيل. وليست كل Defects تسبب Failure."],
  [1, "ما الفرق الرئيسي بين Testing وDebugging؟", "Testing يظهر الـ failures، وDebugging يجد سبب الـ defect ويصلحه", ["Testing يصلح الـ defects وDebugging يكتشفها", "Debugging يتم دائماً بواسطة المختبر", "لا فرق بينهما"], "Debugging نشاط تطوير: تحليل وإصلاح السبب، ثم يأتي Confirmation testing."],
  [1, "فريق يعيد تشغيل نفس مجموعة الاختبارات منذ سنوات ولم تعد تكشف defects جديدة. أي مبدأ ينطبق؟", "Tests wear out (Pesticide paradox)", ["Early testing saves time and money", "Testing is context dependent", "Exhaustive testing is impossible"], "الحل: مراجعة الاختبارات وتحديثها وإضافة اختبارات جديدة."],
  [1, "في أي من الحالات التالية يقع Absence-of-defects fallacy؟", "نظام خالٍ من الـ defects المعروفة لكنه لا يلبي احتياجات المستخدمين", ["نظام كل الـ defects فيه في وحدة واحدة", "نظام لم تُختبر بعض مساراته", "نظام تأخر تسليمه"], "إصلاح كل الـ defects لا يضمن نجاح النظام إن لم يحقق حاجة المستخدم (Validation)."],
  [1, "أي نشاط من أنشطة الاختبار يجيب عن سؤال «ماذا نختبر؟»", "Test analysis", ["Test design", "Test implementation", "Test completion"], "Test analysis تحدد test conditions من test basis، وTest design تجيب عن «كيف نختبر؟»."],
  [1, "ما فائدة Traceability بين test basis وTest cases؟", "تحليل أثر التغيير وقياس تغطية المتطلبات", ["تقليل عدد الاختبارات دائماً", "الاستغناء عن test plan", "ضمان خلو المنتج من الـ defects"], "Traceability تدعم تحليل الأثر وتدقيق الـ coverage وإبلاغ الحالة."],
  [1, "أي مما يلي من Testware المنتَجة أثناء Test implementation؟", "Test procedures و test suites", ["Test completion report", "Defect reports", "Test plan"], "التنفيذ يعد الـ procedures والـ suites وجدول التنفيذ والبيئة والبيانات."],
  [1, "ما ميزة استقلالية الاختبار (Independence of testing)؟", "مختبر مستقل قد يكتشف defects لا يراها المؤلف بسبب التحيز", ["تسريع التواصل مع المطورين", "تقليل التكلفة دائماً", "الاستغناء عن مراجعة الكود"], "Independence يقلل التحيز المعرفي، لكن قد يسبب عزلة عن الفريق."],
  [1, "أي عبارة صحيحة عن QA وQC؟", "QA موجه للعملية ووقائي، والاختبار من أنشطة QC", ["QA هو نفسه Testing", "QC موجه للعملية فقط", "QA يتم فقط بعد التسليم"], "QA يمنع الـ defects بتحسين العمليات، والاختبار من أنشطة Quality Control."],

  // ---------- Chapter 2 ----------
  [2, "أي مما يلي يُعد مستوى اختبار (Test level)؟", "Component integration testing", ["Smoke testing", "Regression testing", "Exploratory testing"], "المستويات: Component, Component integration, System, System integration, Acceptance."],
  [2, "بعد إصلاح defect، الاختبار الذي يتأكد أن نفس الحالة لم تعد تفشل هو:", "Confirmation testing", ["Regression testing", "Smoke testing", "Load testing"], "Confirmation (Re-testing) يعيد نفس الحالة الفاشلة. أما Regression فيتحقق من عدم كسر وظائف أخرى."],
  [2, "Regression testing يهدف إلى:", "اكتشاف آثار جانبية غير مقصودة بعد تغيير", ["قياس زمن الاستجابة", "مراجعة المتطلبات", "التحقق من إصلاح الـ defect فقط"], "يتأكد أن التغيير لم يكسر ما كان يعمل، ومرشح قوي للأتمتة."],
  [2, "أي مما يلي مثال على اختبار غير وظيفي (Non-functional)؟", "Performance efficiency testing", ["Login with valid user", "Add item to cart", "Reset password"], "الأداء والأمان والاستخدامية والتوافق والموثوقية اختبارات غير وظيفية."],
  [2, "اختبار يجريه مستخدمون حقيقيون في بيئتهم قبل الإصدار النهائي يسمى:", "Beta testing", ["Alpha testing", "Component testing", "Contractual acceptance"], "Alpha عند المطور بموقعه، وBeta عند مستخدمين فعليين في بيئتهم."],
  [2, "ما هي محفزات Maintenance testing؟", "Modification و Migration و Retirement", ["Planning و Design و Execution", "Review و Inspection و Walkthrough", "Alpha و Beta و Gamma"], "Maintenance testing بعد التعديل أو الترحيل أو إيقاف النظام."],
  [2, "ما الذي يساعد Impact analysis على تحديد نطاق Maintenance testing؟", "تحديد أجزاء النظام المتأثرة بالتغيير", ["حساب عدد المطورين", "حذف الاختبارات القديمة", "تقليل حجم الشيفرة"], "تحليل الأثر يحدد ما يجب إعادة اختباره (regression) بحسب المخاطر وحجم التغيير."],
  [2, "ما الذي يميز نهج TDD؟", "كتابة الاختبار قبل كتابة الكود", ["كتابة الكود قبل أي اختبار", "الاعتماد على الاختبار اليدوي فقط", "الاختبار بعد الإصدار"], "TDD نهج Test-first على مستوى الوحدة. وATDD يشتق الاختبارات من Acceptance criteria."],

  // ---------- Chapter 3 ----------
  [3, "أي مما يلي يُعد من Static testing؟", "Code review", ["Load testing", "Smoke testing", "Beta testing"], "Static testing لا ينفذ الكود: Reviews وStatic analysis."],
  [3, "أي defect يسهل اكتشافه بـ Static analysis أكثر من Dynamic testing؟", "كود لا يمكن الوصول إليه (Unreachable code)", ["بطء الاستجابة تحت حمل مرتفع", "تسرب الذاكرة أثناء التشغيل الطويل", "مشاكل التكامل مع الشبكة"], "الأدوات الساكنة تحلل الكود بلا تنفيذ، فتكتشف الكود غير القابل للوصول وانتهاك المعايير."],
  [3, "أي نوع مراجعة هو الأكثر رسمية؟", "Inspection", ["Walkthrough", "Informal review", "Technical review"], "Inspection لها أدوار محددة ومقاييس وقوائم فحص وعملية رسمية."],
  [3, "من المسؤول عن إدارة اجتماع المراجعة وضمان سيره؟", "Moderator (Facilitator)", ["Author", "Scribe", "Manager"], "الـ Facilitator يدير الاجتماع، والـ Scribe يسجل، والـ Author مؤلف المنتج المُراجَع."],
  [3, "ما الترتيب الصحيح لأنشطة عملية المراجعة؟", "Planning, Review initiation, Individual review, Communication and analysis, Fixing and reporting", ["Individual review, Planning, Fixing, Initiation, Analysis", "Initiation, Planning, Analysis, Individual review, Fixing", "Planning, Fixing, Initiation, Individual review, Analysis"], "هذا الترتيب الرسمي لخمسة أنشطة في منهج CTFL v4.0."],
  [3, "ما الفرق الصحيح بين Static وDynamic testing؟", "Static يجد الـ defects مباشرة، وDynamic يجد الـ failures الناتجة عنها", ["Static يجد الـ failures وDynamic يجد الـ defects فقط", "كلاهما ينفذ الكود", "Dynamic لا يحتاج لبيئة تشغيل"], "التنفيذ هو الفارق: Dynamic يظهر failures، وStatic يفحص work product ويجد defects."],

  // ---------- Chapter 4 ----------
  [4, "Boundary Value Analysis (2-value) لمجال صالح من 1 إلى 100. ما قيم الاختبار؟", "0, 1, 100, 101", ["1, 50, 100", "1, 2, 99, 100", "0, 50, 101"], "لكل حد: قيمة الحد وأقرب قيمة في القسم المجاور."],
  [4, "BVA (3-value) لمجال صالح من 10 إلى 20. ما قيم الاختبار؟", "9, 10, 11, 19, 20, 21", ["9, 10, 20, 21", "10, 15, 20", "10, 11, 19, 20"], "لكل حد: القيمة والقيمتان المجاورتان له."],
  [4, "يقبل الحقل عمراً من 18 إلى 60 سنة. كم قسم تكافؤ (Partition) يوجد؟", "3", ["2", "4", "60"], "أقل من 18 (غير صالح)، 18–60 (صالح)، أكثر من 60 (غير صالح)."],
  [4, "لأي سبب تحتوي Test case سلبية في EP على قيمة غير صالحة واحدة فقط؟", "لتجنب Defect masking وتحديد سبب الفشل", ["لتقليل عدد الأقسام", "لأن المعايير تمنع ذلك", "لزيادة سرعة التنفيذ"], "لو جمعنا عدة قيم غير صالحة فقد يخفي أحد الـ defects الآخر."],
  [4, "جدول قرار كامل بـ 3 شروط ثنائية (T/F) يحتوي كم قاعدة؟", "8", ["3", "6", "9"], "2^3 = 8 قواعد قبل أي طي (Collapse)."],
  [4, "Decision Table Testing مناسب عندما:", "تعتمد النتيجة على تركيبة من عدة شروط", ["نريد قياس تغطية الكود", "نختبر الأداء", "نراجع المتطلبات بلا تنفيذ"], "يعرض كل تركيبة شروط ونتائجها، فيكشف تركيبات منسية ومتطلبات متناقضة."],
  [4, "أي مستوى تغطية في State transition testing هو الأقوى؟", "All transitions coverage", ["All states coverage", "Valid transitions coverage", "Statement coverage"], "All transitions تشمل الانتقالات الصالحة وغير الصالحة وتحقق تغطية الحالات."],
  [4, "أي تقنية من التالية تنتمي إلى White-box؟", "Branch testing", ["Equivalence partitioning", "Error guessing", "State transition testing"], "Statement وBranch هما تقنيتا White-box في CTFL."],
  [4, "100% Branch coverage تعني بالضرورة:", "100% Statement coverage", ["عدم وجود defects في الكود", "اختبار كل قيم الإدخال", "100% Boundary coverage"], "Branch تشمل Statement ولا العكس، لكنها لا تضمن خلو الكود من الـ defects."],
  [4, "كود يحتوي 20 أمراً تنفيذياً، نُفذ منها 15 بالـ Test cases الحالية. كم Statement coverage؟", "75%", ["15%", "25%", "80%"], "15 ÷ 20 = 75%."],
  [4, "Exploratory testing هو:", "تعلم وتصميم وتنفيذ متزامن للاختبارات", ["تنفيذ سكربتات مكتوبة مسبقاً فقط", "مراجعة المتطلبات بلا تنفيذ", "اختبار آلي بالكامل"], "يناسب الوقت المحدود والمتطلبات الناقصة ويستخدم test charter."],
  [4, "تقنية يقوم فيها المختبر بتوقع الأخطاء المحتملة بناءً على خبرته:", "Error guessing", ["Statement testing", "Equivalence partitioning", "Decision table testing"], "تعتمد على الخبرة والـ defects السابقة، مثل القسمة على صفر أو الحقول الفارغة."],
  [4, "ما العناصر الثلاثة (3Cs) في User story؟", "Card, Conversation, Confirmation", ["Code, Compile, Commit", "Create, Check, Close", "Cost, Capacity, Cycle"], "Card (وصف)، Conversation (نقاش)، Confirmation (Acceptance criteria)."],
  [4, "في ATDD تُشتق Test cases من:", "Acceptance criteria", ["الكود المصدري", "Defect reports", "خطة الاستضافة"], "ATDD نهج Test-first يشتق الاختبارات من Acceptance criteria قبل التطوير."],
  [4, "صيغة Given/When/Then تُستخدم في:", "كتابة سيناريوهات Acceptance criteria", ["قياس Structural coverage", "تقدير الجهد", "Configuration Management"], "تُستخدم في BDD وATDD لصياغة Acceptance criteria كسيناريوهات."],
  [4, "أي تقنية يُفضّل استخدامها عندما تكون المواصفات ناقصة والوقت ضيقاً؟", "Exploratory testing", ["Decision table testing", "Branch testing", "State transition testing"], "Exploratory testing يعوض نقص التوثيق ويكمل الاختبارات الرسمية."],

  // ---------- Chapter 5 ----------
  [5, "مستوى المخاطرة (Risk level) يُحدد من:", "احتمال الحدوث × الأثر", ["عدد المختبرين", "حجم الكود", "تكلفة الأدوات"], "Likelihood × Impact."],
  [5, "تقدير بثلاث نقاط: متفائل = 2، محتمل = 5، متشائم = 14 (أيام). ما الجهد المقدّر؟", "6", ["5", "7", "7.5"], "(2 + 4×5 + 14) ÷ 6 = 36 ÷ 6 = 6."],
  [5, "Exit criteria تحدد:", "متى يمكن إنهاء نشاط الاختبار", ["متى يبدأ الاختبار", "من يكتب الكود", "أي أداة تُستخدم"], "Entry criteria للبدء، وExit criteria/Definition of Done للانتهاء."],
  [5, "تأخر تسليم البيئة بسبب نقص الموارد هو مثال على:", "Project risk", ["Product risk", "Defect", "Failure"], "المخاطر المرتبطة بإدارة المشروع هي Project risks، أما جودة المنتج فـ Product risks."],
  [5, "ثغرة أمنية محتملة في نظام الدفع هي مثال على:", "Product risk", ["Project risk", "Entry criterion", "Test oracle"], "Product risk مرتبطة بخصائص المنتج وجودته."],
  [5, "أي خيار يُعد استجابة للمخاطر (Risk response)؟", "Mitigation أو Acceptance أو Transfer أو Contingency plan", ["Debugging", "Review", "Regression"], "التخفيف، القبول، النقل، أو خطة الطوارئ."],
  [5, "أي عنصر ضروري في Defect report الجيد؟", "خطوات إعادة الإنتاج والنتيجة الفعلية والمتوقعة", ["رأي المطور في المختبر", "اسم أقدم موظف", "ميزانية المشروع"], "تسهّل المعلومات الدقيقة إعادة الإنتاج والإصلاح."],
  [5, "ما الفرق بين Severity وPriority؟", "Severity أثر الـ defect التقني، وPriority إلحاح الإصلاح", ["هما نفس المعنى", "Severity يحددها المطور فقط وPriority المختبر فقط", "Priority أثر الـ defect التقني وSeverity إلحاح الإصلاح"], "خطأ إملائي في شعار الشركة: Severity منخفضة وPriority عالية."],
  [5, "ما هو الغرض من Configuration Management في الاختبار؟", "التحكم في إصدارات testware وعناصر التهيئة وضمان Traceability", ["زيادة سرعة الحاسوب", "تقدير الجهد", "كتابة test cases"], "تضمن معرفة أي نسخة اختُبرت وإعادة إنتاج النتائج."],
  [5, "أي مما يلي مقياس شائع في مراقبة الاختبار (Test monitoring)؟", "نسبة Test cases المنفذة والناجحة والفاشلة", ["عدد الموظفين الجدد", "ساعات الإجازة", "عدد أسطر التعليقات"], "المقاييس: حالات منفذة/ناجحة، كثافة الـ defects، تغطية المتطلبات، الجهد."],
  [5, "في Test pyramid، أي نوع من الاختبارات ينبغي أن يكون الأكثر عدداً؟", "اختبارات الوحدة (Unit/Component)", ["اختبارات UI الشاملة", "اختبارات القبول اليدوية", "اختبارات الأداء"], "الوحدة سريعة ورخيصة، لذا الأكثر عدداً، وUI الأقل لأنها بطيئة وهشة."],
  [5, "أي تقدير يعتمد على آراء مجموعة خبراء تتقارب عبر جولات؟", "Wideband Delphi", ["Ratio-based", "Extrapolation", "Three-point"], "Wideband Delphi تقدير جماعي بالخبراء، أما Ratio-based فنسب مشاريع سابقة."],
  [5, "من يشترك في «Three Amigos»؟", "Business، Developer، Tester", ["Manager، Auditor، Customer", "Tester، Architect، DBA", "Author، Moderator، Scribe"], "يضمن فهماً مشتركاً للـ story وAcceptance criteria."],

  // ---------- Chapter 6 ----------
  [6, "أي من التالية فائدة لـ Test automation؟", "تقليل الجهد في الاختبارات المتكررة وتحسين الاتساق", ["إلغاء الحاجة للاختبار اليدوي نهائياً", "ضمان خلو المنتج من الـ defects", "إلغاء صيانة الاختبارات"], "الأتمتة تدعم التكرار والاتساق لكنها لا تغني عن الاختبار اليدوي."],
  [6, "أي مما يلي مخاطرة للأتمتة؟", "توقعات غير واقعية وإهمال صيانة السكربتات", ["نتائج أكثر اتساقاً", "تغطية أكبر", "تنفيذ أسرع"], "من المخاطر أيضاً سوء تقدير الجهد والاعتماد الزائد على الأداة."],
  [6, "أي أداة تُصنّف كأداة Static analysis؟", "SonarQube", ["JMeter", "Postman", "Selenium"], "SonarQube تحلل الكود بلا تنفيذ، وJMeter للأداء، وPostman للـ API، وSelenium للتنفيذ الآلي."],
  [6, "أي نوع أدوات يدعم Continuous Integration؟", "DevOps tools مثل Jenkins وGitHub Actions", ["Static analysis فقط", "Defect reporting فقط", "Test data fakers فقط"], "أدوات DevOps تبني وتختبر تلقائياً مع كل تغيير."],
];

export const QUESTIONS: Question[] = RAW.map((r, i) => ({
  id: `q${String(i + 1).padStart(3, "0")}`,
  ch: r[0],
  q: r[1],
  options: [r[2], ...r[3]],
  exp: r[4],
}));

export const QMAP: Record<string, Question> = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));

export type PreparedQuestion = Question & { order: number[]; correctIdx: number };

// خلط الخيارات مع تحديد موضع الإجابة الصحيحة
export function prepare(q: Question): PreparedQuestion {
  const order = q.options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return { ...q, order, correctIdx: order.indexOf(0) };
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
