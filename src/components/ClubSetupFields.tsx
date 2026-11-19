import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { inputClass, labelClass } from './AuthShell'

export interface Hall {
  name: string
  address: string
}
export interface Group {
  name: string
  ages: string
  hall: string
  schedule: string
  fee: string
}
export interface Coach {
  name: string
  phone: string
  email: string
  role: 'owner' | 'coach'
}
export interface ClubSetup {
  halls: Hall[]
  groups: Group[]
  coaches: Coach[]
  belts: 'kyu_dan' | 'colors' | 'other'
  extras: { grades: boolean; qr: boolean; store: boolean }
  accent: string
}

export const emptySetup = (): ClubSetup => ({
  halls: [{ name: '', address: '' }],
  groups: [{ name: '', ages: '', hall: '', schedule: '', fee: '' }],
  coaches: [{ name: '', phone: '', email: '', role: 'owner' }],
  belts: 'kyu_dan',
  extras: { grades: false, qr: false, store: false },
  accent: '#c2361f',
})

const small = `${inputClass} mt-1 min-h-11 px-3 text-sm`

// A repeatable block (hall, group, coach) with add and remove.
function Rows<T>({
  title,
  hint,
  items,
  onChange,
  blank,
  addLabel,
  render,
}: {
  title: string
  hint?: string
  items: T[]
  onChange: (items: T[]) => void
  blank: T
  addLabel: string
  render: (item: T, set: (patch: Partial<T>) => void) => React.ReactNode
}) {
  const { t } = useTranslation()
  return (
    <fieldset className="rounded-2xl border border-shiro/10 p-4">
      <legend className="px-1 font-display text-sm uppercase tracking-wide text-shiro">{title}</legend>
      {hint && <p className="-mt-1 mb-3 text-xs text-shiro/45">{hint}</p>}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="relative rounded-xl bg-night/60 p-3 pr-10"
            >
              {render(item, (patch) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x))))}
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_, j) => j !== i))}
                  className="absolute right-2 top-2 rounded-full px-2 py-1 text-xs text-shiro/40 hover:text-aka"
                  aria-label={t('setup.remove')}
                >
                  ✕
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <button type="button" onClick={() => onChange([...items, blank])} className="mt-3 text-xs uppercase tracking-wide text-straw hover:underline">
        + {addLabel}
      </button>
    </fieldset>
  )
}

// What we need to set the club up: halls, groups and their times, coaches,
// belts, extras and colour. All optional; what they skip we ask on the call.
export function ClubSetupFields({ value, onChange }: { value: ClubSetup; onChange: (v: ClubSetup) => void }) {
  const { t } = useTranslation()
  const set = (patch: Partial<ClubSetup>) => onChange({ ...value, ...patch })

  return (
    <div className="space-y-4">
      <div>
        <p className="font-display text-lg uppercase tracking-wide text-shiro">{t('setup.title')}</p>
        <p className="mt-1 text-sm text-shiro/55">{t('setup.body')}</p>
      </div>

      <Rows
        title={t('setup.halls')}
        items={value.halls}
        onChange={(halls) => set({ halls })}
        blank={{ name: '', address: '' }}
        addLabel={t('setup.addHall')}
        render={(h, s) => (
          <div className="grid gap-2 sm:grid-cols-2">
            <input maxLength={80} value={h.name} onChange={(e) => s({ name: e.target.value })} placeholder={t('setup.hallName')} className={small} />
            <input maxLength={160} value={h.address} onChange={(e) => s({ address: e.target.value })} placeholder={t('setup.hallAddress')} className={small} />
          </div>
        )}
      />

      <Rows
        title={t('setup.groups')}
        hint={t('setup.groupsHint')}
        items={value.groups}
        onChange={(groups) => set({ groups })}
        blank={{ name: '', ages: '', hall: '', schedule: '', fee: '' }}
        addLabel={t('setup.addGroup')}
        render={(g, s) => (
          <div className="grid gap-2 sm:grid-cols-2">
            <input maxLength={80} value={g.name} onChange={(e) => s({ name: e.target.value })} placeholder={t('setup.groupName')} className={small} />
            <input maxLength={60} value={g.ages} onChange={(e) => s({ ages: e.target.value })} placeholder={t('setup.groupAges')} className={small} />
            <input maxLength={200} value={g.schedule} onChange={(e) => s({ schedule: e.target.value })} placeholder={t('setup.groupSchedule')} className={`${small} sm:col-span-2`} />
            <select value={g.hall} onChange={(e) => s({ hall: e.target.value })} className={small}>
              <option value="">{t('setup.groupHall')}</option>
              {value.halls.filter((h) => h.name.trim()).map((h) => (
                <option key={h.name} value={h.name}>{h.name}</option>
              ))}
            </select>
            <input maxLength={20} inputMode="decimal" value={g.fee} onChange={(e) => s({ fee: e.target.value })} placeholder={t('setup.groupFee')} className={small} />
          </div>
        )}
      />

      <Rows
        title={t('setup.coaches')}
        hint={t('setup.coachesHint')}
        items={value.coaches}
        onChange={(coaches) => set({ coaches })}
        blank={{ name: '', phone: '', email: '', role: 'coach' } as Coach}
        addLabel={t('setup.addCoach')}
        render={(c, s) => (
          <div className="grid gap-2 sm:grid-cols-2">
            <input maxLength={80} value={c.name} onChange={(e) => s({ name: e.target.value })} placeholder={t('setup.coachName')} className={small} />
            <select value={c.role} onChange={(e) => s({ role: e.target.value as Coach['role'] })} className={small}>
              <option value="owner">{t('setup.roleOwner')}</option>
              <option value="coach">{t('setup.roleCoach')}</option>
            </select>
            <input type="tel" maxLength={40} value={c.phone} onChange={(e) => s({ phone: e.target.value })} placeholder={t('setup.coachPhone')} className={small} />
            <input type="email" maxLength={120} value={c.email} onChange={(e) => s({ email: e.target.value })} placeholder={t('setup.coachEmail')} className={small} />
          </div>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>{t('setup.belts')}</span>
          <select value={value.belts} onChange={(e) => set({ belts: e.target.value as ClubSetup['belts'] })} className={small}>
            <option value="kyu_dan">{t('setup.beltsKyu')}</option>
            <option value="colors">{t('setup.beltsColors')}</option>
            <option value="other">{t('setup.beltsOther')}</option>
          </select>
        </label>
        <label className="block">
          <span className={labelClass}>{t('setup.accent')}</span>
          <span className="mt-1 flex items-center gap-3">
            <input type="color" value={value.accent} onChange={(e) => set({ accent: e.target.value })} className="h-11 w-14 cursor-pointer rounded-lg border border-shiro/15 bg-night p-1" />
            <span className="text-xs text-shiro/45">{t('setup.accentHint')}</span>
          </span>
        </label>
      </div>

      <fieldset>
        <legend className={labelClass}>{t('setup.extras')}</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {(['grades', 'qr', 'store'] as const).map((k) => (
            <label key={k} className={`flex cursor-pointer items-start gap-2 rounded-xl border p-3 text-sm transition-colors ${value.extras[k] ? 'border-straw bg-straw/10 text-shiro' : 'border-shiro/10 text-shiro/60'}`}>
              <input type="checkbox" checked={value.extras[k]} onChange={(e) => set({ extras: { ...value.extras, [k]: e.target.checked } })} className="mt-0.5 h-4 w-4 accent-aka" />
              <span>{t(`setup.extra.${k}`)}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <p className="text-xs text-shiro/45">{t('setup.logoNote')}</p>
    </div>
  )
}
