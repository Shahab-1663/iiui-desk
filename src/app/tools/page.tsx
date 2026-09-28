import type { Metadata } from "next";
import { StudentTools } from "@/components/student-tools";

export const metadata: Metadata = { title: "Student tools" };
export default function ToolsPage() {
  return <><section className="page-intro tools-intro"><span className="eyebrow">THE STUDENT TOOLKIT / 02 TOOLS</span><h1>Less guesswork.<br /><em>More momentum.</em></h1><p>Simple, private tools for planning your grades and protecting your study time. Nothing you enter here leaves your browser.</p><div className="intro-aside">TOOLS FOR THE LONG SEMESTER <span>NO SIGN IN NEEDED</span></div></section><StudentTools /></>;
}
