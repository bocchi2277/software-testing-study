"use client";

import { useState } from "react";
import { TEMPLATES } from "@/data/career";
import { PageTitle } from "@/components/ui";
import BugChecker from "@/components/BugChecker";

type Section = {
  id: string;
  title: string;
  intro: string;
  rules: string[];
  bad?: string;
  tpl?: string;
  exercise?: string;
};

const SECTIONS: Section[] = [
  {
    id: "tc",
    title: "Test cases",
    intro: "الـ Test case الجيدة يفهمها مختبر آخر وينفذها دون أن يسألك، ونتيجتها المتوقعة قابلة للتحقق.",
    rules: [
      "هدف واحد لكل حالة: إن فشلت عرفت السبب فوراً.",
      "خطوات بأفعال واضحة: افتح، أدخل، اضغط. وليس «جرّب» أو «تأكد».",
      "نتيجة متوقعة قابلة للتحقق، لا «يعمل بشكل صحيح».",
      "تغطي الحالة الإيجابية والسلبية والحدود (Boundary).",
      "اربطها بالمتطلب (Traceability) وحدد الأولوية.",
      "لا تربطها بتفاصيل تنفيذ تتغير كل أسبوع.",
    ],
    bad: "Title: Test login\nSteps: Try to login\nExpected: Works",
    tpl: TEMPLATES.tc,
    exercise: "اكتب 5 حالات لصفحة تسجيل الدخول: بيانات صحيحة، كلمة مرور خاطئة، حقل فارغ، حد أقصى للطول، قفل الحساب بعد محاولات فاشلة. ثم نفذها على saucedemo.com.",
  },
  {
    id: "bug",
    title: "Defect reports",
    intro: "هدف التقرير أن يستطيع المطور إعادة المشكلة وفهمها وإصلاحها دون سؤال واحد.",
    rules: [
      "عنوان يذكر المكان والمشكلة والشرط، لا «لا يعمل».",
      "أعد إنتاج الـ defect بنفسك قبل الإبلاغ، وسجّل عدد مرات تكراره.",
      "افصل بين Actual وExpected، واذكر مرجع المتوقع.",
      "اذكر البيئة بدقة: الإصدار والنظام والمتصفح.",
      "أرفق دليلاً: لقطة شاشة أو فيديو أو سجل أخطاء (Console / Network).",
      "Defect واحد لكل تقرير، وابحث عن تقرير مكرر قبل الإرسال.",
      "لغة محايدة بلا اتهام أو انفعال.",
    ],
    bad: "Payment doesn't work!!!",
    tpl: TEMPLATES.bug,
    exercise: "افتح the-internet.herokuapp.com أو الموقع التدريبي Sauce Demo (مستخدم problem_user) واكتب 3 Defect reports كاملة.",
  },
  {
    id: "sev",
    title: "Severity مقابل Priority",
    intro: "من أكثر الأسئلة تكراراً في الامتحان والمقابلات.",
    rules: [
      "Severity: مدى تأثير الـ defect على النظام (تقني) ويحدده غالباً المختبر.",
      "Priority: مدى استعجال الإصلاح (قرار عمل) ويحدده Product Owner/المدير.",
      "عالية Severity + منخفضة Priority: انهيار تقرير إداري نادر الاستخدام.",
      "منخفضة Severity + عالية Priority: خطأ إملائي في اسم الشركة على الصفحة الرئيسية.",
      "عالية + عالية: تعذّر الدفع في متجر إلكتروني.",
      "منخفضة + منخفضة: اختلاف بسيط في لون زر في صفحة نادرة.",
    ],
  },
  {
    id: "story",
    title: "User Story وAcceptance criteria",
    intro: "مهارة مطلوبة في Agile ومرتبطة بـ ATDD في الفصل 4.",
    rules: [
      "As a [دور] I want [هدف] so that [فائدة].",
      "Acceptance criteria بصيغة Given / When / Then وقابلة للاختبار.",
      "اسأل «ماذا لو...؟» لكشف الغموض قبل التطوير.",
      "تحقق من INVEST: Independent, Negotiable, Valuable, Estimable, Small, Testable.",
    ],
    tpl: TEMPLATES.story,
    exercise: "حوّل صفحة «التسجيل» إلى 3 user stories بمعايير قبول.",
  },
  {
    id: "charter",
    title: "Exploratory testing (Charter)",
    intro: "جلسة محددة الوقت بهدف واضح، تُسجَّل ملاحظاتها.",
    rules: [
      "حدد المنطقة والأدوات والمعلومة التي تبحث عنها.",
      "وقت محدد: 45–90 دقيقة دون مقاطعة.",
      "دوّن: ما اختبرته، أسئلتك، الـ defects، أفكار الجلسة التالية.",
      "استخدم نماذج تفكير: SFDIPOT وتجاوز الحدود والبيانات الغريبة.",
    ],
    tpl: TEMPLATES.charter,
    exercise: "نفّذ جلسة 45 دقيقة على Practice Software Testing: Explore checkout with invalid data to discover validation gaps.",
  },
  {
    id: "plan",
    title: "Test plan",
    intro: "وثيقة قصيرة تجيب: ماذا نختبر؟ كيف؟ متى نبدأ وننتهي؟ ما المخاطر؟",
    rules: [
      "حدد النطاق بوضوح: داخل النطاق وخارجه.",
      "اكتب Entry وExit criteria قابلة للقياس.",
      "حدد المخاطر وكيف تتعامل معها (Likelihood × Impact).",
      "اجعلها قصيرة وحيّة وتُحدَّث.",
    ],
    tpl: TEMPLATES.plan,
  },
  {
    id: "summary",
    title: "Test summary report",
    intro: "يقرؤه المدير: ما الوضع؟ هل نُصدر؟ ما المخاطر المتبقية؟",
    rules: [
      "ما اختُبر وما لم يُختبر.",
      "أرقام: منفذة، ناجحة، فاشلة، محجوبة.",
      "الـ defects المفتوحة حسب الخطورة.",
      "المخاطر المتبقية والتوصية (Go / No-go).",
    ],
    tpl: TEMPLATES.summary,
  },
  {
    id: "req",
    title: "مراجعة المتطلبات",
    intro: "أرخص مكان لاكتشاف الـ defects (Shift-left): قبل كتابة الكود.",
    rules: [
      "ابحث عن كلمات غامضة: «سريع»، «سهل»، «مناسب»، «إلخ».",
      "ابحث عن متطلبات ناقصة أو متعارضة أو غير قابلة للاختبار.",
      "اسأل عن الحالات الحدية والأخطاء والصلاحيات.",
      "اسأل: كيف سأعرف أن هذا نجح؟ إن لم تعرف فالمتطلب ناقص.",
    ],
    exercise: "اقرأ: «يجب أن يكون النظام سريعاً وسهل الاستخدام». اكتب 5 أسئلة توضيحية تجعله قابلاً للاختبار.",
  },
  {
    id: "comm",
    title: "التواصل مع المطورين",
    intro: "مهارة ناعمة تحدد نجاحك أكثر مما تتصور.",
    rules: [
      "تحدث عن المنتج لا عن الشخص: «الزر لا يستجيب» لا «أخطأت».",
      "قدّم الدليل وخطوات الإعادة، واعرض مساعدتك.",
      "كن مستعداً لشرح الخطوات مباشرة إذا لم تُفهم.",
      "شاركهم مبكراً: جلسات Three Amigos ومراجعة المتطلبات.",
    ],
  },
];

export default function SkillsPage() {
  const [id, setId] = useState("tc");
  const [copied, setCopied] = useState(false);
  const s = SECTIONS.find((x) => x.id === id)!;

  return (
    <>
      <PageTitle title="المهارات العملية للمختبر 🛠️" sub="ما يُقيَّم فيه المختبر في العمل اليومي، وتظهر منه أسئلة في الامتحان." />
      <div className="mb-4 flex flex-wrap gap-2">
        {SECTIONS.map((x) => (
          <button key={x.id} className="chip" aria-pressed={id === x.id} onClick={() => { setId(x.id); setCopied(false); }}>
            {x.title}
          </button>
        ))}
      </div>

      <div className="card mb-3">
        <h2 className="mb-1 mt-0 text-lg font-bold">{s.title}</h2>
        <p className="mt-0 text-mu">{s.intro}</p>
        <ul className="m-0 ps-5">
          {s.rules.map((r) => (
            <li key={r} className="mb-1">{r}</li>
          ))}
        </ul>
      </div>

      {s.bad && (
        <div className="mb-3">
          <b className="text-sm text-bad">❌ سيئة</b>
          <pre className="code bd">{s.bad}</pre>
        </div>
      )}
      {s.tpl && (
        <div className="mb-3">
          <b className="text-sm text-ok">✅ قالب جيد</b>
          <pre className="code gd">{s.tpl}</pre>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              void navigator.clipboard?.writeText(s.tpl!).then(() => setCopied(true)).catch(() => {});
            }}
          >
            {copied ? "تم النسخ ✓" : "نسخ القالب"}
          </button>
        </div>
      )}
      {s.exercise && (
        <div className="rounded-xl border border-ac p-3 text-sm">
          <b>🏋️ تمرين:</b> {s.exercise}
        </div>
      )}
      {id === "bug" && <BugChecker />}
    </>
  );
}
