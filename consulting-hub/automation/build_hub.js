/**
 * THE EXECUTIVE CONSULTING HUB - One-click Google Workspace builder
 *
 * Creates the entire CLIENTS_2026 folder structure in Google Drive and the
 * two gate forms (Path A intake + Path B risk audit) with one run.
 *
 * HOW TO RUN:
 *   1. In Google Drive: New > More > Google Apps Script
 *   2. Delete the default code.gs content, paste this whole file
 *   3. Click Run > createHub (authorize Drive + Forms when prompted)
 *   4. Open each created form in the Forms editor to add your voice/copy
 *      from the consulting-hub/path-a|path-b markdown files, then set the
 *      form confirmation messages and connect responses to a Sheet.
 *
 * What it creates:
 *   - Drive folder tree: CLIENTS_2026 (PATH_A_ATHLETES/_TEMPLATES,
 *     PATH_B_SCHOOLS/_TEMPLATES, _OPERATIONS)
 *   - Form 01: Path A Intake and Legal Boundary Form (full questions)
 *   - Form 02: Path B Athletic Department Risk Audit (full questions)
 *
 * The Docs/Slides templates are authored from consulting-hub markdown;
 * this script only wires the forms + folder structure so storage works
 * end to end on day one.
 */

function createHub() {
  const root = createFolderTree();
  const intakeForm = buildIntakeForm(root);
  const auditForm = buildRiskAuditForm(root);
  logCreated(intakeForm, auditForm);
}

function createFolderTree() {
  const root = DriveApp.getFolderById(getOrCreateFolder("CLIENTS_2026", DriveApp.getRootFolder()));
  const pathA = DriveApp.getFolderById(getOrCreateFolder("PATH_A_ATHLETES", root));
  const pathB = DriveApp.getFolderById(getOrCreateFolder("PATH_B_SCHOOLS", root));
  const ops = DriveApp.getFolderById(getOrCreateFolder("_OPERATIONS", root));

  const tplA = DriveApp.getFolderById(getOrCreateFolder("_TEMPLATES", pathA));
  const tplB = DriveApp.getFolderById(getOrCreateFolder("_TEMPLATES", pathB));

  [ "01_LeadLog", "02_PainPoints_WinningLanguage", "03_PricingSheet", "04_Yearly_Calendar" ]
    .forEach((n) => getOrCreateFolder(n, ops));

  return { root: root, pathA: pathA, pathB: pathB, ops: ops, tplA: tplA, tplB: tplB };
}

/** Creates a folder inside parent if missing, returns its id. */
function getOrCreateFolder(name, parent) {
  const it = parent.getFoldersByName(name);
  if (it.hasNext()) return it.next().getId();
  return parent.createFolder(name).getId();
}

function buildIntakeForm(root) {
  const form = FormApp.create("Athlete Brand Architecture Intake and Legal Boundary Form");
  form.setDescription(
    "Jaylen Sinegal is an executive brand strategist, media IP consultant, and official " +
    "Louisiana Storyteller. This form maps the athlete's digital footprint and sets a legal " +
    "boundary. My work is education in brand architecture and media IP. It is NOT athlete " +
    "agency, and I do NOT negotiate athletic or endorsement contracts."
  );
  form.setConfirmationMessage(
    "Form received. A follow-up arrives within one business day. Nothing you submitted here " +
    "is a contract or an agent relationship."
  );
  form.setLimitOneResponsePerUser(true);
  form.setAllowResponseEdits(false);
  form.setCollectEmail(true);

  const S1 = form.addPageBreakItem().setTitle("The Athlete");
  addText(form, "Athlete name", true);
  addText(form, "Age", true);
  addDate(form, "Date of birth", true);
  const sport = form.addListItem().setTitle("Primary sport").setRequired(true);
  sport.setChoices(["Football","Basketball","Baseball","Track","Soccer","Softball","Other"]
    .map((c) => sport.createChoice(c)));
  addText(form, "High school (if applicable)", false);
  addText(form, "Graduation class year", false);
  addYesNo(form, "LHSAA member school?", true);

  const S2 = form.addPageBreakItem().setTitle("Digital Footprint");
  addText(form, "Social media accounts (full handles: Instagram, TikTok, X, YouTube)", true);
  addText(form, "Total combined followers", false);
  addYesNo(form, "Does the athlete have a highlight reel posted anywhere (Hudl, YouTube, Vimeo)?", true);
  addText(form, "Link to primary highlight reel", false);
  addYesNo(form, "Have local businesses already reached out about paid posts?", true);
  addYesNo(form, "Has the family signed any NIL agreement yet?", true);
  addYesNo(form, "If yes, does the family have a copy they fully understand?", false);

  const S3 = form.addPageBreakItem().setTitle("Parent / Guardian");
  addText(form, "Parent / legal guardian full name", false);
  addText(form, "Relationship to athlete", false);
  addText(form, "Parent / guardian email", false);
  addText(form, "Parent / guardian phone", false);
  addText(form, "Best contact email", true);
  const source = form.addListItem().setTitle("How did you hear about this consultation?").setRequired(true);
  source.setChoices(["Instagram","Website","Word of mouth","Clinic","FlightTime","Other"]
    .map((c) => source.createChoice(c)));

  const S4 = form.addPageBreakItem().setTitle("Expectations");
  addText(form, "What is the family hoping to achieve in this consultation?", true);
  addText(form, "What is the athlete's biggest concern about their online presence?", true);
  const intent = form.addListItem().setTitle("Recruitment visibility, media IP protection, or both?").setRequired(true);
  intent.setChoices(["Recruitment visibility","Media IP protection","Both","Not sure"]
    .map((c) => intent.createChoice(c)));
  const timeline = form.addListItem().setTitle("When does this matter most?").setRequired(true);
  timeline.setChoices(["Now","This season","By graduation","No rush"].map((c) => timeline.createChoice(c)));

  const S5 = form.addPageBreakItem().setTitle("Legal Boundary");
  const cb1 = form.addCheckboxItem().setTitle("Boundary agreement").setRequired(true);
  cb1.setChoices([cb1.createChoice(
    "I understand that Jaylen Sinegal provides media IP education and brand architecture. " +
    "He is NOT a registered athlete agent under Louisiana SB 389 and does not negotiate " +
    "athletic or endorsement contracts."
  )]);
  const cb2 = form.addCheckboxItem().setTitle("Education scope").setRequired(true);
  cb2.setChoices([cb2.createChoice(
    "I understand this consultation is education and strategy, not legal advice. Louisiana " +
    "NIL rules (Act 810, SB 389) can change; final decisions should be reviewed with " +
    "qualified professionals."
  )]);
  addText(form, "Electronic signature (full legal name)", true);
  addDate(form, "Date", true);

  return { id: form.getId(), url: form.shortenFormUrl() };
}

function buildRiskAuditForm(root) {
  const form = FormApp.create("Athletic Department NIL and Media Compliance Risk Audit");
  form.setDescription(
    "Act 810 governs high school NIL, parent consent, and amateur status. SB 389 (Act 895) " +
    "governs athlete agent registration with the Louisiana Attorney General. This 5-minute " +
    "audit maps where your program stands today. Completing it does not obligate your school " +
    "to anything."
  );
  form.setConfirmationMessage("Audit received. I'll follow up within one business day to set up a " +
    "discovery call. No obligation attached.");
  form.setLimitOneResponsePerUser(true);
  form.setCollectEmail(true);

  const S1 = form.addPageBreakItem().setTitle("School and Contact");
  addText(form, "School / district name", true);
  addText(form, "Parish / city", true);
  addText(form, "Athletic Director name", true);
  addText(form, "AD email", true);
  addText(form, "AD phone", true);
  addText(form, "Number of varsity sports", true);
  addText(form, "Approximate total student-athletes", true);
  addText(form, "School classification", true);

  const S2 = form.addPageBreakItem().setTitle("Act 810 - Consent and Policy");
  addYesNo(form, "Does your district have a written, board-approved NIL policy?", true);
  addYesNo(form, "Is there a single point of contact for NIL compliance?", true);
  addYesNo(form, "Does your process require written parent consent before a minor signs an NIL agreement?", true);
  addYesNo(form, "Do you track which athletes have submitted written consent?", true);
  addYesNo(form, "Have athletes or families asked you about NIL this year?", true);
  addYesNo(form, "Has any athlete signed an NIL agreement to your knowledge?", true);

  const S3 = form.addPageBreakItem().setTitle("SB 389 - Agent Verification");
  addYesNo(form, "Have outside people contacted your athletes this year?", true);
  addYesNo(form, "Do you have a system to verify AG registration for anyone acting as an agent?", true);
  addYesNo(form, "Have you shared SB 389 awareness material with parents or coaches?", true);
  const agents = form.addCheckboxItem().setTitle("Labels used by people contacting athletes (select all)")
    .setRequired(true);
  agents.setChoices(["Advisor","Recruiting consultant","Brand manager","Agent","Family friend","No one yet"]
    .map((c) => agents.createChoice(c)));

  const S4 = form.addPageBreakItem().setTitle("Media and Music Licensing");
  addYesNo(form, "Does your media team use commercial music in highlight reels?", true);
  const music = form.addListItem().setTitle("Do you use cleared or licensed music?").setRequired(true);
  music.setChoices(["Always","Sometimes","Never","Not sure"].map((c) => music.createChoice(c)));
  addYesNo(form, "Do you know the difference between a master recording and a sync license?", true);
  addYesNo(form, "Have you received a DMCA takedown or copyright claim on a school account?", true);
  addText(form, "Who manages your athletic social media accounts?", true);

  const S5 = form.addPageBreakItem().setTitle("Highlights and Footage");
  const hosts = form.addCheckboxItem().setTitle("Where are highlight films hosted?").setRequired(true);
  hosts.setChoices(["Hudl","YouTube","School website","X","Don't know"].map((c) => hosts.createChoice(c)));
  addYesNo(form, "Do athletes or families have independent access to their own film?", true);
  addYesNo(form, "Have you formalized media consent (photo/video) from parents this year?", true);
  addYesNo(form, "Does your program review platform terms before posting athlete content?", true);

  const S6 = form.addPageBreakItem().setTitle("Priority");
  addScale(form, "On a scale of 1-10, how confident are you that your program is compliant today?");
  const slot = form.addListItem().setTitle("Where would a clinic fit best?").setRequired(true);
  slot.setChoices(["Fall in-service","Admin day","Coach development day","Parent info night","Other"]
    .map((c) => slot.createChoice(c)));
  addText(form, "What is the single biggest compliance question you need answered?", true);
  const soon = form.addListItem().setTitle("How soon would your school like to address this?").setRequired(true);
  soon.setChoices(["Immediately","This season","This year","Researching"].map((c) => soon.createChoice(c)));

  return { id: form.getId(), url: form.shortenFormUrl() };
}

function addText(form, title, required) {
  form.addTextItem().setTitle(title).setRequired(required === true);
}
function addDate(form, title, required) {
  form.addDateItem().setTitle(title).setRequired(required === true);
}
function addYesNo(form, title, required) {
  const item = form.addMultipleChoiceItem().setTitle(title).setRequired(required === true);
  item.setChoiceValues(["Yes", "No", "Not sure"]);
}
function addScale(form, title) {
  const item = form.addScaleItem().setTitle(title).setRequired(true);
  item.setBounds(1, 10).setLabels("Not confident", "Fully confident");
}

function logCreated(intake, audit) {
  Logger.log("HUB READY.");
  Logger.log("Path A Intake: " + intake.url);
  Logger.log("Path B Risk Audit: " + audit.url);
  Logger.log("Open Forms editor to add final voice/copy and connect Sheets.");
}