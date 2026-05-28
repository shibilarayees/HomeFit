import { useState } from 'react'
import { ACTIVITY_LEVELS, WEEKLY_GOALS, isChild } from '../data/nutrition.js'

const empty = {
  name: '', sex: 'female', age: '', heightCm: '', weightKg: '',
  activity: 'moderate', goal: 'maintain', goalWeightKg: '', diet: 'nonveg',
}

export default function MemberForm({ initial, onSave, onClose, onDelete }) {
  const [f, setF] = useState({ ...empty, ...initial })
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  const child = f.age !== '' && isChild(Number(f.age))

  function submit(e) {
    e.preventDefault()
    if (!f.name.trim() || f.age === '') return
    onSave({
      name: f.name.trim(),
      sex: f.sex,
      age: Number(f.age),
      heightCm: f.heightCm ? Number(f.heightCm) : null,
      weightKg: f.weightKg ? Number(f.weightKg) : null,
      activity: f.activity,
      goal: child ? 'maintain' : f.goal,
      goalWeightKg: f.goalWeightKg ? Number(f.goalWeightKg) : null,
      diet: f.diet,
    })
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{initial ? 'Edit member' : 'Add family member'}</h2>
        <form onSubmit={submit}>
          <div className="field">
            <label>Name</label>
            <input value={f.name} onChange={set('name')} placeholder="e.g. Aisha" autoFocus />
          </div>
          <div className="form-grid">
            <div className="field">
              <label>Age</label>
              <input type="number" min="1" max="110" value={f.age} onChange={set('age')} placeholder="years" />
            </div>
            <div className="field">
              <label>Sex</label>
              <select value={f.sex} onChange={set('sex')}>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>
            <div className="field">
              <label>Height (cm)</label>
              <input type="number" value={f.heightCm} onChange={set('heightCm')} placeholder="optional" />
            </div>
            <div className="field">
              <label>Weight (kg)</label>
              <input type="number" value={f.weightKg} onChange={set('weightKg')} placeholder="optional" />
            </div>
          </div>
          <div className="form-grid">
            <div className="field">
              <label>Activity level</label>
              <select value={f.activity} onChange={set('activity')}>
                {ACTIVITY_LEVELS.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Diet preference</label>
              <select value={f.diet} onChange={set('diet')}>
                <option value="nonveg">Non-vegetarian</option>
                <option value="veg">Vegetarian</option>
              </select>
            </div>
          </div>
          {!child && (
            <div className="form-grid">
              <div className="field">
                <label>Weekly goal</label>
                <select value={f.goal} onChange={set('goal')}>
                  {WEEKLY_GOALS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Goal weight (kg)</label>
                <input type="number" value={f.goalWeightKg} onChange={set('goalWeightKg')} placeholder="optional" />
              </div>
            </div>
          )}
          {child && (
            <p className="disclaimer">
              👶 This member is under 18 — HomeFit uses growth-appropriate calorie estimates and
              does not apply weight-loss deficits for children.
            </p>
          )}
          <div className="row" style={{ marginTop: 8, justifyContent: 'space-between' }}>
            <div className="row">
              <button type="submit" className="btn">Save</button>
              <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            </div>
            {initial && onDelete && (
              <button type="button" className="btn danger" onClick={onDelete}>Delete</button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
