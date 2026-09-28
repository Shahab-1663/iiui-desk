"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { AlarmClock, ArrowRight, Calculator, CirclePlus, Minus, Pause, Play, RotateCcw, Sparkles, Trash2 } from "lucide-react";

type Course = { id: number; name: string; credits: string; points: string };
const gradeScale = [["A", "4.00"], ["B+", "3.50"], ["B", "3.00"], ["C+", "2.50"], ["C", "2.00"], ["D+", "1.50"], ["D", "1.00"], ["F", "0.00"]];

export function StudentTools() {
  const [courses, setCourses] = useState<Course[]>([{ id: 1, name: "", credits: "3", points: "4" }, { id: 2, name: "", credits: "3", points: "3.5" }, { id: 3, name: "", credits: "3", points: "3" }]);
  const [priorGpa, setPriorGpa] = useState("");
  const [priorCredits, setPriorCredits] = useState("");
  const [target, setTarget] = useState("3.5");
  const [nextCredits, setNextCredits] = useState("15");
  const [duration, setDuration] = useState(25);
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");

  const result = useMemo(() => {
    const currentCredits = courses.reduce((sum, item) => sum + Math.max(0, Number(item.credits) || 0), 0);
    const currentPoints = courses.reduce((sum, item) => sum + Math.max(0, Number(item.credits) || 0) * (Number(item.points) || 0), 0);
    const oldCredits = Math.max(0, Number(priorCredits) || 0);
    const oldPoints = oldCredits * (Number(priorGpa) || 0);
    const totalCredits = currentCredits + oldCredits;
    const gpa = totalCredits ? (currentPoints + oldPoints) / totalCredits : 0;
    const futureCredits = Math.max(0, Number(nextCredits) || 0);
    const required = futureCredits ? ((Number(target) || 0) * (totalCredits + futureCredits) - (currentPoints + oldPoints)) / futureCredits : 0;
    return { gpa, totalCredits, required };
  }, [courses, priorGpa, priorCredits, target, nextCredits]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSeconds((time) => {
      return Math.max(0, time - 1);
    }), 1000);
    return () => window.clearInterval(timer);
  }, [running]);
  useEffect(() => { if (seconds === 0) setRunning(false); }, [seconds]);

  function changeCourse(id: number, field: keyof Omit<Course, "id">, value: string) {
    setCourses((rows) => rows.map((row) => row.id === id ? { ...row, [field]: value } : row));
  }
  function addCourse() { setCourses((rows) => [...rows, { id: Date.now(), name: "", credits: "3", points: "4" }]); }
  function setTimerMinutes(value: number) { const safe = Math.max(1, Math.min(90, value)); setDuration(safe); setSeconds(safe * 60); setRunning(false); }
  const displayTime = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const progress = 1 - seconds / Math.max(1, duration * 60);

  return <div className="tools-layout">
    <section className="tool-panel cgpa-panel" id="cgpa">
      <div className="tool-panel-head"><div><span className="section-kicker">TOOL 01 / ACADEMIC PLANNER</span><h2>CGPA <em>navigator.</em></h2><p>Model your current standing and see what the next semester needs. Your entries stay in this browser.</p></div><span className="tool-panel-icon"><Calculator size={20}/></span></div>
      <div className="cgpa-fields"><label>Previous CGPA <span>(optional)</span><input inputMode="decimal" type="number" min="0" max="4" step="0.01" placeholder="e.g. 3.24" value={priorGpa} onChange={(e) => setPriorGpa(e.target.value)}/></label><label>Previous credit hours <span>(optional)</span><input inputMode="numeric" type="number" min="0" max="300" placeholder="e.g. 48" value={priorCredits} onChange={(e) => setPriorCredits(e.target.value)}/></label></div>
      <div className="course-table-wrap"><div className="course-table-head"><span>COURSE / SUBJECT</span><span>CREDIT HRS</span><span>GRADE POINT</span><span /></div>{courses.map((course, index) => <div className="course-row" key={course.id}><label className="sr-only" htmlFor={`course-${course.id}`}>Course {index + 1}</label><input id={`course-${course.id}`} placeholder={`Course ${String(index + 1).padStart(2, "0")}`} value={course.name} onChange={(e) => changeCourse(course.id, "name", e.target.value)}/><label className="sr-only" htmlFor={`credits-${course.id}`}>Credit hours</label><input id={`credits-${course.id}`} type="number" min="0" max="10" step="0.5" value={course.credits} onChange={(e) => changeCourse(course.id, "credits", e.target.value)}/><label className="sr-only" htmlFor={`grade-${course.id}`}>Grade point</label><select id={`grade-${course.id}`} value={course.points} onChange={(e) => changeCourse(course.id, "points", e.target.value)}>{gradeScale.map(([grade, point]) => <option key={grade} value={point}>{grade} · {point}</option>)}</select><button className="row-delete" aria-label={`Remove course ${index + 1}`} onClick={() => setCourses((rows) => rows.length > 1 ? rows.filter((row) => row.id !== course.id) : rows)}><Trash2 size={15}/></button></div>)}</div>
      <button className="add-course" onClick={addCourse}><CirclePlus size={15}/> Add a course</button>
      <div className="gpa-results"><div className="gpa-big"><span>PROJECTED CGPA</span><strong>{result.gpa.toFixed(2)}</strong><small>on a 4.00 scale · {result.totalCredits} credit hours recorded</small></div><div className="target-calc"><span className="section-kicker">NEXT SEMESTER TARGET</span><div className="target-fields"><label>Target CGPA<input type="number" min="0" max="4" step="0.01" value={target} onChange={(e) => setTarget(e.target.value)}/></label><label>Next credit hours<input type="number" min="1" max="40" value={nextCredits} onChange={(e) => setNextCredits(e.target.value)}/></label></div><p>{result.required <= 0 ? "You have already reached this target." : result.required > 4 ? "This target is out of reach in one semester; try a longer plan." : <>Aim for an average semester GPA of <strong>{result.required.toFixed(2)}</strong>.</>}</p></div></div>
      <p className="tool-disclaimer">Uses the IIUI undergraduate grade-point key and credit-hour weighting. Regulations differ by programme and can change; confirm repeat-course rules with your department.</p>
    </section>

    <section className="tool-panel focus-panel" id="focus">
      <div className="focus-head"><span className="section-kicker">TOOL 02 / STUDY RHYTHM</span><span className="focus-status"><i/> {running ? "IN SESSION" : "READY WHEN YOU ARE"}</span></div><div className="focus-layout"><div className="timer-dial" style={{ "--timer-progress": `${progress * 100}%` } as CSSProperties}><div><span>{mode === "focus" ? "FOCUS SPRINT" : "RESET BREAK"}</span><strong>{displayTime}</strong><small>{seconds === 0 ? "SPRINT COMPLETE" : running ? "ONE THING AT A TIME" : "TAKE A BREATH"}</small></div></div><div className="timer-controls"><h3>Make room<br/>for <em>deep work.</em></h3><p>Pick a sprint length, silence the noise and work on one thing until the timer ends.</p><div className="timer-presets">{[15,25,45].map((value) => <button key={value} className={duration === value ? "selected" : ""} onClick={() => setTimerMinutes(value)}>{value} MIN</button>)}</div><div className="timer-buttons"><button onClick={() => setRunning((value) => !value)} className="timer-start">{running ? <Pause size={15}/> : <Play size={15}/>} {running ? "Pause" : seconds === 0 ? "Start again" : "Start sprint"}</button><button className="timer-reset" aria-label="Reset focus timer" onClick={() => { setRunning(false); setSeconds(duration * 60); }}><RotateCcw size={16}/></button></div><button className="mode-switch" onClick={() => { const next = mode === "focus" ? "break" : "focus"; setMode(next); setTimerMinutes(next === "focus" ? 25 : 5); }}>{mode === "focus" ? <><AlarmClock size={14}/> Switch to 5 minute break</> : <><Sparkles size={14}/> Back to a 25 minute sprint</>}</button></div></div><div className="focus-foot"><span>25 MIN FOCUS</span><span>05 MIN RESET</span><span>REPEAT AT YOUR PACE <ArrowRight size={13}/></span></div>
    </section>
  </div>;
}
