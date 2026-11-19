# مسار QA — الطريق إلى ISTQB 🧭

تطبيق ويب عربي مجاني ومتكامل لدراسة **Software Testing / QA**، والتحضير لاجتياز شهادة **ISTQB Foundation Level (CTFL v4.0)**، والاستعداد العملي لسوق العمل.

> **سياسة اللغة:** الشرح والواجهة بالعربية، أما **مصطلحات الاختبار** فتبقى بالإنجليزية كما تظهر في المنهج والامتحان (مثل `Defect` و`Failure` و`Test case` و`Static testing` و`Boundary Value Analysis`)، حتى لا تتعلم اسماً عربياً لا يظهر لك يوم الامتحان. التفاصيل في قسم [المصطلحات الإنجليزية](#المصطلحات-الإنجليزية).

---

## المميزات والأقسام الرئيسية

* **الرئيسية (`/`):** لوحة متابعة يومية تضم العدّاد التنازلي لموعد الامتحان، مؤقت **Pomodoro** عالمي مستمر أثناء التنقل بين الصفحات، تسجيل جلسات الدراسة اليدوية، خطتك الذكية اليوم (الموضوع التالي، البطاقات المستحقة، أضعف فصل، ومراجعة الأخطاء)، رسم بياني لآخر 7 أيام، وقائمة مهام اليوم.
* **منهج ISTQB CTFL v4.0 (`/syllabus` و`/syllabus/[id]`):** الفصول الستة كاملةً (**25 موضوعاً**) بشرح عربي، وأسماء الفصول والمواضيع بصيغتها الرسمية الإنجليزية، والأهداف التعليمية الرسمية (`K1 / K2 / K3`)، وتنبيهات فخاخ الامتحان، وتتبّع الحالة (`لم أبدأ / أتعلم / أتقنته / يحتاج مراجعة`)، وملاحظات ومصادر مرتبطة بكل موضوع.
* **الاختبارات والمحاكاة (`/practice`):** بنك من **57 سؤالاً** بتفسير لكل إجابة، تدريب مخصص حسب الفصل أو على أخطائك فقط، و**محاكاة للامتحان الرسمي** (40 سؤالاً موزونة على الفصول بنسبة `8 / 6 / 4 / 11 / 9 / 2`، بخيار **60 دقيقة** أو **75 دقيقة** لغير الناطقين بالإنجليزية، مع تعليم الأسئلة للمراجعة وتفصيل النتيجة حسب كل فصل).
* **بطاقات المصطلحات والقاموس (`/cards` و`/glossary`):** **68 مصطلحاً** بنظام التكرار المتباعد (**Leitner** عبر 5 صناديق)، بالإضافة إلى قاموس ثنائي اللغة قابل للبحث والفلترة. المصطلح بالإنجليزية وتعريفه بالعربية.
* **المختبر التفاعلي (`/lab`):** 5 أدوات عملية لحسابات الامتحان (`K3`):
  1. مولّد **Equivalence Partitioning** و**BVA (2-value & 3-value)**.
  2. مولّد **Decision table** التفاعلي (`2^n`).
  3. محاكي **Statement vs Branch coverage**.
  4. حاسبة تقدير الجهد (**Three-point estimation**).
  5. حاسبة مستوى المخاطرة (**Likelihood × Impact**).
* **المهارات العملية (`/skills`):** 9 أقسام تطبيقية (**Test cases**، **Defect reports**، **Severity مقابل Priority**، **User Story وAcceptance criteria**، **Exploratory testing**، **Test plan**، **Test summary report**، مراجعة المتطلبات، والتواصل مع المطورين)، مع قوالب جاهزة للنسخ وأداة **مدقّق Defect report** التفاعلية التي تفحص اكتمال عناصر التقرير السبعة (`Title` و`Steps to reproduce` و`Actual result` و`Expected result` و`Environment` و`Reproducibility` و`Severity / Priority`).
* **المصادر المجانية (`/resources`):** دليل منسّق يضم **78 مصدراً مجانياً** (عربي وإنجليزي) في 9 تصنيفات، مع بحث وفلترة حسب اللغة والمستوى وحفظ التقدّم.
* **دليل الشهادة (`/certificate`):** فاحص الجاهزية للحجز، حقائق الامتحان، جدول الأوزان، خطوات الحجز (بما في ذلك بوابة **ESTB / SECC** في مصر)، ونصائح يوم الامتحان.
* **المسار المهني (`/career`):** خارطة طريق من 6 مراحل بعد الشهادة، أفكار محفظة أعمال (`Portfolio`)، **15 سؤال مقابلة عمل** بإجاباتها، نصائح CV بنظام ATS، وشهادات ISTQB التالية (مثل `CTAL-TA` و`CTAL-TAE` و`CTAL-AT v2.0`).
* **الخطة والجدول (`/plan`)، الملاحظات (`/notes`)، التقدم والإنجازات (`/progress`)، والإعدادات (`/settings`):** جدول يومي ديناميكي، خطة 8 أسابيع، دفتر ملاحظات مرتبط بالمنهج، خريطة نشاط حرارية لـ 12 أسبوعاً، 10 شارات إنجاز، والمظهر الداكن/الفاتح، مع **تصدير واستيراد النسخ الاحتياطية JSON**.

---

## المصطلحات الإنجليزية

تُكتب هذه المصطلحات بالإنجليزية داخل الجمل العربية، وتُسبق بـ«الـ» عند التعريف (مثل «اكتشاف الـ defects مبكراً»):

| المجال | المصطلحات |
|---|---|
| **الأساسيات (الفصل 1)** | `Error` → `Defect` → `Failure`، `Root cause`، `Debugging`، `Verification` / `Validation`، `QA` / `QC`، `Test basis`، `Test condition`، `Test case`، `Testware`، `Traceability` |
| **دورة التطوير (الفصل 2)** | `Component / Integration / System / Acceptance testing`، `Confirmation testing`، `Regression testing`، `Maintenance testing`، `Impact analysis`، `Test levels` / `Test types` |
| **Static testing (الفصل 3)** | `Static testing`، `Dynamic testing`، `Static analysis`، `Review process`، `Walkthrough`، `Technical review`، `Inspection` |
| **تقنيات التصميم (الفصل 4)** | `Equivalence Partitioning`، `Boundary Value Analysis`، `Decision table`، `State transition`، `Statement / Branch coverage`، `Error guessing`، `Exploratory testing`، `Checklist-based testing`، `Acceptance criteria`، `ATDD` |
| **الإدارة (الفصل 5)** | `Test plan`، `Entry criteria` / `Exit criteria`، `Three-point estimation`، `Project risk` / `Product risk`، `Defect report`، `Severity` / `Priority`، `Configuration Management`، `Lessons learned`، `stakeholders` |
| **الأدوات (الفصل 6)** | `Test automation`، `CI/CD`، `Static analysis tools` |

ما يبقى بالعربية: الشرح والتوجيهات وواجهة التطبيق (القوائم والأزرار والحالات)، لأنها ليست مصطلحات امتحان.

> **ملاحظة للمساهمين:** عند إضافة محتوى جديد (أسئلة أو بطاقات أو مواضيع) استخدم الصيغة الإنجليزية الرسمية لمصطلحات ISTQB داخل النص العربي، وتجنّب ترجمتها (مثل «العيب» أو «الإخفاق» أو «حالة الاختبار»). راجع [ISTQB Glossary](https://glossary.istqb.org) عند الشك.

---

## التقنيات المستخدمة

* **الواجهة:** Next.js 16 (App Router)، React 19، TypeScript، Tailwind CSS v4
* **قاعدة البيانات:** PostgreSQL + Drizzle ORM (`8` جداول، وعزل تلقائي لبيانات كل متصفح عبر كوكي `qa_uid` من نوع `httpOnly`)

---

## متطلبات التشغيل المحلي

* **Node.js** إصدار 20.9 أو أحدث
* **PostgreSQL** (محلياً أو على خدمة سحابية)

### خطوات التشغيل

1. **تثبيت الاعتماديات:**
   ```bash
   npm install
   ```

2. **إنشاء قاعدة البيانات** (مثال محلي):
   ```bash
   createdb app_db
   ```

3. **ضبط متغير البيئة** بإنشاء ملف `.env.local` في جذر المشروع:
   ```bash
   DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
   ```

4. **إنشاء الجداول:** يقرأ `drizzle.config.json` رابط الاتصال من الملف نفسه، وقيمته الافتراضية `postgresql://postgres:postgres@127.0.0.1:5432/app_db`. إن كانت قاعدتك مختلفة فعدّل `dbCredentials.url` فيه أولاً، ثم نفّذ:
   ```bash
   npx drizzle-kit push
   ```

5. **تشغيل وضع التطوير:**
   ```bash
   npm run dev
   ```
   ثم افتح [http://localhost:3000](http://localhost:3000).

### أوامر أخرى

| الأمر | الوظيفة |
|---|---|
| `npm run typecheck` | فحص أنواع TypeScript |
| `npm run lint` | فحص ESLint |
| `npm run build` | بناء نسخة الإنتاج (يتطلب `DATABASE_URL`) |
| `npm run start` | تشغيل نسخة الإنتاج بعد البناء |

للتأكد من اتصال قاعدة البيانات افتح `/api/health`، وتعيد `{"ok":true}` عند نجاح الاتصال.
