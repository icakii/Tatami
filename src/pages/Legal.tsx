import { useTranslation } from 'react-i18next'
import { Footer, Nav } from '../components/Brand'

type Doc = { title: string; sections: { h: string; p: string[] }[] }

const EMAIL = 'deividantonov@gmail.com, hristo@varbanov.eu'

const TERMS: Record<'bg' | 'en', Doc> = {
  bg: {
    title: 'Общи условия',
    sections: [
      { h: '1. Услугата', p: ['Tatami изработва и поддържа уебсайт и приложение за спортен клуб и въвежда и поддържа данните на клуба (ученици, групи, график, такси) по искане на клуба.'] },
      {
        h: '2. Абонамент и плащане',
        p: [
          'Цената е 99 € на месец, плюс 10 € на месец, ако сте избрали нов домейн, управляван от нас. Първият месец се плаща при поръчката.',
          'Абонаментът се подновява автоматично всеки месец, докато не бъде прекратен.',
          'Плащанията се обработват от Paddle.com, който е търговецът (Merchant of Record) за всички поръчки. Paddle издава фактурите и обработва данните за картата; ние не ги виждаме и не ги съхраняваме.',
        ],
      },
      {
        h: '3. Прекратяване и възстановяване',
        p: [
          'Можете да прекратите абонамента по всяко време от профила си. Прекратяването важи от края на текущия платен период; дотогава услугата остава активна.',
          'Платени суми не се възстановяват, включително за неизползваната част от месеца, освен когато закон изисква друго.',
          'След края на платения период сайтът и приложението на клуба се спират. При поискване в рамките на 30 дни можем да ви изпратим данните на клуба.',
        ],
      },
      { h: '4. Спиране при неплащане', p: ['Ако плащането не мине, можем да спрем сайта на клуба, докато сметката не бъде уредена.'] },
      { h: '5. Съдържание', p: ['Вие отговаряте за снимките, текстовете и данните, които ни изпращате, и потвърждавате, че имате право да ги използвате.'] },
      { h: '6. Отговорност', p: ['Полагаме разумни усилия сайтът да работи непрекъснато, но не гарантираме, че няма да има прекъсвания. Отговорността ни е ограничена до сумата, платена за последния месец.'] },
      { h: '7. Промени', p: ['Можем да променяме тези условия или цената с предизвестие поне 30 дни по имейл.'] },
      { h: '8. Контакт', p: [`Въпроси: ${EMAIL}. Приложимо е българското право.`] },
    ],
  },
  en: {
    title: 'Terms of Service',
    sections: [
      { h: '1. The service', p: ['Tatami builds and maintains a website and app for a sports club, and enters and maintains the club’s data (students, groups, schedule, fees) at the club’s request.'] },
      {
        h: '2. Subscription and payment',
        p: [
          'The price is 99 € per month, plus 10 € per month if you chose a new domain managed by us. The first month is paid when you order.',
          'The subscription renews automatically every month until cancelled.',
          'Payments are processed by Paddle.com, the Merchant of Record for all orders. Paddle issues the invoices and handles card details; we never see or store them.',
        ],
      },
      {
        h: '3. Cancellation and refunds',
        p: [
          'You can cancel at any time from your account. Cancellation takes effect at the end of the current paid period; the service stays active until then.',
          'Payments are non-refundable, including for the unused part of a month, except where the law requires otherwise.',
          'After the paid period ends, the club’s site and app are switched off. On request within 30 days we can send you the club’s data.',
        ],
      },
      { h: '4. Suspension for non-payment', p: ['If a payment fails, we may suspend the club’s site until the account is settled.'] },
      { h: '5. Content', p: ['You are responsible for the photos, text and data you send us and confirm you have the right to use them.'] },
      { h: '6. Liability', p: ['We make reasonable efforts to keep the site running but do not guarantee it will be uninterrupted. Our liability is limited to the amount paid for the last month.'] },
      { h: '7. Changes', p: ['We may change these terms or the price with at least 30 days’ notice by email.'] },
      { h: '8. Contact', p: [`Questions: ${EMAIL}. Bulgarian law applies.`] },
    ],
  },
}

const PRIVACY: Record<'bg' | 'en', Doc> = {
  bg: {
    title: 'Политика за поверителност',
    sections: [
      { h: 'Кой сме', p: [`Tatami. Контакт за въпроси относно лични данни: ${EMAIL}.`] },
      {
        h: 'Какви данни събираме',
        p: [
          'Акаунт: име, имейл и парола (паролата се пази само като хеш).',
          'Поръчка: името на клуба, град, телефон, домейн и бележките, които попълвате.',
          'Плащане: обработва се от Paddle. Получаваме само статуса на плащането и идентификатори на абонамента, не и данни за картата.',
        ],
      },
      { h: 'Защо', p: ['За да изпълним поръчката, да поддържаме услугата, да се свържем с вас за нея и да спазим счетоводните си задължения.'] },
      { h: 'Данните на учениците', p: ['Данните на учениците на клуба се обработват от нас от името на клуба. Клубът е администраторът на тези данни, а ние сме обработващ.'] },
      { h: 'Къде се съхраняват', p: ['В базата данни на Supabase и при Paddle за плащанията. Не продаваме и не споделяме данни с рекламодатели. Сайтът не използва рекламни или проследяващи бисквитки.'] },
      { h: 'Колко време', p: ['Докато имате акаунт, и след това само колкото изисква законът (например счетоводни документи).'] },
      { h: 'Вашите права', p: ['Имате право на достъп, поправка, изтриване, ограничаване и преносимост на данните си, както и на жалба до Комисията за защита на личните данни.'] },
    ],
  },
  en: {
    title: 'Privacy Policy',
    sections: [
      { h: 'Who we are', p: [`Tatami. Contact for data questions: ${EMAIL}.`] },
      {
        h: 'What we collect',
        p: [
          'Account: name, email and password (stored only as a hash).',
          'Order: club name, city, phone, domain and the notes you fill in.',
          'Payment: handled by Paddle. We receive only the payment status and subscription identifiers, never card details.',
        ],
      },
      { h: 'Why', p: ['To fulfil your order, run the service, contact you about it and meet our accounting obligations.'] },
      { h: 'Students’ data', p: ['We process the club’s student data on the club’s behalf. The club is the controller of that data and we are the processor.'] },
      { h: 'Where it is stored', p: ['In our Supabase database, and with Paddle for payments. We do not sell or share data with advertisers. The site uses no advertising or tracking cookies.'] },
      { h: 'How long', p: ['While you have an account, and afterwards only as long as the law requires (for example accounting records).'] },
      { h: 'Your rights', p: ['You have the right to access, correct, delete, restrict and port your data, and to complain to the Bulgarian Commission for Personal Data Protection.'] },
    ],
  },
}

function LegalPage({ docs }: { docs: Record<'bg' | 'en', Doc> }) {
  const { t, i18n } = useTranslation()
  const doc = docs[i18n.resolvedLanguage === 'en' ? 'en' : 'bg']
  return (
    <div className="tatami-weave flex min-h-screen flex-col">
      <Nav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-14">
        <h1 className="font-display text-4xl font-bold uppercase tracking-wide text-shiro">{doc.title}</h1>
        <p className="mt-2 text-sm text-shiro/40">{t('legal.updated')}</p>
        <div className="mt-10 space-y-8">
          {doc.sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-lg uppercase tracking-wide text-straw">{s.h}</h2>
              {s.p.map((p) => (
                <p key={p} className="mt-2 leading-relaxed text-shiro/70">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export const Terms = () => <LegalPage docs={TERMS} />
export const Privacy = () => <LegalPage docs={PRIVACY} />
