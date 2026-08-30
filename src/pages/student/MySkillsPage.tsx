              {/* Self-Assessed Proficiency Slider */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="font-bold uppercase tracking-wider text-slate-700">
                    Self-Assessed Proficiency Level
                  </label>
                  <span className="font-['Outfit'] font-black text-indigo-600 text-sm">
                    {newSkillProficiency}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={newSkillProficiency}
                  onChange={(e) => setNewSkillProficiency(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
